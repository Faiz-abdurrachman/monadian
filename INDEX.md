---
name: Monadian
created: 2026-10-19
updated: 2026-10-19
status: planning
version: 1.0.0
---

# Dokumen Perencanaan & Spesifikasi — Monadian

> **The Monad Puzzle Royale — Fast, Furious, Fully On-Chain.**

---

## Daftar Dokumen

| File | Isi & Fungsi |
| :--- | :--- |
| **[`INDEX.md`](file:///home/faiz/hackaton/monad/volume2/monadian/INDEX.md)** | File ini — navigasi utama, status dokumen, quick reference (*Source of Truth*), dan alur baca |
| **[`ringkasan-30-detik.md`](file:///home/faiz/hackaton/monad/volume2/monadian/ringkasan-30-detik.md)** | Pitch 30 detik, punchline juri, tagline, metafora visual, dan killer hook |
| **[`PRD.md`](file:///home/faiz/hackaton/monad/volume2/monadian/PRD.md)** | *Product Requirements Document*: visi produk, target persona, problem-solution, feature specs, dan metrik sukses |
| **[`mekanik-game.md`](file:///home/faiz/hackaton/monad/volume2/monadian/mekanik-game.md)** | Peta mekanik game lengkap: aturan 8x8, katalog balok, sistem kombo, formula Mana, 3 senjata sabotase, target matrix, win/loss, dan custom room |
| **[`arsitektur-teknis.md`](file:///home/faiz/hackaton/monad/volume2/monadian/arsitektur-teknis.md)** | Arsitektur sistem: *Asynchronous Combat Inbox Pattern*, *uint64 bitwise board state*, zero-popup EIP-7702, dan integrasi event indexing |
| **[`smart-contracts.md`](file:///home/faiz/hackaton/monad/volume2/monadian/smart-contracts.md)** | Detail kontrak Solidity lengkap: struct data, mapping, function signature, formula gas, dan pseudocode implementasi |
| **[`flow-gameplay.md`](file:///home/faiz/hackaton/monad/volume2/monadian/flow-gameplay.md)** | User journey & flowchart state machine dari connect wallet, session delegation, match finding, live combat, sampai payout pot |
| **[`kenapa-monad.md`](file:///home/faiz/hackaton/monad/volume2/monadian/kenapa-monad.md)** | Deep dive mutlak *Why Blockchain & Why Monad*, perbandingan vs Ethereum/Base/Solana, legal framing esports (anti-judol), dan bantahan kritik juri |
| **[`roadmap.md`](file:///home/faiz/hackaton/monad/volume2/monadian/roadmap.md)** | Action plan 2 bulan build menuju demo 24 Oktober 2026 di Monad Blitz (fase contract, game engine Pixi.js, UI/UX, playtesting, dan demo pitch) |
| **[`biaya.md`](file:///home/faiz/hackaton/monad/volume2/monadian/biaya.md)** | Estimasi biaya development, gas fee per match, sponsorship revenue model, dan token burn economics |
| **[`presentasi.md`](file:///home/faiz/hackaton/monad/volume2/monadian/presentasi.md)** | Pitch deck 3 menit untuk juri Monad Blitz Jogja di Monad Blitz (Slide 1–10 + naskah demo 30 detik WOW factor) |

---

## Ringkasan Eksekutif

**Monadian** adalah game *multiplayer grid puzzle battle royale* pertama di dunia yang berjalan sepenuhnya di atas blockchain Monad (*fully on-chain state*). Mengadaptasi mekanik adiktif *Block Blast* (game mobile nomor #1 di dunia) yang ditransformasikan menjadi pertarungan eliminasi massal 16–32 pemain berdurasi 60 detik. 

Pemain menyusun balok di atas papan 8x8 untuk meledakkan garis dan mengumpulkan *Mempool Mana*. Mana tersebut digunakan untuk meluncurkan serangan sabotase langsung (*Glitch Stones, Toxic Hand, Frost Lock*) ke papan lawan. Pemain yang kehabisan ruang kosong tereliminasi, dan *last player standing* membawa pulang hadiah turnamen secara instan (*atomic settlement*).

Seluruh status papan pemain dienkapsulasi ke dalam **satu variabel `uint64` (64-bit)** dan diselesaikan secara murni paralel menggunakan konsensus **MonadBFT (400ms block time)** dan arsitektur **Asynchronous Combat Inbox Pattern** yang 100% bebas benturan status (*zero state contention*).

* **Target Event:** Monad Blitz Jogja Vol. 2 (Sabtu, 24 Oktober 2026, Monad Blitz)
* **Durasi Build:** 2 Bulan Penuh (Oktober – Desember 2026)
* **Status:** Dokumen Perencanaan Lengkap, Siap Eksekusi Kode

---

## Quick Reference (Source of Truth)

> **PENTING:** Tabel ini adalah acuan tunggal (*single source of truth*). Seluruh dokumen dan parameter kode wajib sinkron dengan angka di bawah ini.

| Komponen | Spesifikasi Parameter | Penjelasan Teknis |
| :--- | :--- | :--- |
| **Ukuran Grid** | `8 x 8` Petak (64 Bit) | Muat presisi dalam 1 variabel `uint64` Solidity (8 byte per player) |
| **Jumlah Pemain** | `16 Pemain` (Default) / `32 Max` | Matchmaking publik 16 pemain; Custom room mendukung 4, 8, 16, 32 |
| **Durasi Ronde** | `60 Detik` (Default) | Pacing kilat (*blitz*); opsi custom 90s atau *Sudden Death* |
| **Blitz Turn Timer** | `4 Detik` per Gerakan | Jika waktu habis, sistem otomatis meletakkan balok pertama acak |
| **Siklus Balok Tangan** | `3 Balok Acak` (*Pack of 3*) | 3 balok baru hanya dibagikan jika 3 balok di tangan sudah terpasang semua |
| **Rotasi Balok** | `TIDAK BISA DIPUTAR` | Orientasi paten, memaksa pemikiran spasial cepat |
| **Line Clears** | Horizontal & Vertikal | Row clear, Column clear, dan Cross clear (keduanya pecah bersamaan) |
| **Senjata 1: Glitch Stone** | Biaya: `30 Mana` | Melempar 1 batu abu-abu ke petak kosong acak papan lawan |
| **Senjata 2: Toxic Hand** | Biaya: `60 Mana` | Mengganti 1 balok di tangan musuh jadi balok kotak raksasa 3x3 |
| **Senjata 3: Frost Lock** | Biaya: `90 Mana` | Membekukan 3 petak kosong lawan selama 3 giliran (tidak bisa ditaruh balok) |
| **Kondisi Kalah** | *No Valid Moves* | Ketiga balok di tangan tidak muat di sisa petak kosong papan |
| **Tiket Turnamen** | `0.1 MON` (Micro-Bracket) / `Free` | Tersedia mode *Free Practice* & *Sponsored Protocol Cups* |
| **Alokasi Hadiah** | `1st: 65% / 2nd: 20% / 3rd: 10% / Burn: 5%` | Alokasi otomatis via smart contract dalam finalitas 800ms |
| **Chain & Network** | Monad Testnet (`10143`) → Mainnet (`143`) | Target RPC resmi Monad |
| **Tech Stack** | Solidity 0.8.26 (Foundry) + Pixi.js / Canvas 2D + Next.js 14 + Privy (EIP-7702) + Envio | 60 FPS mobile-first neon cyberpunk |

---

## Alur Pembacaan yang Disarankan

1. **Untuk Memahami Visi & Pitch (10 Menit):**
   * Baca [`ringkasan-30-detik.md`](file:///home/faiz/hackaton/monad/volume2/monadian/ringkasan-30-detik.md) → Menguasai punchline & konsep.
   * Baca [`kenapa-monad.md`](file:///home/faiz/hackaton/monad/volume2/monadian/kenapa-monad.md) → Menguasai argumen "Kenapa Blockchain & Kenapa Monad" serta bantahan juri.
2. **Untuk Memahami Desain Game & User Flow (20 Menit):**
   * Baca [`PRD.md`](file:///home/faiz/hackaton/monad/volume2/monadian/PRD.md) → Memahami kebutuhan produk & user persona.
   * Baca [`mekanik-game.md`](file:///home/faiz/hackaton/monad/volume2/monadian/mekanik-game.md) → Membedah aturan main, balok, kombo, dan formula senjata.
   * Baca [`flow-gameplay.md`](file:///home/faiz/hackaton/monad/volume2/monadian/flow-gameplay.md) → Menelusuri alur layar dan state machine dari awal hingga payout.
3. **Untuk Mengimplementasikan Kode & Kontrak (Teknis Dev):**
   * Baca [`arsitektur-teknis.md`](file:///home/faiz/hackaton/monad/volume2/monadian/arsitektur-teknis.md) → Pahami arsitektur *Combat Inbox* & paralelisme Monad.
   * Baca [`smart-contracts.md`](file:///home/faiz/hackaton/monad/volume2/monadian/smart-contracts.md) → Pahami struktur data, ABI, dan kode Solidity Foundry.
   * Baca [`roadmap.md`](file:///home/faiz/hackaton/monad/volume2/monadian/roadmap.md) & [`biaya.md`](file:///home/faiz/hackaton/monad/volume2/monadian/biaya.md) → Rencana pengerjaan 8 minggu dan budget operasional.
4. **Untuk Hari-H Demo Hackathon di Monad Blitz:**
   * Buka [`presentasi.md`](file:///home/faiz/hackaton/monad/volume2/monadian/presentasi.md) → Naskah slide dan skrip demo 30 detik *live match*.
