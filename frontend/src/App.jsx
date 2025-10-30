// Log environment variables (good for debugging)
console.log('VITE_RPC_URL:', import.meta.env.VITE_RPC_URL);
console.log('VITE_TOKEN_ADDRESS:', import.meta.env.VITE_TOKEN_ADDRESS);

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getTokenInfo } from "./token";
import tokenABI from "./abi/Token.json"; // ✅ make sure this file exists

function App() {
  // -------------------------------
  // Token Info State
  // -------------------------------
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  // -------------------------------
  // Wallet + Transfer State
  // -------------------------------
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const rpcUrl = import.meta.env.VITE_RPC_URL;
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;

  // -------------------------------
  // Connect Wallet
  // -------------------------------
  async function connectWallet() {
    try {
      if (!window.ethereum) return alert("Please install MetaMask first!");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      console.log("Connected wallet:", address);
      loadBalance(address);
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  }

  // -------------------------------
  // Load Token Balance
  // -------------------------------
  async function loadBalance(address) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const token = new ethers.Contract(tokenAddress, tokenABI, provider);
      const bal = await token.balanceOf(address);
      setBalance(ethers.formatUnits(bal, 18));
    } catch (err) {
      console.error("Balance load error:", err);
    }
  }

  // -------------------------------
  // Send Tokens
  // -------------------------------
  async function sendTokens() {
    try {
      if (!window.ethereum) return alert("Please install MetaMask!");
      if (!recipient || !amount) return alert("Enter recipient and amount!");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(tokenAddress, tokenABI, signer);

      const tx = await token.transfer(recipient, ethers.parseUnits(amount, 18));
      alert("Transaction submitted! Hash: " + tx.hash);
      await tx.wait();
      alert("✅ Transfer confirmed!");
      loadBalance(await signer.getAddress());
    } catch (err) {
      console.error("Transfer error:", err);
      alert("❌ Transfer failed: " + err.message);
    }
  }

  // -------------------------------
  // Fetch Token Info (existing logic)
  // -------------------------------
  useEffect(() => {
    async function fetchTokenInfo() {
      try {
        const data = await getTokenInfo();
        setInfo(data);
      } catch (err) {
        console.error("Error fetching token info:", err);
        setError(err.message);
      }
    }

    fetchTokenInfo();
  }, []);

  // -------------------------------
  // UI Render
  // -------------------------------
  if (error) return <div style={{ color: "red" }}>⚠️ Error: {error}</div>;
  if (!info) return <p>Loading token info...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🪙 Token Dashboard</h1>

      <h2>
        {info.name} ({info.symbol})
      </h2>
      <p><b>Decimals:</b> {info.decimals}</p>
      <p><b>Total Supply:</b> {info.totalSupply}</p>

      <hr style={{ margin: "2rem 0" }} />

      {/* WALLET CONNECTION */}
      <div>
        <h3>💳 Wallet</h3>
        {account ? (
          <p>Connected: {account}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
        <p>
          <b>Balance:</b> {balance} {info.symbol}
        </p>
      </div>

      {/* TOKEN TRANSFER */}
      {account && (
        <div style={{ marginTop: "1rem" }}>
          <h3>📤 Send Tokens</h3>
          <input
            placeholder="Recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ display: "block", marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }}
          />
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ display: "block", marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }}
          />
          <button onClick={sendTokens}>Send Tokens</button>
        </div>
      )}
    </div>
  );
}

export default App;
