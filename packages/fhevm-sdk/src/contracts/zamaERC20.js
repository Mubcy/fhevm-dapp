// ESM module, targets ethers v5
import { ethers } from 'ethers';


// Minimal ABI for common ERC20 operations + optional mint (if contract exposes it)
const ZAMA_ERC20_ABI = [
// ERC20
'function name() view returns (string)',
'function symbol() view returns (string)',
'function decimals() view returns (uint8)',
'function totalSupply() view returns (uint256)',
'function balanceOf(address) view returns (uint256)',
'function transfer(address to, uint256 amount) returns (bool)',
'function approve(address spender, uint256 amount) returns (bool)',
'function allowance(address owner, address spender) view returns (uint256)',
// optional mint/burn commonly added in test tokens
'function mint(address to, uint256 amount)',
'function burn(uint256 amount)'
];


/**
* Get a contract instance for ZamaERC20
* @param {string} address - deployed contract address
* @param {ethers.providers.Provider|ethers.Signer} providerOrSigner
* @returns {ethers.Contract}
*/
export function getContract(address, providerOrSigner) {
if (!address) throw new Error('contract address required');
return new ethers.Contract(address, ZAMA_ERC20_ABI, providerOrSigner);
}


/**
* Read balance (returns string of full wei-like amount)
*/
export async function getBalance(address, account, provider) {
if (!provider) throw new Error('provider is required');
const c = getContract(address, provider);
const bal = await c.balanceOf(account);
return bal.toString();
}


/**
* Mint tokens (only works if the contract has a public mint and signer has permission)
*/
export async function mint(address, to, amount, signer) {
if (!signer) throw new Error('signer required to mint');
const c = getContract(address, signer);
if (typeof c.mint !== 'function') throw new Error('contract does not expose mint()');
const tx = await c.mint(to, amount);
return tx.wait();
}


/**
* Transfer tokens from signer to `to`.
* `amount` should be a BigNumber, string of wei-like units, or result of parseUnits.
*/
export async function transfer(address, to, amount, signer) {
if (!signer) throw new Error('signer required to transfer');
const c = getContract(address, signer);
const tx = await c.transfer(to, amount);
return tx.wait();
}


/**
* Helper: parse human amount using decimals (default 18)
*/
export async function parseAmount(value, address, provider, decimalsFallback = 18) {
try {
const c = getContract(address, provider);
const dec = await c.decimals();
return ethers.utils.parseUnits(String(value), dec);
} catch (e) {
// fallback to provided decimals
return ethers.utils.parseUnits(String(value), decimalsFallback);
}
}


export const zamaERC20 = {
getContract,
getBalance,
mint,
transfer,
parseAmount,
};