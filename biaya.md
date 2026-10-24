# Analisis Biaya, Gas & Model Ekonomi — BlitzGrid

---

## 1. Estimasi Biaya Pengembangan & Infrastruktur (Development Budget)

Sebagai proyek berstandar produksi yang dibangun untuk hackathon dan dilanjutkan ke mainnet, berikut rincian biaya infrastruktur operasional selama 2 bulan:

| Komponen Infrastruktur | Provider / Layanan | Biaya per Bulan | Biaya 2 Bulan (Build) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Domain & DNS** | Cloudflare (`blitzgrid.xyz`) | $12 (sekali bayar) | $12 | Nama domain resmi & proteksi CDN/DDoS |
| **Frontend Web Hosting** | Vercel Pro / Netlify | $0 (Free Tier cukup) | $0 | Mendukung SSR Next.js & static assets PWA |
| **Monad Dedicated RPC Node** | QuickNode / Alchemy Monad | $0 (Developer Tier) | $0 | Kuota free tier mencukupi untuk fase testnet |
| **Event Indexer** | Envio Cloud (HyperIndex) | $0 (Hobbyist Tier) | $0 | Gratis untuk pengindeksan event testnet |
| **Auth & Embedded Wallet** | Privy Starter | $0 (< 5.000 MAU) | $0 | Cukup untuk fase hackathon & public testnet |
| **Dana Gas Pengujian (Testnet)** | Monad Faucet Resmi | $0 (Free MON) | $0 | Didapat dari developer faucet |
| **Total Estimasi Budget** | — | — | **$12 (~Rp 195.000)** | **Sangat hemat & efisien (Lean Startup)** |

---

## 2. Simulasi Konsumsi Gas On-Chain per Pertandingan

Salah satu poin penjualan terbesar BlitzGrid ke juri adalah efisiensi biaya gas on-chain yang sangat ekstrem berkat representasi papan `uint64`.

### 2.1 Parameter Simulasi 1 Ronde (16 Pemain)
* Rata-rata gerakan per pemain hingga tereliminasi/menang: **12 – 15 langkah penempatan balok**.
* Rata-rata serangan senjata yang ditembakkan per pemain: **2 – 3 serangan**.
* Total transaksi on-chain per lobi 16 pemain:
  $$\text{Total Transaksi} = 16 \text{ pemain} \times (14 \text{ langkah} + 2.5 \text{ serangan}) \approx 264 \text{ transaksi}$$

### 2.2 Rincian Biaya Gas Riil di Jaringan Monad

| Jenis Transaksi | Jumlah Gas | Gas Price (Monad) | Biaya MON per Tx | Biaya Rupiah per Tx (@ MON = $0.20) |
| :--- | :--- | :--- | :--- | :--- |
| **Registrasi Tiket (`depositEntry`)** | 32.000 gas | 50 gwei | 0.00160 MON | Rp 5,12 |
| **Langkah Balok (`makeMove`)** | 4.200 gas | 50 gwei | 0.00021 MON | **Rp 0,67** |
| **Tembak Senjata (`fireWeapon`)** | 21.000 gas | 50 gwei | 0.00105 MON | Rp 3,36 |
| **Penyelesaian Hadiah (`settleRound`)** | 42.000 gas | 50 gwei | 0.00210 MON | Rp 6,72 |

### 2.3 Total Biaya Menjalankan 1 Lobi Penuh (16 Pemain, 60 Detik)
* Total Gas Seluruh Lobi: $\approx 1.250.000\text{ gas}$
* Total Biaya MON: $\approx 0.0625\text{ MON}$
* **Total Biaya dalam Dolar: $0.0125 (HANYA Rp 200 PER SELURUH PERTANDINGAN!)**

> **Perbandingan dengan Rantai Lain:**  
> Untuk menjalankan game dengan 264 transaksi yang sama:
> * Di **Ethereum L1:** Menghabiskan **$500 – $1.200** (Mustahil untuk game kasual).
> * Di **Base / Arbitrum:** Menghabiskan **$2.5 – $8.0** (Terlalu mahal untuk tiket 500 perak).
> * Di **Monad:** Hanya **$0.012** — membuktikan Monad satu-satunya rantai yang layak untuk *micro-gaming*.

---

## 3. Model Pendapatan & Keberlanjutan Ekonomi (Business Model)

BlitzGrid dirancang mandiri tanpa bergantung pada pendanaan ventura spekulatif melalui 3 pilar pendapatan nyata:

### 3.1 Biaya Protokol Turnamen (5% Bracket Rake / Burn)
* Dari setiap lobi berbayar (*Ranked Bracket*), 95% tiket dialokasikan untuk hadiah pemain (65% Juara 1, 20% Juara 2, 10% Juara 3).
* **5% sisanya dialokasikan sebagai:**
  * **2.5% Revenue Protokol:** Kas pengembang untuk membiayai server, relayer gas sponsorship, dan pengembangan fitur baru.
  * **2.5% Token Burn:** Ditransfer otomatis ke alamat pembakaran `0x00...dEaD` untuk menciptakan tekanan deflasi permanen pada token ekosistem.

### 3.2 B2B Ecosystem Sponsorship (Sponsored Protocol Arenas)
* Protokol DeFi, DEX, launchpad token (seperti nad.fun), atau proyek NFT di Monad dapat menyewa lobi bermerek (*Branded Arenas*):
  * Contoh: *"Lobi Turnamen Monorail DEX — Total Hadiah 100 MON Disponsori Monorail"*.
  * Protokol mitra membayar biaya penempatan sponsor (*sponsorship fee*), sementara logo dan kampanye airdrop mereka dipromosikan langsung kepada ribuan pemain aktif di layar permainan.

### 3.3 Penjualan Kosmetik Visual (Neon Skins & Soundpacks)
* Seluruh logika dasar dan peluang menang murni adil tanpa ada unsur *Pay-to-Win*.
* Monetisasi pemain bersifat kosmetik murni:
  * *Theme Skins:* Palet warna papan neon langka (Gold Matrix, Cyberpunk Glitch, Toxic Acid).
  * *Soundpacks:* Suara kombo kustom sintetis 8-bit retro.
  * *Victory Badges:* Gelar on-chain yang ditampilkan di profil pemain saat memasuki lobi.
