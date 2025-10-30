import { cryptoSDK } from '../index.js'; // or import { crypto } if you exported that

async function main() {
  console.log('Running fhevm-sdk sign/verify smoke test...');
  const wallet = cryptoSDK.generateWallet();
  const msg = 'hello fhevm sdk';
  const sig = await wallet.signMessage(msg); // <--- await here
  const recovered = cryptoSDK.recoverAddressFromSig(msg, sig);
  console.log('Generated wallet address:', wallet.address);
  console.log('Signature:', sig);
  console.log('Recovered address:', recovered);
  if (wallet.address.toLowerCase() === recovered.toLowerCase()) {
    console.log('✅ sign / verify OK');
  } else {
    console.error('❌ sign / verify failed');
  }
}

main().catch(e => console.error('Error in test:', e));
