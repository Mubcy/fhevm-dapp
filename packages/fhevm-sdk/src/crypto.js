import { ethers } from 'ethers';

// Simple wallet + sign/verify helpers
export function generateWallet() {
  return ethers.Wallet.createRandom();
}

export async function signMessage(wallet, message) {
  const signature = await wallet.signMessage(message);
  return signature;
}

export function recoverAddressFromSig(message, signature) {
  const msgHash = ethers.hashMessage(message);
  const recovered = ethers.recoverAddress(msgHash, signature);
  return recovered;
}

// Basic encryption test (not FHE)
export function encryptText(keyHex, text) {
  const key = Buffer.from(keyHex, 'hex');
  const textBytes = Buffer.from(text, 'utf8');
  const cipherBytes = textBytes.map((b, i) => b ^ key[i % key.length]);
  return Buffer.from(cipherBytes).toString('hex');
}

export function decryptText(keyHex, cipherHex) {
  const key = Buffer.from(keyHex, 'hex');
  const cipherBytes = Buffer.from(cipherHex, 'hex');
  const textBytes = cipherBytes.map((b, i) => b ^ key[i % key.length]);
  return Buffer.from(textBytes).toString('utf8');
}

export function generateRandomKey() {
  return ethers.hexlify(ethers.randomBytes(16));
}
