# 🚀 LIVE DEMO

**Frontend:** [https://frontend-g14uvjayg-jimohadam61-9416s-projects.vercel.app)
USE:
**Token Address:** `0x8464135c8F25Da09e49BC8782676a84730C318bC`  
**Local RPC:** `http://127.0.0.1:8545`
It was a last minute update that enables any tester to use their own prefered RPC and token address when needed.



# 🪙 MyToken DApp — FHEVM ERC-20 Dashboard (ALL-IN-ONE SETUP)

> **MyToken DApp** is a fully local ERC-20 dashboard built with **Foundry**, **Solidity**, and **React (Vite)**.  
> It demonstrates smart contract deployment, on-chain data retrieval, and frontend integration — forming a foundation for future **Fully Homomorphic Encryption (FHE)**-enabled DApps.  
> The project showcases how developers can bridge private computation (FHEVM) with standard Ethereum tools in an open, modular architecture.


**One-shot instructions**: everything you need to go from repo on disk → local blockchain → deployed token → frontend running → commit & push.  
These commands are written for **Windows PowerShell**. Run them in order from the project root (`C:\Users\User\Documents\fhevm-dapp`).

---

## 📘 Project summary
A simple ERC-20 token + React (Vite) dashboard.  
It uses **Foundry** (`forge`, `cast`, `anvil`) to deploy and **ethers.js** to read on-chain token info.  
Frontend connects to a local FHEVM/Ethereum-compatible network (`127.0.0.1:8545`).

---

## 🚀 Features

- 🧾 View token details: name, symbol, decimals, and total supply  
- 👛 Connect any wallet (MetaMask) for interaction  
- 🔍 Read live on-chain data via `ethers.js`  
- ⚙️ Local deployment and debugging with Foundry  
- 🎨 Clean React + Vite frontend  
- 🧱 SDK scripts for encryption, ERC-20 helpers, and testing  

---

## 🧠 Tech Stack

| Layer | Tools |
|-------|-------|
| **Smart Contract** | Solidity `^0.8.20`, OpenZeppelin ERC-20 |
| **Backend / Dev Tools** | Foundry (`forge`, `cast`, `anvil`) |
| **Frontend** | React + Vite |
| **Web3 Library** | ethers.js v6 |
| **Node.js** | ≥ v18 |

---

## 📦 Project Structure

fhevm-dapp/
├── src/ # Solidity contract(s)
│ └── Token.sol
├── packages/
│ └── fhevm-sdk/ # SDK helper scripts & encryption utils
├── frontend/
│ ├── src/ # React frontend
│ ├── public/
│ └── vite.config.js
├── constructor-args.json
├── foundry.lock
├── README.md
└── .gitignore


---

## ⚙️ Local Setup & Run Instructions

1️⃣ Clone the repo
```bash
git clone https://github.com/Mubcy/fhevm-dapp.git
cd fhevm-dapp

2️⃣ Install frontend dependencies
cd frontend
npm install
cd ..

3️⃣ Start the local blockchain
anvil
# Leave this running (default RPC: http://127.0.0.1:8545)

4️⃣ Deploy the Token contract
forge create src/Token.sol:Token \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <PRIVATE_KEY> \
  --broadcast \
  --constructor-args "MyToken" "MTK" 1000000

Take note of the Deployed to: address — that’s your token contract.

5️⃣ Create .env in frontend/
VITE_RPC_URL=http://127.0.0.1:8545
VITE_TOKEN_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>

6️⃣ Run frontend
cd frontend
npm run dev

Then open http://localhost:5173
✅ You should see:
🪙 Token Dashboard
MyToken (MTK)
Decimals: 18
Total Supply: 1000000000000000000000000

🧩 Smart Contract
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(string memory name_, string memory symbol_, uint256 initialSupply)
        ERC20(name_, symbol_)
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}

🧪 Example Output

Local Deployment
Deployer: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Deployed to: 0x1275D096B9DBf2347bD2a131Fb6BDaB0B4882487
Transaction hash: 0xecb03ffb257d13d9d65c0b727c08772aaf20a19f6b93c4dbe01ae059959510a9

Frontend Display
🪙 Token Dashboard
MyToken (MTK)
Decimals: 18
Total Supply: 1000000000000000000000000

🏆 Submission Information
| Field            | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| **Project Name** | MyToken DApp — FHEVM ERC-20 Dashboard                                      |
| **Developer**    | Mubcy                                                                      |
| **Network**      | Local FHEVM (127.0.0.1:8545)                                               |
| **Languages**    | Solidity, JavaScript                                                       |
| **Frameworks**   | Foundry + React (Vite)                                                     |
| **Repository**   | [https://github.com/Mubcy/fhevm-dapp](https://github.com/Mubcy/fhevm-dapp) |

💡 Future Enhancements

● Wallet connect & transfer UI

● FHE encryption for token privacy

● Testnet deployment

● Dark/light theme toggle

● Dynamic wallet balance display

🧾 Submission Summary

MyToken DApp is a local FHEVM-compatible ERC-20 dashboard that displays live token details using Foundry and Vite.
It connects to MetaMask, retrieves data via ethers.js, and showcases FHEVM readiness.
Built with Solidity, React, and Foundry, this project demonstrates secure contract deployment and token visualization in a clean interface.

📜 License

MIT © 2025 Mubcy
