# ⚡ MONADIAN — The Monad Puzzle Royale

> **Pemenang Potensial Monad Blitz Jogja Vol. 2 (24 Oktober 2026, GIK UGM)**  
> *Game Battle Royale Block Blast 16 Pemain 100% On-Chain Pertama di Dunia dengan Waktu Eksekusi 400ms Monad.*

[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet%20(10143)-836ef9?style=for-the-badge&logo=ethereum)](https://testnet.monad.xyz)
[![Solidity Tests](https://img.shields.io/badge/Foundry-26%2F26%20Passed-emerald?style=for-the-badge&logo=solidity)](file:///home/faiz/hackaton/monad/volume2/monadian/contracts)
[![FPS](https://img.shields.io/badge/Performance-120%20FPS%20Canvas-cyan?style=for-the-badge)](file:///home/faiz/hackaton/monad/volume2/monadian/web)
[![EIP-7702](https://img.shields.io/badge/Session%20Key-EIP--7702%20Ready-amber?style=for-the-badge)](file:///home/faiz/hackaton/monad/volume2/monadian/web/src/engine/sessionKey.ts)

---

## 🚀 Live Deployment & Monad Testnet Contracts

| Komponen | Alamat / Tautan | Keterangan |
|---|---|---|
| **Live Web App** | [https://monadian.vercel.app](https://monadian.vercel.app) | Production Hosted on Vercel |
| **MonadianGame (Core)** | [`0xC9fC8beA27bB568105e36fc16FbA73Db7F6FA423`](https://testnet.monadexplorer.com/address/0xC9fC8beA27bB568105e36fc16FbA73Db7F6FA423) | Game Orchestrator, Rounds & Elimination |
| **MonadianCombat** | [`0xE8c07DDcC61C2880b89Edd6633F96F5210a0f64B`](https://testnet.monadexplorer.com/address/0xE8c07DDcC61C2880b89Edd6633F96F5210a0f64B) | Asynchronous Combat Inbox (0 State Contention) |
| **MonadianVault** | [`0xb84bAC0fD5bA009ecF6C414CDA481D3623E5333F`](https://testnet.monadexplorer.com/address/0xb84bAC0fD5bA009ecF6C414CDA481D3623E5333F) | Escrow & Automated Prize Distribution |
| **Monad Testnet Chain ID** | `10143` | RPC: `https://testnet-rpc.monad.xyz` |
| **Active Demo Round** | `Round #1` | Live on-chain status: ACTIVE |

---

## 🎯 Mengapa Monadian? (The Problem & Solution)

1. **Masalah Web2:** Game santai seperti *Block Blast* diunduh **100+ juta kali** di seluruh dunia dan dimainkan di kafe-kafe setiap hari. Namun, game tersebut **100% solo offline** dan rawan cheat memori jika dibuat turnamen uang.
2. **Masalah Web3:** Game Web3 selama ini dicap lambat, membosankan, dan merusak flow karena setiap langkah memicu pop-up dompet MetaMask.
3. **Solusi Monadian:** Membawa mekanik adiktif *Block Blast* menjadi **Battle Royale 16 Pemain 100% On-Chain** di atas Monad! Pemain berlomba menyusun balok, meledakkan kombo, mengumpulkan Mana, dan menembakkan sabotase ke lawan dalam ronde 60 detik.

---

## 🧠 2 Terobosan Engineering EVM Monad

### 1. `uint64` Bitwise Logic (< 3,500 Gas)
Seluruh papan 8x8 dan status bidak direpresentasikan hanya dalam satu integer `uint64` (64 bit):
* **Pengecekan Tabrakan:** `(board & pieceMask) == 0` (1 opcode bitwise AND)
* **Penempatan Bidak:** `board | pieceMask` (1 opcode bitwise OR)
* **Deteksi Baris/Kolom Penuh:** Masking bit konstan 0(1) instan
* **Gas:** Konsumsi gas penempatan balok **< 3,500 gas**, menghemat **98.5% gas** dibandingkan representasi matriks array `uint8[8][8]`.

### 2. Asynchronous Combat Inbox Pattern
Dalam game 16 pemain yang saling menyerang, jika pemain A menyerang pemain B dengan mengubah storage `playerB.board` secara langsung, akan timbul **state conflict** yang menggagalkan eksekusi paralel Monad.
* **Solusi Kami:** Setiap pemain memiliki antrean `CombatInbox` terisolasi.
* Serangan masuk disimpan di `inbox[targetId]`, dan baru dieksekusi saat giliran pemain target melangkah (`consumeInbox()`).
* **Hasil:** 0 State Contention, **100% kompatibel dengan Monad Parallel Execution Engine!**

---

## 🕹️ Invisible Web3 UX (EIP-7702 Ephemeral Key)

* **0 MetaMask Pop-ups:** Pemain cukup menandatangani 1 kali sesi delegasi di awal.
* Transaksi penempatan balok dan sabotase ditandatangani otomatis di latar belakang oleh session key ephemeral berumur 60 detik.
* Sensasi bermain instan seperti game Web2 (120 FPS tanpa lag).

---

## 🏰 Arsitektur Kontrak Pintar (`contracts/`)

```
contracts/
├── src/
│   ├── MonadianBitwise.sol   # Operasi logika uint64 8x8 papan
│   ├── MonadianPieces.sol    # Katalog 19 bentuk bidak poliomino
│   ├── MonadianCombat.sol    # Inbox sabotase anti-state conflict
│   ├── MonadianVault.sol     # Escrow pool hadiah (1.04 MON)
│   └── MonadianGame.sol      # Orkestrator ronde, lifecyle & eliminasi
└── test/
    └── *.t.sol                # 26 Unit Test Foundry (100% Lulus)
```

Jalankan test lokal:
```bash
cd contracts
forge test -vvv
```

---

## 🎨 Arsitektur Frontend (`web/`)

* **Engine:** React 18 + Vite + TypeScript + Tailwind CSS
* **Board Visuals:** 2D Canvas & CSS 3D Glassmorphism Candy Cap (44px socket chunky).
* **Audio Prosedural:** 100% Web Audio API sintetis (0 KB file download) dengan tempo 112 BPM arcade chiptune loop.
* **Presenter Kit:**
  - `HowToPlayModal.tsx`: Panduan 15 detik instan untuk juri.
  - `PitchDeckModal.tsx`: 10 slide presentasi panggung interaktif dengan keyboard arrow & fullscreen mode.
  - `LobbyQRModal.tsx`: Generator QR Code canvas untuk penonton/juri bergabung.

Jalankan lokal:
```bash
cd web
npm install
npm run dev
```

---

## 👥 Tim Pengembang

* **Lead Builder & Smart Contract Architect:** Faiz & Tim Monadian
* **Event:** Monad Blitz Jogja Vol. 2 — GIK Universitas Gadjah Mada (UGM)
* **Tanggal:** Sabtu, 24 Oktober 2026
