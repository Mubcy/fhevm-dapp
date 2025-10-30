// src/contracts.js
import { ethers } from 'ethers';

/**
 * Returns a JsonRpcProvider (defaults to localhost:8545)
 */
export function getProvider(rpcUrl = 'http://127.0.0.1:8545') {
  return new ethers.providers.JsonRpcProvider(rpcUrl);
}

/**
 * Get a signer wallet connected to provider from privateKey (0x...).
 */
export function getSignerFromPrivateKey(privateKey, rpcUrl = 'http://127.0.0.1:8545') {
  const provider = getProvider(rpcUrl);
  return new ethers.Wallet(privateKey, provider);
}

/**
 * Create contract instance (ethers.Contract) from ABI and address.
 * signerOrProvider can be either a signer or provider.
 */
export function getContract(address, abi, signerOrProvider) {
  return new ethers.Contract(address, abi, signerOrProvider);
}
