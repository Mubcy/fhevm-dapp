// packages/fhevm-sdk/src/token.js
import { ethers } from 'ethers';

/**
 * Minimal ERC20 ABI (read + basic write).
 * Enough for name(), symbol(), decimals(), totalSupply(), balanceOf(), transfer()
 */
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

/**
 * getProvider(rpcUrl)
 * - returns ethers provider
 */
export function getProvider(rpcUrl = 'http://127.0.0.1:8545') {
  return new ethers.providers.JsonRpcProvider(rpcUrl);
}

/**
 * getReadContract(address, provider)
 * - returns a contract instance for read calls
 */
export function getReadContract(address, provider) {
  return new ethers.Contract(address, ERC20_ABI, provider);
}

/**
 * getContractWithSigner(address, privateKey, provider)
 * - returns a contract connected to signer for write txns
 */
export function getContractWithSigner(address, privateKey, provider) {
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(address, ERC20_ABI, wallet);
}

/**
 * readTokenInfo(address, rpcUrl)
 * - convenience method that returns { name, symbol, decimals, totalSupply }
 */
export async function readTokenInfo(address, rpcUrl = 'http://127.0.0.1:8545') {
  const provider = getProvider(rpcUrl);
  const c = getReadContract(address, provider);

  // note: wrap in try/catch where you call this to handle empty/EOA addresses
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    c.name(),
    c.symbol(),
    c.decimals(),
    c.totalSupply(),
  ]);

  return { name, symbol, decimals: Number(decimals), totalSupply: totalSupply.toString() };
}

/**
 * getBalance(address, tokenAddress, rpcUrl)
 */
export async function getTokenBalance(tokenAddress, account, rpcUrl = 'http://127.0.0.1:8545') {
  const provider = getProvider(rpcUrl);
  const c = getReadContract(tokenAddress, provider);
  const bal = await c.balanceOf(account);
  return bal.toString();
}
