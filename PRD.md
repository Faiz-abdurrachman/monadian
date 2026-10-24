# Product Requirements Document (PRD) — BlitzGrid

---

## 1. Executive Summary & Product Vision

### 1.1 Visi Produk
Menjadikan **BlitzGrid** sebagai gerbang adopsi massal (*consumer onboarding funnel*) terdepan di ekosistem Monad melalui game teka-teki kompetitif berbasis ketangkasan murni (*skill-based esports*). BlitzGrid membuktikan keunggulan arsitektur eksekusi paralel Monad bukan lewat grafik teknis yang membosankan, melainkan melalui pengalaman bermain 16–32 pemain sinkron berdurasi 60 detik yang cepat, mulus, dan adiktif di perangkat seluler.

### 1.2 Masalah Pasar (Problem Statement)
1. **Game Web3 Membosankan & Berpenghalang Tinggi:** Kebanyakan game Web3 menuntut instalasi dompet yang rumit, pembelian NFT mahal di muka, atau memiliki alur giliran yang lambat (*sluggish turn-based*).
2. **Ketiadaan Mode Multipemain pada Game Puzzle Populer:** Game nomor #1 di dunia saat ini, *Block Blast*, dimainkan oleh ratusan juta orang secara solo offline tanpa ada elemen kompetisi langsung antar-pemain.
3. **Keterbatasan Rantai EVM Sekuensial:** Pada blockchain Ethereum atau L2 biasa, pembuatan game multiplayer dengan 16 orang yang berinteraksi dalam interval sub-detik akan menyebabkan kemacetan penyimpanan (*state contention*) dan lonjakan biaya gas yang mustahil ditanggung pemain kasual.

### 1.3 Solusi BlitzGrid
BlitzGrid menggabungkan mekanik intuitif penempatan balok 8x8 dengan sistem sabotase multipemain battle royale, di mana kombo garis menghasilkan amunisi untuk mengunci ruang lawan. Game ini berjalan 100% di atas Monad EVM menggunakan status papan 64-bit dan arsitektur *Asynchronous Combat Inbox*, disajikan dalam antarmuka PWA Pixi.js ultra-ringan dengan *zero pop-up wallet* berkat delegasi EIP-7702.

---

## 2. Target User Personas

### Persona A: "The Campus Casual" (Mahasiswa / Pemain Kasual Mobile)
* **Karakter:** Berusia 18–25 tahun, terbiasa main Block Blast / Candy Crush di sela-sela jam kuliah atau nongkrong di kafe.
* **Kebutuhan:** Game yang bisa dimainkan instan di browser HP tanpa install aplikasi berat, ronde cepat di bawah 1 menit, dan bisa mabar bareng teman satu meja.
* **Pain Point Web3:** Malas bikin dompet kripto, takut ketipu (*phishing*), benci pop-up konfirmasi.
* **Solusi BlitzGrid:** Cukup login 1 klik pakai akun Google via Privy, langsung masuk arena latihan gratis atau turnamen 500 perak tanpa rasa ribet Web3.

### Persona B: "The Monad Degen / Competitor" (Web3 Native Gamer)
* **Karakter:** Pemegang token MON aktif, sering mencoba dApp baru di Testnet/Mainnet Monad, menyukai taruhan ketangkasan (*skill-gaming*) dan kompetisi leaderboard.
* **Kebutuhan:** Membuktikan kehebatan mekanik Monad (transaksi cepat, gas murah), membungkus prize pool harian dari sponsor protokol.
* **Pain Point Web3:** Muak dengan game ponzi yang tokennya dump dalam 3 hari.
* **Solusi BlitzGrid:** Pot hadiah atomik transparan, sistem anti-cheat deterministik on-chain, dan turnamen harian bersponsor resmi.

---

## 3. Core Value Proposition (USP)

1. **True Mobile-First UX:** Papan 8x8 pas secara ergonomis untuk jempol satu tangan di layar smartphone.
2. **Deterministic On-Chain Fairness:** Pembangkitan balok acak dan target serangan dikunci oleh on-chain randomness (Pyth VRF / Monad block hash seed)—bebas dari campur tangan bandar atau developer.
3. **Hyper-Efficient Gas Architecture:** Papan 64 petak muat dalam 1 storage slot (`uint64`), menekan konsumsi gas hingga di bawah 5.000 gas per langkah penempatan balok.
4. **Zero-Popup Session Execution:** Pemain menandatangani sesi 1 kali di awal, dan seluruh 60 detik pertandingan berjalan tanpa interupsi pop-up dompet.

---

## 4. Rincian Fitur Produk (Feature Specifications)

### 4.1 Modul Onboarding & Akun (Auth & Wallet Delegation)
* **Embedded Wallet Integration:** Integrasi Privy / Dynamic untuk pembuatan embedded wallet otomatis melalui Email, Google, atau X (Twitter).
* **External Wallet Connector:** Opsi koneksi MetaMask, Rabby, Phantom, dan WalletConnect untuk pengguna Web3 native.
* **EIP-7702 / Session Key Delegation:**
  * Kontrak pendelegasian sesi memberikan izin sementara (*ephemeral key*) di memori browser untuk menandatangani transaksi langkah balok dan jurus sabotase selama 1 ronde (maksimal 120 detik).
  * Batas pengeluaran gas dan fungsi dikunci ketat hanya pada kontrak `BlitzGridGame.sol`.

### 4.2 Modul Game Engine & Rendering (Frontend)
* **Rendering Engine:** Pixi.js (WebGL / HTML5 Canvas 2D) dengan target performa **60 FPS stabil di smartphone mid-range ke bawah**.
* **Visual Theme:** *Neon Cyberpunk Monad* (palet warna Deep Violet `#200052`, Neon Purple `#836EF9`, Bright Aqua `#00F0FF`, dan Glitch Red `#FF0055`).
* **Input Mechanics:**
  * Sentuh & Seret (Touch Drag-and-Drop) dengan area sentuh toleran (*fat-finger friendly*).
  * Bayangan penempatan balok (*ghost placement indicator*) berwarna hijau jika muat, merah jika bertabrakan.
* **Haptic & Audio Feedback:** Getaran mikro HP dan audio efek nada naik (*ascending pitch chimes*) setiap kali kombo beruntun terpicu.

### 4.3 Modul Lobi & Matchmaking
* **Mode 1: Quick Blitz Matchmaking (Publik 16 Pemain):**
  * Tombol *"Play Now"* langsung menempatkan pemain ke antrean matchmaking.
  * Begitu kuota 16 pemain terpenuhi (atau waktu tunggu 10 detik habis dengan sisa slot diisi AI Bot Validator), hitung mundur 3 detik dimulai.
* **Mode 2: Custom Room (Kamar Komunitas 4–32 Pemain):**
  * Pembuat ruangan (*host*) dapat membagikan 6-digit Room Code atau link undangan langsung.
  * Opsi kustomisasi:
    * Kapasitas Pemain: 4, 8, 16, atau 32 pemain.
    * Durasi Ronde: 60 detik, 90 detik, atau *Sudden Death*.
    * Preset Aturan: *Standard Mayhem* (dengan sabotase batu) atau *Pure Zen* (adu skor tanpa serangan batu).
    * Model Tiket: Gratis (Free-to-Play) atau Custom Entry Fee (misal 0.5 MON).

### 4.4 Modul Smart Contract & Combat Engine
* **Pola Asynchronous Combat Inbox:**
  * Pemain A menembakkan serangan -> tercatat di outbox Pemain A -> memancarkan `emit AttackDispatched(...)`.
  * Status papan Pemain B baru diperbarui oleh transaksi Pemain B sendiri pada saat memproses langkah balok berikutnya.
  * Menghilangkan 100% kemungkinan tabrakan penyimpanan antar-pemain di mesin konsensus Monad.
* **Penyelesaian Hadiah Atomik (Atomic Prize Settlement):**
  * Kontrak mendeteksi eliminasi pemain secara instan.
  * Saat tersisa 1 pemenang (*Last Survivor*), fungsi penyelesaian langsung mendistribusikan saldo pot hadiah (65% Juara 1, 20% Juara 2, 10% Juara 3, 5% Burned) dalam satu blok finalitas (800ms).

---

## 5. Non-Functional Requirements (Kriteria Non-Fungsional)

| Parameter | Spesifikasi Minimum | Target Optimal |
| :--- | :--- | :--- |
| **Frame Rate Rendering** | 30 FPS di browser Android kelas bawah | 60 FPS mentok tanpa stuttering partikel |
| **Ukuran Bundle Frontend** | < 3.5 MB total initial load | < 1.8 MB (aset dikompresi WebP & sprite sheets) |
| **Latensi Respon Serangan** | < 1.2 detik (3 blok) | **400 ms – 800 ms (1–2 blok Monad)** |
| **Konsumsi Gas per Turn** | < 15.000 gas | **< 5.000 gas (operasi bitwise uint64)** |
| **Keamanan Kontrak** | Zero reentrancy, integer overflow safe, input sanitized via bitmask | Diaudit mandiri via test suite Foundry |

---

## 6. Metrik Keberhasilan (KPIs)

### A. Metrik Hackathon Monad Blitz Jogja (24 Oktober 2026)
* **Demo Reliability:** 100% sukses menjalankan live battle 16 pemain bersama juri di panggung GIK UGM tanpa crash atau desync.
* **Time-to-Play:** Pemain baru bisa mulai bermain dalam waktu **kurang dari 10 detik** sejak scan QR code di layar proyektor.

### B. Metrik Pasca-Peluncuran Testnet/Mainnet
* **Match Completion Rate:** > 92% pemain menyelesaikan ronde 60 detik sampai tuntas.
* **Replay Rate (Stickiness):** Rata-rata pemain memainkan minimal 5 pertandingan berturut-turut per sesi.
* **On-Chain Transactions:** Menghasilkan rata-rata 300+ transaksi mikro per lobi 16 pemain, menjadikannya salah satu kontributor volume transaksi aktif terbesar di Monad.
