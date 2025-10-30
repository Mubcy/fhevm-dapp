// scripts/debug_token.js
import { ethers } from 'ethers';

async function main() {
  const RPC = 'http://127.0.0.1:8545';
  const provider = new ethers.providers.JsonRpcProvider(RPC);

  const tokenAddr = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // your address
  console.log('Token:', tokenAddr);

  // 1) Does code exist at the address?
  const code = await provider.getCode(tokenAddr);
  console.log('getCode length:', code.length, code === '0x' ? '(NO CODE at address!)' : '(code present)');

  // 2) Check balance / nonce (sanity)
  const bal = await provider.getBalance(tokenAddr);
  console.log('ETH balance (wei):', bal.toString());

  // 3) Raw provider.call with name() selector (simulate)
  const nameSelector = '0x06fdde03'; // name()
  try {
    const ret = await provider.call({ to: tokenAddr, data: nameSelector });
    console.log('provider.call(name()) returned:', ret);
    if (ret && ret !== '0x') {
      console.log('raw hex (truncated):', ret.slice(0,200));
    }
  } catch (err) {
    console.error('provider.call threw error:', err && err.message ? err.message : err);
  }

  // 4) Try estimateGas for name() (should be 0 for view but will show revert reason sometimes)
  try {
    const g = await provider.estimateGas({ to: tokenAddr, data: nameSelector });
    console.log('estimateGas(name):', g.toString());
  } catch (err) {
    console.error('estimateGas error:', err && err.reason ? err.reason : (err && err.message) || err);
  }

  // 5) Try calling other standard ERC-20 view selectors:
  const selectors = {
    symbol: '0x95d89b41',
    decimals: '0x313ce567',
    totalSupply: '0x18160ddd'
  };
  for (const [k, sel] of Object.entries(selectors)) {
    try {
      const r = await provider.call({ to: tokenAddr, data: sel });
      console.log(`${k} -> returned length ${r.length} ${r === '0x' ? '(empty hex)' : ''}`);
    } catch (e) {
      console.error(`${k} call error:`, e && e.message ? e.message : e);
    }
  }

  // 6) Give a small `eth_getTransactionReceipt` for the deployment tx if you have the hash:
  // (uncomment + set your tx hash if known)
  // const txHash = '0xed8cd9c1e6135e88...';
  // const rec = await provider.getTransactionReceipt(txHash);
  // console.log('deploy receipt:', rec);

  console.log('--- done ---');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
