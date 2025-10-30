// src/token.js
// Helper functions used by App.jsx for reading token info.
// Uses ethers v6 style (BrowserProvider/JsonRpcProvider, formatUnits, parseUnits)

import { ethers } from "ethers";
import tokenABI from "./abi/Token.json";

const rpcUrl = import.meta.env.VITE_RPC_URL;
const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;

// Return a read-only provider pointed at VITE_RPC_URL
export function getProvider() {
  if (!rpcUrl) throw new Error("VITE_RPC_URL is not set in env");
  return new ethers.JsonRpcProvider(rpcUrl);
}

// Return a read-only token contract (provider)
export function getTokenContract(provider = null) {
  const p = provider ?? getProvider();
  if (!tokenAddress) throw new Error("VITE_TOKEN_ADDRESS is not set in env");
  return new ethers.Contract(tokenAddress, tokenABI, p);
}

// Safe format helper: attempt to format using provided decimals, with fallback
function safeFormatUnits(value, decimals = 18) {
  try {
    return ethers.formatUnits(value, decimals);
  } catch (err) {
    // fallback: return raw string (bigint) if formatting fails
    console.warn("formatUnits failed, returning raw value:", err);
    try { return value.toString(); } catch(e){ return String(value); }
  }
}

// Read token info: name, symbol, decimals, totalSupply (formatted)
export async function getTokenInfo() {
  const provider = getProvider();
  const token = getTokenContract(provider);

  // Prepare result object with defaults
  const result = {
    name: "UNKNOWN",
    symbol: "UNKNOWN",
    decimals: 18,
    totalSupply: "0",
  };

  // Name & symbol (some tokens throw; handle gracefully)
  try {
    const name = await token.name();
    if (name) result.name = name;
  } catch (err) {
    console.warn("Could not read name():", err);
  }

  try {
    const symbol = await token.symbol();
    if (symbol) result.symbol = symbol;
  } catch (err) {
    console.warn("Could not read symbol():", err);
  }

  // Decimals: attempt to read; if it fails, fallback to 18
  let decimals = 18;
  try {
    const dec = await token.decimals();
    // decimals may be BigNumber/int
    decimals = Number(dec);
    if (Number.isNaN(decimals)) decimals = 18;
    result.decimals = decimals;
  } catch (err) {
    console.warn("Could not read decimals(), defaulting to 18:", err);
    result.decimals = 18;
  }

  // totalSupply: attempt to read and format using decimals
  try {
    const supply = await token.totalSupply();
    result.totalSupply = safeFormatUnits(supply, result.decimals);
  } catch (err) {
    console.warn("Could not read totalSupply():", err);

    // Try a fallback: make a low-level eth_call to the method selector for totalSupply()
    try {
      // Method selector for totalSupply() is 0x18160ddd
      const callData = "0x18160ddd";
      const raw = await provider.call({
        to: tokenAddress,
        data: callData
      });
      // If we get '0x' or empty, fallback to "0"
      if (!raw || raw === "0x") {
        result.totalSupply = "0";
      } else {
        // raw is hex-encoded uint256
        const bn = ethers.BigInt(raw);
        result.totalSupply = safeFormatUnits(bn, result.decimals);
      }
    } catch (err2) {
      console.warn("Fallback call for totalSupply also failed:", err2);
      result.totalSupply = "0";
    }
  }

  return result;
}

// Export a helper: getRawBalance(address) -> formatted string using decimals
export async function getFormattedBalance(address) {
  if (!address) throw new Error("address required");
  const provider = getProvider();
  const token = getTokenContract(provider);
  const bal = await token.balanceOf(address);
  // read decimals to format
  let decimals = 18;
  try {
    decimals = Number(await token.decimals());
    if (Number.isNaN(decimals)) decimals = 18;
  } catch (_) {
    decimals = 18;
  }
  return safeFormatUnits(bal, decimals);
}
