// src/tests/test_encrypt.js
import { encryption } from '../index.js';

async function main() {
  console.log('Running encryption smoke test...');
  const key = encryption.generateSymmetricKeyHex();
  console.log('Key hex (truncated):', key.slice(0,16) + '...');

  const plaintext = 'hello fhevm sdk - secret!';
  const { ivHex, authTagHex, ciphertextHex } = encryption.encryptDataWithKeyHex(key, plaintext);
  console.log('Ciphertext hex (truncated):', ciphertextHex.slice(0,32) + '...');

  const recovered = encryption.decryptDataWithKeyHex(key, ivHex, authTagHex, ciphertextHex);
  console.log('Recovered:', recovered);

  if (recovered === plaintext) {
    console.log('✅ encryption smoke test OK');
  } else {
    console.error('❌ encryption test failed');
    process.exit(2);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
