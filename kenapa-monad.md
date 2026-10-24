# Mengapa Blockchain & Mengapa Harus Monad? — Monadian

---

## 1. Pertanyaan Mendasar: "Kenapa Harus Blockchain? Kenapa Gak Web2 Aja di Server Biasa?"

Kritik paling umum dari orang awam terhadap game Web3 adalah:  
> *"Block Blast kan udah ada di App Store gratis dan mulus, ngapain dibikin versi blockchain?"*

Ini jawaban fundamentalnya: **Ada 3 masalah struktural di industri game Web2 yang HANYA BISA DISELESAIKAN oleh teknologi blockchain:**

### 1.1 Masalah Integritas & Kecurangan Server (Server Rigging & Cheat)
* **Kelemahan Web2:** Di game puzzle Web2 yang mengadakan turnamen berhadiah uang (seperti platform Skillz, Pocket7Games, atau AviaGames), kecurigaan terbesar pemain adalah **kecurangan algoritma server terpusat**. Server Web2 bisa diam-diam memanipulasi balok yang keluar—pemain sengaja dikasih balok jelek di detik-detik terakhir agar kalah dan bandar/platform meraup keuntungan.
* **Solusi Blockchain di Monadian:** 
  * Pembangkitan urutan balok dan sasaran serangan dikunci secara **deterministik menggunakan on-chain entropy (Pyth VRF / Monad block hash seed)**.
  * Setiap penempatan balok dan ledakan garis diverifikasi secara transparan oleh smart contract publik.
  * **Tidak ada satu pun manusia di dunia—termasuk developer pembuat game—yang bisa mencurangi atau mengatur siapa yang menang.** Integritas kompetisi terjamin 100% adil (*Provably Fair*).

### 1.2 Masalah Pembayaran Mikro Global Instan (Atomic Micro-Payouts)
* **Kelemahan Web2:** Di Web2, mustahil membuat turnamen berhadiah receh Rp 1.000 antar-pemain dari Indonesia, Brasil, dan Jepang. Biaya transfer bank internasional, potongan kartu kredit (30%), biaya penarikan PayPal ($5–$10), verifikasi KTP berhari-hari, dan batasan batas negara membunuh ekonomi turnamen mikro.
* **Solusi Blockchain di Monadian:** 
  * Smart contract `MonadianVault.sol` bertindak sebagai escrow tanpa perantara (*trustless vault*).
  * Begitu ronde 60 detik selesai, saldo pot hadiah **langsung ditransfer secara atomik ke dompet pemenang dalam waktu 800 milidetik**. Biaya transaksi hanya sepersekian rupiah ($0.00004), bisa dimainkan siapa pun di seluruh planet bumi tanpa diskriminasi geografis.

### 1.3 Komposabilitas Likuiditas & Model Bisnis Baru (Sponsorship Protokol)
* Di Web2, game mengandalkan iklan pop-up 30 detik yang merusak keseruan bermain.
* Di Web3 Monad, protokol DeFi atau komunitas token (seperti Monorail DEX, nad.fun, atau komunitas meme coin) dapat menyuntikkan dana hadiah (*sponsored prize pools*) langsung ke kontrak lobi turnamen sebagai sarana akuisisi pengguna baru yang organik dan menyenangkan.

---

## 2. Pertanyaan Krusial: "Kenapa HARUS Monad? Kenapa Gak di Base, Arbitrum, atau Solana?"

Game battle royale sinkron 16 pemain dengan tempo 60 detik ini **SECARA TEKNIS AKAN MATI TOTAL jika dipaksa berjalan di blockchain selain Monad**.

### 2.1 Tabrakan Eksekusi Sekuensial (The State Contention Bottleneck)
* **Di Ethereum L1, Base, Optimism, dan Arbitrum:** 
  Mesin eksekusi EVM memproses transaksi secara **antre satu per satu (sekuensial)**. 
  Jika 16 pemain meletakkan balok dan saling menembakkan batu secara bersamaan dalam interval 1 detik pada satu kontrak game yang sama, seluruh transaksi tersebut harus mengantre di satu antrean sempit.
  * **Akibatnya:** Transaksi menjadi macet (*pending*), biaya gas melonjak akibat perang gas antrean (*priority fee spikes*), dan latensi konfirmasi membengkak menjadi 2 hingga 15 detik. Papan permainan langsung membeku (*unplayable*).
* **Di Monad (Optimistic Parallel Execution):**
  * Monad memproses transaksi secara paralel pada inti CPU multi-utas (*multi-threaded execution*).
  * Karena Monadian mengisolasi status 16 pemain ke slot penyimpanan `uint64` yang terpisah, validator Monad mengeksekusi aksi seluruh 16 pemain **SECARA BERSAMAAN DALAM 1 BLOK TANPA PERNAH SALING MENUNGGU!**

### 2.2 Sinkronisasi Detak Blok dengan Refleks Motorik Manusia
* Penelitian neurosains menunjukkan bahwa jendela reaksi motorik manusia pada game refleks cepat berkisar antara **300 hingga 500 milidetik**.
* Waktu blok Monad sebesar **400 milidetik** dan finalitas penuh **800 milidetik** berada persis di dalam jendela biologis tersebut! 
* Aksi yang kamu lakukan di HP terasa secepat kedipan mata dan terkonfirmasi permanen di blockchain sebelum otakmu sempat merasakan jeda (*zero perceived latency*).

### 2.3 Perbandingan Komparatif Lintas Rantai Blockchain

| Parameter Arsitektur | 🟣 Monad | 🔵 Base (L2) | 🔴 Arbitrum One | 🟢 Solana | ⚪ Ethereum L1 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Throughput (TPS)** | **10.000+ TPS** | ~50–100 TPS | ~40–80 TPS | ~2.500 TPS | ~15 TPS |
| **Waktu Blok (Tick)** | **400 ms** | 2.000 ms (2 detik) | 250 ms (Sequencer) | 400 ms | 12.000 ms (12 detik) |
| **Finalitas Blok** | **800 ms (Sub-detik)** | ~2–4 detik | ~15 menit (L1 batch) | ~1.2 detik | ~15 menit |
| **Model Eksekusi** | **Optimistic Parallel EVM** | Sekuensial EVM | Sekuensial EVM | Sealevel Parallel (Rust) | Sekuensial EVM |
| **Biaya Gas per Turn** | **$0.00004 (Rp 0,6)** | $0.01 – $0.05 | $0.02 – $0.08 | $0.0005 | $2.00 – $15.00 |
| **Account Delegation** | **Native EIP-7702** | Terbatas (ERC-4337) | Terbatas (ERC-4337) | Session Key Non-EVM | Tidak Praktis (Gas Mahal) |
| **Kompatibilitas Dev** | **100% Solidity/Foundry** | Solidity | Solidity | Rust / Anchor (Bukan EVM) | Solidity |
| **Kelayakan Monadian** | 🟢 **SEMPURNA (Native)** | 🔴 **Gagal (Gas & Lag)** | 🔴 **Gagal (State Jam)** | 🟡 **Rumit (Bukan EVM)** | 🔴 **Mustahil Total** |

---

## 3. Aspek Legal & Regulasi: "Apakah Ini Judi (Judol) atau Kompetisi Ketangkasan?"

Isu ini sangat krusial karena hackathon diadakan di lingkungan akademik **Monad Blitz Tournament Venue, Indonesia**.

### 3.1 Landasan Hukum: The Predominant Factor Test
Dalam hukum internasional dan hukum pidana Indonesia (Pasal 303 KUHP), sebuah aktivitas diklasifikasikan sebagai perjudian jika hasilnya didominasi oleh **faktor peluang atau keberuntungan murni (Game of Chance)** seperti slot, rolet, atau lempar dadu.

Sebaliknya, **Monadian adalah Game of Skill (Kompetisi Ketangkasan Murni)** yang setara secara hukum dengan turnamen catur cepat, biliar, atau kompetisi esports (Mobile Legends, PUBG):
1. **Tidak Ada Unsur Bandar:** Smart contract hanya bertindak sebagai pengunci hadiah turnamen (*decentralized prize vault*).
2. **Kemenangan Ditentukan Otak & Refleks:** Menata balok di papan 8x8, memicu kombo beruntun, dan memilih sasaran serangan sabotase menuntut konsentrasi spasial dan kecepatan motorik tinggi. Pemain berpengalaman akan menang secara konsisten atas pemain pemula.
3. **Pembagian Hadiah Berdasarkan Peringkat Bracket:** Alokasi hadiah diberikan kepada Juara 1, 2, dan 3 layaknya turnamen olahraga ketangkasan resmi.

### 3.2 Tiga Pilar Perlindungan Regulasi di Monadian
1. **Ketersediaan Mode Gratis (Free-to-Play Arcade):** Siapa pun bisa bermain tanpa menyetor token uang sepeser pun untuk mengasah kemampuan dan bersaing di papan peringkat global. Ini membuktikan game memiliki nilai hiburan murni (*intrinsic entertainment value*).
2. **Turnamen Berhadiah Sponsor (Sponsored Esports):** Pemain masuk secara gratis, dan hadiah kemenangan dibiayai penuh oleh sponsor ekosistem Monad.
3. **Standarisasi Bahasa Profesional:** Dalam seluruh dokumentasi dan antarmuka, istilah taruhan (*bet/wager*) diharamkan secara ketat, dan digantikan oleh terminologi resmi esports: *Tournament Registration, Bracket Entry, Prize Pool, dan Championship Allocation*.

---

## 4. Membungkam 3 Kritik Skeptis (Refutation of Doubts)

| Kritik yang Diajukan | Realitas & Bantahan Telak Monadian |
| :--- | :--- |
| **1. "Masih game. Tema consumer dApp bersaing dengan utilitas nyata."** | Game kasual adalah aplikasi consumer dengan jumlah pengguna harian dan retensi tertinggi di bumi (Block Blast diunduh 100M+ kali). 90% aplikasi DeFi/utilitas Web3 gagal karena membosankan. Monadian adalah **Kuda Troya (Trojan Horse) onboarding consumer terbaik** yang bisa dimainkan dalam 5 detik oleh siapa saja tanpa perlu memahami istilah teknis kripto. |
| **2. "Kenapa blockchain? Jangan-jangan cuma Block Blast with extra steps."** | Web2 Block Blast tidak memiliki mode multiplayer dan tidak bisa mengadakan turnamen hadiah transparan karena rentan bot cheat dan manipulasi server. Monadian memecahkan masalah ini dengan **Provably Fair deterministic RNG on-chain** dan penyelesaian hadiah instan 800ms yang mustahil dilakukan sistem perbankan Web2. |
| **3. "Klaim paralelisme bohong karena A nyerang B pasti bikin tabrakan status (state contention)."** | Kritik ini hanya berlaku jika arsitektur kontrak ditulis amatir. Monadian mengimplementasikan **Asynchronous Combat Inbox Pattern**: Pemain A hanya menulis ke slot outbox miliknya sendiri, dan serangan baru diterapkan oleh transaksi Pemain B sendiri di giliran berikutnya. Hasilnya: **100% isolasi penyimpanan paralel tanpa ada tabrakan transaksi di validator Monad!** |
