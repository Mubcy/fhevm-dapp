// scripts/test_erc20.js
// Run with: npm run test:erc20

import { erc20 } from '../src/index.js';
import { ethers } from 'ethers';

async function main() {
  const RPC_URL = 'http://127.0.0.1:8545';
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const signer = provider.getSigner(0);

  // Replace with your deployed ZamaERC20 address:
  const TOKEN_ADDR = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

  console.log('--- ERC20 Test ---');
  console.log('RPC:', RPC_URL);
  console.log('Token:', TOKEN_ADDR);

  const name = await erc20.tokenName(TOKEN_ADDR, provider);
  const symbol = await erc20.tokenSymbol(TOKEN_ADDR, provider);
  const dec = await erc20.tokenDecimals(TOKEN_ADDR, provider);
  console.log('Name:', name);
  console.log('Symbol:', symbol);
  console.log('Decimals:', dec);

  const addr = await signer.getAddress();
  const balance = await erc20.balanceFormatted(TOKEN_ADDR, addr, provider);
  console.log('Balance of', addr, '→', balance);

  // Optional self-transfer example
  // const tx = await erc20.transferToken(TOKEN_ADDR, signer, addr, '0.01');
  // console.log('Transfer tx hash:', tx.transactionHash);

  console.log('✅ ERC20 test completed');
}

main().catch(e => {
  console.error('Error running ERC20 test:', e);
  process.exit(1);
});
