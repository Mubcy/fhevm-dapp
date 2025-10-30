// src/helpers/erc20.js
// Small set of ergonomic ERC-20 helpers that use dynamic import of ethers
// so it is resilient to different ethers export shapes (v5 / v6).

async function _ethers() {
  // dynamic import so module resolution works in different setups
  const E = await import('ethers');
  // normalize: prefer named exports, fall back to default
  return E.ethers ? E.ethers : E;
}

const MINIMAL_ABI = [
  // reads
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  // writes
  "function transfer(address,uint256) returns (bool)",
  "function approve(address,uint256) returns (bool)",
  "function transferFrom(address,address,uint256) returns (bool)",
  // optional
  "function increaseAllowance(address,uint256) returns (bool)",
  "function decreaseAllowance(address,uint256) returns (bool)",
  "function mint(address,uint256)",
  "function burn(uint256)"
];

export async function getERC20Contract(address, providerOrSigner) {
  const ethers = await _ethers();
  return new ethers.Contract(address, MINIMAL_ABI, providerOrSigner);
}

// ------- read helpers -------
export async function tokenName(address, provider) {
  const c = await getERC20Contract(address, provider);
  return c.name ? await c.name() : null;
}
export async function tokenSymbol(address, provider) {
  const c = await getERC20Contract(address, provider);
  return c.symbol ? await c.symbol() : null;
}
export async function tokenDecimals(address, provider) {
  const c = await getERC20Contract(address, provider);
  try {
    return c.decimals ? await c.decimals() : 18;
  } catch (e) {
    // fallback: assume 18 if call fails
    return 18;
  }
}
export async function totalSupply(address, provider) {
  const c = await getERC20Contract(address, provider);
  return await c.totalSupply();
}
export async function balanceOf(address, holder, provider) {
  const c = await getERC20Contract(address, provider);
  return await c.balanceOf(holder);
}
export async function allowance(address, owner, spender, provider) {
  const c = await getERC20Contract(address, provider);
  return await c.allowance(owner, spender);
}

// ------- format helpers -------
export async function parseAmount(amountString, decimals) {
  const ethers = await _ethers();
  return ethers.utils.parseUnits(amountString, decimals);
}
export async function formatAmount(bn, decimals) {
  const ethers = await _ethers();
  return ethers.utils.formatUnits(bn, decimals);
}
export async function balanceFormatted(address, holder, provider) {
  const dec = await tokenDecimals(address, provider);
  const b = await balanceOf(address, holder, provider);
  return formatAmount(b, dec);
}

// ------- write helpers (require signer) -------
async function _sendAndWait(txPromise) {
  const tx = await txPromise;
  return tx.wait(1); // wait 1 confirmation
}

export async function transferToken(address, signer, to, amountString) {
  const dec = await tokenDecimals(address, signer.provider || signer);
  const value = await parseAmount(amountString, dec);
  const c = await getERC20Contract(address, signer);
  return _sendAndWait(c.transfer(to, value));
}

export async function approve(address, signer, spender, amountString) {
  const dec = await tokenDecimals(address, signer.provider || signer);
  const value = await parseAmount(amountString, dec);
  const c = await getERC20Contract(address, signer);
  return _sendAndWait(c.approve(spender, value));
}

export async function increaseAllowance(address, signer, spender, amountString) {
  const dec = await tokenDecimals(address, signer.provider || signer);
  const value = await parseAmount(amountString, dec);
  const c = await getERC20Contract(address, signer);
  if (c.increaseAllowance) {
    return _sendAndWait(c.increaseAllowance(spender, value));
  }
  // fallback: read current allowance and set to current + value using approve
  const owner = await signer.getAddress();
  const cur = await c.allowance(owner, spender);
  const ethers = await _ethers();
  const newAmt = cur.add(value);
  return _sendAndWait(c.approve(spender, newAmt));
}

export async function decreaseAllowance(address, signer, spender, amountString) {
  const dec = await tokenDecimals(address, signer.provider || signer);
  const value = await parseAmount(amountString, dec);
  const c = await getERC20Contract(address, signer);
  if (c.decreaseAllowance) {
    return _sendAndWait(c.decreaseAllowance(spender, value));
  }
  // fallback: read current allowance and set to current - value (min 0)
  const owner = await signer.getAddress();
  const cur = await c.allowance(owner, spender);
  const ethers = await _ethers();
  let newAmt = cur.sub(value);
  if (newAmt.lt(0)) newAmt = ethers.BigNumber.from(0);
  return _sendAndWait(c.approve(spender, newAmt));
}

// tryMint / tryBurn: friendly attempts (many tokens don't implement)
export async function tryMint(address, signer, to, amountString) {
  const dec = await tokenDecimals(address, signer.provider || signer);
  const value = await parseAmount(amountString, dec);
  const c = await getERC20Contract(address, signer);
  if (!c.mint) throw new Error("mint() not available on token");
  return _sendAndWait(c.mint(to, value));
}
export async function tryBurn(address, signer, amountString) {
  const dec = await tokenDecimals(address, signer.provider || signer);
  const value = await parseAmount(amountString, dec);
  const c = await getERC20Contract(address, signer);
  if (!c.burn) throw new Error("burn() not available on token");
  return _sendAndWait(c.burn(value));
}

// convenience export (optional)
export default {
  getERC20Contract,
  tokenName, tokenSymbol, tokenDecimals, totalSupply,
  balanceOf, allowance, balanceFormatted,
  parseAmount, formatAmount,
  transferToken, approve, increaseAllowance, decreaseAllowance,
  tryMint, tryBurn
};
