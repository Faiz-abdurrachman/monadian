# Rencana Eksekusi & Roadmap 2 Bulan — Monadian

---

## 1. Ikhtisar Garis Waktu (Timeline Overview)

Total waktu pengembangan adalah **2 Bulan Penuh (8 Minggu)**, dengan target penting di awal: **Presentasi & Live Demo pada Monad Blitz Jogja Vol. 2 (Sabtu, 24 Oktober 2026, GIK UGM)**, lalu dilanjutkan dengan *deep polish* hingga peluncuran Mainnet Monad.

```
[ Minggu 1: 19 - 24 Okt 2026 ] ──> KONTRAK INTI & PROTOTIPE DEMO HACKATHON GIK UGM
[ Minggu 2: 26 Okt - 01 Nov  ] ──> ENGINE PIXI.JS 2D & MOBILE DRAG-AND-DROP UX
[ Minggu 3: 02 - 08 Nov 2026 ] ──> SISTEM TEMPUR ASINKRON & 3 SENJATA SABOTASE
[ Minggu 4: 09 - 15 Nov 2026 ] ──> EIP-7702 SESSION KEYS & ZERO-POPUP EXECUTION
[ Minggu 5: 16 - 22 Nov 2026 ] ──> MATCHMAKING LOBI 16P & PENGINDEKSAN ENVIO
[ Minggu 6: 23 - 29 Nov 2026 ] ──> POLISH AUDIO, HAPTIC, PARTIKEL & SPECTATOR
[ Minggu 7: 30 Nov - 06 Des  ] ──> STRESS TEST 100 LOBI, BOT VALIDATOR & AUDIT
[ Minggu 8: 07 - 14 Des 2026 ] ──> PUBLIC TESTNET TOURNAMENT & MAINNET READINESS
```

---

## 2. Rincian Milestone Mingguan (Week-by-Week Execution)

### Minggu 1: Kontrak Inti & Prototipe Demo Hackathon (19 – 24 Oktober 2026)
* **Fokus Utama:** Menyelesaikan logika matematika bitwise di Foundry dan prototipe web playable untuk dipresentasikan di Monad Blitz Jogja (24 Oktober).
* **Deliverables:**
  * Kontrak `MonadianGame.sol` dengan logika bitwise `uint64` dan deteksi baris/kolom.
  * Unit test Foundry dengan cakupan pengujian tabrakan balok 100%.
  * Deploy kontrak ke Monad Testnet (Chain ID `10143`).
  * Prototipe frontend fungsional: 1 papan 8x8 yang bisa ditaruh balok dan meledakkan garis di browser HP.
* **Definition of Done (DoD):** Juri di GIK UGM bisa mencoba menaruh balok di web demo dan melihat status papan tersimpan on-chain di testnet.

---

### Minggu 2: Engine Pixi.js 2D & Mobile Drag-and-Drop UX (26 Oktober – 01 November 2026)
* **Fokus Utama:** Membangun *game feel* yang super responsif, renyah (*juicy*), dan nyaman di layar sentuh HP.
* **Deliverables:**
  * Implementasi Pixi.js viewport dengan rasio aspek dinamis untuk seluruh ukuran layar smartphone.
  * Sistem drag-and-drop jempol dengan *ghost piece indicator* hijau/merah.
  * Animasi ledakan garis 60 FPS dan transisi balok baru yang mulus.
* **DoD:** Game berjalan stabil pada 60 FPS di perangkat Android murah tanpa lag sentuh.

---

### Minggu 3: Sistem Tempur Asinkron & 3 Senjata Sabotase (02 – 08 November 2026)
* **Fokus Utama:** Mengimplementasikan pola tempur *Asynchronous Combat Inbox* dan 3 senjata sabotase.
* **Deliverables:**
  * Kontrak `MonadianCombat.sol` dengan antrean inbox per pemain.
  * Mekanik peluncuran dan penerapan: *Glitch Stone* (batu kerikil), *Toxic Hand* (kutukan 3x3), dan *Frost Lock* (pembekuan petak).
  * Antarmuka HUD pemilih senjata dan integrasi *Mempool Mana Bar*.
* **DoD:** Pemain A bisa menembakkan Glitch Stone ke Pemain B, dan batu tersebut muncul di giliran Pemain B secara deterministik tanpa tabrakan memori validator.

---

### Minggu 4: EIP-7702 Session Keys & Zero-Popup Execution (09 – 15 November 2026)
* **Fokus Utama:** Menghilangkan seluruh jendela pop-up dompet di tengah pertempuran.
* **Deliverables:**
  * Integrasi Privy / Dynamic untuk pembuatan embedded wallet via akun sosial.
  * Alur pendelegasian otorisasi EIP-7702 pada saat masuk lobi (1x sign).
  * Modul penandatanganan otomatis di browser menggunakan *ephemeral private key* terenkripsi.
  * Pemanfaatan RPC `eth_sendRawTransactionSync` untuk konfirmasi langkah sub-detik.
* **DoD:** 60 detik pertandingan berlangsung tanpa ada satu pun pop-up dompet MetaMask/Privy yang menginterupsi layar pemain.

---

### Minggu 5: Matchmaking Lobi 16P & Pengindeksan Envio (16 – 22 November 2026)
* **Fokus Utama:** Membangun lobi multipemain massal dan sinkronisasi status real-time antar-pemain.
* **Deliverables:**
  * Pengindeks Envio HyperIndex untuk menangkap event `AttackDispatched` dan `PlayerEliminated`.
  * Sistem lobi matchmaking publik 16 pemain dan sistem Custom Room (Room Code).
  * Komponen radar mini 15 pemain di sekeliling layar utama dengan indikator laser penargetan.
* **DoD:** 16 pemain dapat masuk ke dalam satu antrean lobi dan bertanding secara sinkron dengan sinkronisasi posisi radar < 500ms.

---

### Minggu 6: Polish Audio, Haptic, Partikel Neon & Mode Penonton (23 – 29 November 2026)
* **Fokus Utama:** Memoles estetika visual dan audio agar setara dengan standar game mobile komersial.
* **Deliverables:**
  * Desain efek suara (SFX) sintetis neon cyberpunk: chimes bernada naik untuk kombo, dentuman bass saat garis pecah, dan sirene peringatan sabotase.
  * Integrasi API Web Haptics untuk getaran mikro saat balok terpasang dan meledak.
  * Transisi dinamis ke *Spectator Mode* saat pemain tereliminasi untuk menonton sisa pertarungan.
* **DoD:** Pengalaman bermain terasa adiktif dan memicu lonjakan dopamin sensorik dalam 10 detik pertama.

---

### Minggu 7: Stress Testing 100 Lobi, Bot Validator & Audit Keamanan (30 November – 06 Desember 2026)
* **Fokus Utama:** Pengujian beban ekstrem (*stress-test*) dan pengerasan keamanan kontrak pintar.
* **Deliverables:**
  * Skrip bot simulasi untuk menjalankan 100 pertandingan bersamaan (1.600 pemain simulasi) di Monad Testnet guna memverifikasi kestabilan throughput.
  * Pengujian ketahanan terhadap pemutusan koneksi internet mendadak (*disconnection tolerance*).
  * Audit mandiri internal menggunakan Slither dan Aderyn untuk mendeteksi potensi kerentanan reentrancy atau integer overflow.
* **DoD:** Kontrak berhasil memproses 100 lobi simultan tanpa ada transaksi yang revert akibat state contention.

---

### Minggu 8: Turnamen Publik Testnet & Kesiapan Mainnet (07 – 14 Desember 2026)
* **Fokus Utama:** Peluncuran kampanye turnamen publik bersama komunitas Monad global.
* **Deliverables:**
  * Gelaran *Monadian Community Cup #1* berhadiah total 500 MON sponsor.
  * Integrasi fitur *Share Victory Card* ke X dan Farcaster.
  * Finalisasi dokumentasi arsitektur dan kesiapan deployment ke Monad Mainnet.
* **DoD:** Mencapai 1.000+ pengguna aktif unik dan 10.000+ transaksi on-chain tervalidasi dalam minggu pertama kompetisi terbuka.

---

## 3. Rencana Mitigasi Risiko Demo (Contingency Plan)

| Potensi Masalah saat Demo Hackathon | Tingkat Dampak | Solusi & Protokol Mitigasi |
| :--- | :--- | :--- |
| **Koneksi Wi-Fi GIK UGM Lambat / Padat** | Tinggi | Klien Pixi.js memiliki *Local Optimistic Simulation Engine* yang langsung mengeksekusi animasi di layar HP secara instan tanpa menunggu respons jaringan, lalu merekonsiliasi state di background. |
| **RPC Node Monad Publik Mengalami Rate Limit** | Sedang | Menyiapkan 2 endpoint RPC cadangan pribadi (QuickNode / Alchemy private endpoints) yang otomatis berpindah (*auto-failover*) jika RPC default down. |
| **Juri Tidak Punya Saldo MON di Dompetnya** | Rendah | Mengaktifkan mode *Free Practice Arena* atau *Sponsored Cup*, serta bot sponsor internal yang otomatis mendanai gas delegasi juri saat pertama kali scan QR code. |
