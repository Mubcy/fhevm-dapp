// Simple node script to test contract integration with a running local node (anvil/hardhat)
import { ethers } from 'ethers';
import { zamaERC20 } from '../contracts/zamaERC20.js';
import fs from 'fs';


async function main() {
const RPC = process.env.RPC_URL || 'http://127.0.0.1:8545';
const PRIVATE_KEY = process.env.PRIVATE_KEY || null; // set to a deployer key when needed
const CONTRACT_ADDR = process.env.CONTRACT_ADDR || null; // address of your deployed ZamaERC20


if (!CONTRACT_ADDR) {
console.error('Please set CONTRACT_ADDR (env) to your deployed ZamaERC20 address');
process.exit(1);
}


const provider = new ethers.providers.JsonRpcProvider(RPC);
let signer = null;
if (PRIVATE_KEY) signer = new ethers.Wallet(PRIVATE_KEY, provider);


const accounts = await provider.listAccounts();
const acct0 = accounts[0] || (signer ? await signer.getAddress() : null);
if (!acct0) {
console.error('No account available from provider and PRIVATE_KEY not set');
process.exit(1);
}


console.log('Using RPC:', RPC);
console.log('Using contract:', CONTRACT_ADDR);
console.log('Test account:', acct0);


// read balance
const balBefore = await zamaERC20.getBalance(CONTRACT_ADDR, acct0, provider);
console.log('balance before:', balBefore);


// If signer available, try mint (if function exists) and transfer
if (signer) {
try {
const mintAmount = await zamaERC20.parseAmount('1000', CONTRACT_ADDR, provider, 18);
console.log('Attempting mint of', mintAmount.toString());
const r = await zamaERC20.mint(CONTRACT_ADDR, acct0, mintAmount, signer);
console.log('mint tx ok:', r.transactionHash);
} catch (e) {
console.log('mint failed or not available (this is fine on some ERC20s):', e.message);
}


// transfer a tiny amount to another account (if present)
const to = accounts[1] || acct0; // if only one account, self-transfer
try {
const amt = await zamaERC20.parseAmount('1', CONTRACT_ADDR, provider, 18);
console.log(`Transferring ${amt.toString()} to ${to} ...`);
const t = await zamaERC20.transfer(CONTRACT_ADDR, to, amt, signer);
console.log('transfer tx ok:', t.transactionHash);
} catch (e) {
console.log('transfer failed:', e.message);
}
} else {
console.log('No PRIVATE_KEY provided — skipping write operations (mint/transfer).');
}

const balAfter = await zamaERC20.getBalance(CONTRACT_ADDR, acct0, provider);
console.log('balance after:', balAfter);
}


main().catch(e => { console.error(e); process.exit(1); });