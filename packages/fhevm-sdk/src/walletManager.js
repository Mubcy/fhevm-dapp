// src/walletManager.js
import { ethers } from 'ethers';

/**
 * Create a random wallet (ethers Wallet instance).
 */
export function generateWallet() {
  return ethers.Wallet.createRandom();
}

/**
 * Create a wallet from a private key (0x...).
 */
export function walletFromPrivateKey(privateKeyHex) {
  return new ethers.Wallet(privateKeyHex);
}

/**
 * Sign an arbitrary string message with a wallet (returns signature hex).
 */
export async function signMessage(wallet, message) {
  // wallet: ethers.Wallet instance
  return wallet.signMessage(message);
}

/**
 * Recover an address from (message, signature).
 */
export function recoverAddressFromSig(message, signature) {
  return ethers.utils.verifyMessage(message, signature);
}
