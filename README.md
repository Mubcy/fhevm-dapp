# 🪙 MyToken DApp — FHEVM ERC-20 Dashboard

A simple ERC-20 Token Dashboard built with **Foundry**, **Solidity**, and **React (Vite)**.  
This DApp connects to a local FHEVM / Ethereum-compatible network to display live token info and wallet data.

---

## 🚀 Features
- View token **name**, **symbol**, **decimals**, and **total supply**
- Connect any wallet (MetaMask)
- Read on-chain data using **ethers.js**
- Uses **Foundry** for contract deployment and **Vite** for frontend development

---

## 🧩 Tech Stack
- **Solidity** `^0.8.20`
- **Foundry** (`forge`, `cast`)
- **React + Vite**
- **ethers.js v6`
- **Node.js v18+`

---

## ⚙️ Smart Contract
**File:** `src/Token.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply
    ) ERC20(name_, symbol_) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
