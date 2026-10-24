# ⚡ MONADIAN — The 16-Player Monad Puzzle Royale

> **Built for Monad Blitz Jogja V2 (24 October 2026 — Garuda Spark Innovation Hub)**  
> *The world's first 100% on-chain 16-player Block Blast Battle Royale powered by Monad's 400ms parallel execution.*

[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet%20(10143)-836ef9?style=for-the-badge&logo=ethereum)](https://testnet.monad.xyz)
[![Solidity Tests](https://img.shields.io/badge/Foundry-28%2F28%20Passed-emerald?style=for-the-badge&logo=solidity)](contracts/)
[![FPS](https://img.shields.io/badge/Performance-120%20FPS%20Canvas-cyan?style=for-the-badge)](web/)
[![EIP-7702](https://img.shields.io/badge/Session%20Key-EIP--7702%20Ready-amber?style=for-the-badge)](web/src/engine/sessionKey.ts)

---

## 🚀 Live Deployment & Monad Testnet Contracts

| Component | Link / Address | Status |
|---|---|:---:|
| **🌐 Live Web App** | [https://monadian.vercel.app](https://monadian.vercel.app) | Live on Vercel ✅ |
| **📜 MonadianGame (Core)** | [`0xC9fC8beA27bB568105e36fc16FbA73Db7F6FA423`](https://testnet.monadexplorer.com/address/0xC9fC8beA27bB568105e36fc16FbA73Db7F6FA423) | **Verified (Exact Match)** ✅ |
| **⚔️ MonadianCombat** | [`0xE8c07DDcC61C2880b89Edd6633F96F5210a0f64B`](https://testnet.monadexplorer.com/address/0xE8c07DDcC61C2880b89Edd6633F96F5210a0f64B) | **Verified (Exact Match)** ✅ |
| **🏦 MonadianVault** | [`0xb84bAC0fD5bA009ecF6C414CDA481D3623E5333F`](https://testnet.monadexplorer.com/address/0xb84bAC0fD5bA009ecF6C414CDA481D3623E5333F) | **Verified (Exact Match)** ✅ |
| **⛓️ Network** | Monad Testnet (`10143`) | RPC: `https://testnet-rpc.monad.xyz` |
| **🎮 Active Demo Round** | `Round #1` | **Status: ACTIVE** on-chain |

---

## ⚡ Quickstart: Run in 60 Seconds

### 1. Smart Contracts & Foundry Tests
```bash
cd contracts
forge test -vvv
# Output: 28 tests passed, 0 failed (100% pass rate in ~21ms)
```

### 2. Run Web Frontend
```bash
cd web
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## 🎯 The Problem & The Monad Solution

* **The Web2 Problem:** Casual games like *Block Blast* have **100M+ downloads worldwide**, but they are 100% offline solo games vulnerable to client-side memory tampering if real-money stakes are involved.
* **The Web3 Problem:** Web3 games are notoriously sluggish with disruptive MetaMask confirmation popups interrupting gameplay flow.
* **The Monadian Solution:** Translating the addictive Block Blast mechanic into a **16-Player 100% On-Chain Battle Royale**! Players place polyomino pieces, blast lines, accumulate Mana, and fire live sabotage missiles at opponents in fast-paced 60-second rounds.

---

## 🧠 2 Core Monad EVM Engineering Breakthroughs

### 1. `uint64` Bitwise Board Logic (< 3,500 Gas)
The entire 8x8 grid is stored inside a single `uint64` integer (64 bits):
* **Collision Check:** `(board & pieceMask) == 0` (1 bitwise AND opcode)
* **Piece Placement:** `board | pieceMask` (1 bitwise OR opcode)
* **Instant Line Clearance:** Constant bitmasks with zero loops
* **Gas Consumption:** **< 3,500 gas** per move, saving **98.5% gas** compared to traditional matrix array representations (`uint8[8][8]`).

### 2. Asynchronous Combat Inbox Pattern (Parallel Execution Safe)
In a 16-player PvP match where players attack each other simultaneously, directly modifying an opponent's storage slot (`playerB.board`) causes **state contention**, breaking Monad's parallel execution pipelining.
* **Our Solution:** Each player possesses an isolated `CombatInbox`.
* Incoming sabotages are queued into `inbox[targetId]`.
* Sabotages are executed only when the target player takes their next turn (`consumeInbox()`).
* **Result:** **Zero State Contention**, 100% optimized for the Monad Parallel Execution Engine!

---

## 🕹️ Invisible Web3 UX (EIP-7702 Ephemeral Session Key)

* **0 MetaMask Popups During Match:** Sign once at lobby entry.
* Move placements and sabotage attacks are signed in the background via ephemeral session keys with instant 400ms finality.
* Plays like a high-end Web2 game (120 FPS Three.js Canvas).

---

## 🏰 Smart Contract Architecture (`contracts/`)

```
contracts/
├── src/
│   ├── MonadianBitwise.sol   # uint64 8x8 bitwise board math & clearance
│   ├── MonadianPieces.sol    # Deterministic catalog of 19 polyomino pieces
│   ├── MonadianCombat.sol    # Asynchronous Combat Inbox anti-state conflict
│   ├── MonadianVault.sol     # Non-custodial escrow pool & prize split
│   └── MonadianGame.sol      # Main orchestrator, lifecycle & elimination
└── test/
    └── *.t.sol                # 28 Unit Tests (100% Passed)
```

---

## 🎨 Frontend Architecture (`web/`)

* **Engine:** React 18 + Vite + TypeScript + Tailwind CSS
* **Board Visuals:** Three.js 3D Voxel Candy Cap Grid with tactile socket physics.
* **Procedural Audio:** 100% synthetic Web Audio API arcade chiptune loops (0 KB network assets).
* **Presenter Kit:** Built-in Stage Pitch Deck Modal, QR Code Joiner, and Host Spectator Views.

---

## 👥 Builders & Team

* **Lead Builder & Smart Contract Architect:** Faiz & Monadian Team
* **Event:** Monad Blitz Jogja Vol. 2 (24 October 2026)
* **Venue:** Garuda Spark Innovation Hub — Yogyakarta
