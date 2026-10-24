# Peta Mekanik Game Lengkap — BlitzGrid

---

## 1. Grid Permainan & Sistem Koordinat Spasial

### 1.1 Struktur Papan 8x8 (The 64-Bit Matrix)
Arena utama permainan berbentuk kisi matriks **8 kolom (sumbu X) dan 8 baris (sumbu Y)**, dengan total 64 petak. 
* Indeks koordinat petak dimulai dari sudut kiri-atas $(x=0, y=0)$ hingga sudut kanan-bawah $(x=7, y=7)$.
* Di dalam smart contract dan mesin permainan, posisi setiap petak dipetakan secara linier ke dalam indeks bit integer tunggal:
  $$\text{BitIndex} = (y \times 8) + x \quad (\text{rentang } 0 \text{ sampai } 63)$$

```
      X=0   X=1   X=2   X=3   X=4   X=5   X=6   X=7
Y=0 [  0][  1][  2][  3][  4][  5][  6][  7]
Y=1 [  8][  9][ 10][ 11][ 12][ 13][ 14][ 15]
Y=2 [ 16][ 17][ 18][ 19][ 20][ 21][ 22][ 23]
Y=3 [ 24][ 25][ 26][ 27][ 28][ 29][ 30][ 31]
Y=4 [ 32][ 33][ 34][ 35][ 36][ 37][ 38][ 39]
Y=5 [ 40][ 41][ 42][ 43][ 44][ 45][ 46][ 47]
Y=6 [ 48][ 49][ 50][ 51][ 52][ 53][ 54][ 55]
Y=7 [ 56][ 57][ 58][ 59][ 60][ 61][ 62][ 63]
```

### 1.2 Status Petak (Tile State)
Setiap petak dalam grid memiliki 3 kemungkinan status visual:
1. **Empty (0):** Petak kosong transparan bergaris tepi redup, siap ditempati balok.
2. **Occupied (1):** Petak terisi oleh pecahan balok aktif pemain berwarna neon ungu / biru.
3. **Glitch Stone (Batu Sabotase):** Petak terisi oleh batu abu-abu kiriman lawan yang mengunci ruang.

---

## 2. Katalog Balok (Polyomino Pieces)

Pemain diberikan paket **3 balok acak** di bagian bawah layar. Balok **TIDAK BISA DIPUTAR**. Terdapat 19 variasi bentuk balok yang dikelompokkan ke dalam 5 tingkatan beban ruang:

| Kategori Bentuk | Kode Bentuk | Ukuran Matriks | Jumlah Petak | Masker Biner Asal (Origin Mask) | Tingkat Ancaman Ruang |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dot (Titik)** | `DOT_1X1` | 1x1 | 1 Petak | `0x1` | Sangat Ringan (Penyelamat) |
| **Line 2 (Mendatar)** | `LINE_H2` | 2x1 | 2 Petak | `0x3` | Ringan |
| **Line 2 (Tegak)** | `LINE_V2` | 1x2 | 2 Petak | `0x0101` | Ringan |
| **Line 3 (Mendatar)** | `LINE_H3` | 3x1 | 3 Petak | `0x7` | Sedang |
| **Line 3 (Tegak)** | `LINE_V3` | 1x3 | 3 Petak | `0x010101` | Sedang |
| **Line 4 (Mendatar)** | `LINE_H4` | 4x1 | 4 Petak | `0xF` | Sedang |
| **Line 4 (Tegak)** | `LINE_V4` | 1x4 | 4 Petak | `0x01010101` | Sedang |
| **Line 5 (Mendatar)** | `LINE_H5` | 5x1 | 5 Petak | `0x1F` | Berat (Menuntut ruang lebar) |
| **Line 5 (Tegak)** | `LINE_V5` | 1x5 | 5 Petak | `0x0101010101` | Berat |
| **Square 2x2** | `SQR_2X2` | 2x2 | 4 Petak | `0x0303` | Sedang |
| **Square 3x3** | `SQR_3X3` | 3x3 | 9 Petak | `0x070707` | **Maksimum (Balok Pemusnah)** |
| **Corner L 2x2** | `CORNER_2X2` (4 orientasi) | 2x2 | 3 Petak | Variasi bitmask 3 petak | Ringan-Sedang |
| **Big L 3x3** | `BIG_L_3X3` (4 orientasi) | 3x3 | 5 Petak | Variasi bitmask 5 petak | Berat |
| **T-Shape** | `T_SHAPE` (4 orientasi) | 3x2 | 4 Petak | Variasi bitmask 4 petak | Sedang |

### 2.1 Algoritma Pembangkitan Balok Deterministik
Agar terhindar dari tuduhan server rigging, 3 balok acak dibangkitkan secara deterministik oleh seed on-chain:
$$\text{PieceID} = \text{uint8}(\text{keccak256}(\text{abi.encodePacked}(\text{roundSeed}, \text{playerAddress}, \text{handCycleCount}, \text{slotIndex})) \pmod{19})$$

---

## 3. Logika Penempatan Balok & Pembersihan Garis

### 3.1 Aturan Penempatan (Placement Rule)
* Pemain menyeret salah satu balok dari tangan dan melepaskannya di atas koordinat $(x, y)$ target.
* **Syarat Sah:** Seluruh petak yang tercakup oleh bentuk balok harus berada di dalam batas $(0 \le x \le 7, 0 \le y \le 7)$ dan **seluruh petak target harus berstatus kosong (0)**.
* Jika ada 1 petak saja yang bertabrakan dengan petak yang sudah terisi atau batu sabotase, balok otomatis memantul kembali ke tangan pemain.

### 3.2 Pembersihan Garis (Line Clears)
Segera setelah balok diletakkan secara sah, sistem memeriksa seluruh 8 baris dan 8 kolom:

1. **Row Clear (Pembersihan Baris):**
   * Diperiksa menggunakan bitmask mendatar `0xFF` yang digeser setiap 8 bit.
   * Setiap baris yang 8 petaknya bernilai `1` langsung meledak dan status bitnya diubah kembali menjadi `0`.
2. **Column Clear (Pembersihan Kolom):**
   * Diperiksa menggunakan bitmask tegak `0x0101010101010101` yang digeser setiap 1 bit.
   * Setiap kolom yang 8 petaknya bernilai `1` langsung meledak dan status bitnya diubah kembali menjadi `0`.
3. **Cross Clear (Pembersihan Silang Sekaligus):**
   * Jika penempatan balok menyebabkan 1 baris mendatar DAN 1 kolom tegak penuh secara bersamaan, ledakan terjadi pada kedua sumbu tersebut, menghasilkan efek visual gelombang kejut ungu neon.

---

## 4. Sistem Kombo Beruntun & Mesin Energi (Mempool Mana Engine)

Kombo adalah kunci kemenangan di BlitzGrid. Bukan sekadar mengejar skor pasif, kombo adalah penghasil **Mempool Mana** untuk mengisi amunisi senjata sabotase.

### 4.1 Mekanika Combo Streak
* **Combo Counter Bertambah (+1):** Jika penempatan balok secara berurutan menghasilkan minimal 1 garis yang meledak.
* **Combo Counter Reset (=0):** Jika pemain menaruh balok namun tidak ada garis yang meledak pada langkah tersebut.

### 4.2 Formula Penghitungan Mana
Setiap ledakan garis menghasilkan Mana dasar yang kemudian dikalikan dengan pengali kombo beruntun:

$$\text{Total Mana} = \text{Base Mana} \times \left(1 + (\text{Combo Count} \times 0.5)\right)$$

* Nilai Base Mana:
  * 1 Baris Pecah: `10 Mana`
  * 2 Baris Pecah Sekaligus (Double Clear): `25 Mana`
  * 3 Baris Pecah Sekaligus (Triple Clear): `50 Mana`
  * 4 Baris Pecah Sekaligus (Quad Clear): `80 Mana`

*Contoh Perhitungan:*  
Pada langkah ke-4 beruntun (Combo x3), pemain berhasil meledakkan 2 baris sekaligus (Double Clear = 25 Base Mana).  
$$\text{Mana Didapat} = 25 \times (1 + (3 \times 0.5)) = 25 \times 2.5 = 62.5 \approx 62 \text{ Mana}$$

---

## 5. Arsenal Senjata Sabotase (The Combat Engine)

Pemain memiliki **Menu Senjata Taktis** di sisi kanan bawah layar HP yang menyala saat Mana mencukupi:

### 5.1 Senjata 1: Glitch Stone (Biaya: 30 Mana)
* **Efek:** Menjatuhkan **1 Batu Abu-Abu Kerikil** ke petak kosong acak di papan target.
* **Perilaku Batu:**
  * Berfungsi sebagai penghalang permanen yang tidak bisa digeser.
  * **Cara Menghancurkannya:** Lawan harus menyelesaikan baris atau kolom yang melewati koordinat batu tersebut. Begitu baris/kolom itu meledak, batu ikut hancur menjadi debu.
* **Taktik Penggunaan:** Sangat efektif dipakai secara beruntun (*spamming*) untuk memecah ruang kosong luas menjadi petak-petak sempit.

### 5.2 Senjata 2: Toxic Hand (Biaya: 60 Mana)
* **Efek:** Mengutuk tangan lawan! Salah satu dari 3 balok di tangan musuh **langsung digantikan secara paksa oleh Balok Kotak Raksasa 3x3 (`SQR_3X3`)**.
* **Taktik Penggunaan:** Digunakan saat melihat papan lawan sudah terisi lebih dari 60%. Balok 3x3 hampir mustahil muat di papan yang berantakan, memaksa lawan tereliminasi seketika.

### 5.3 Senjata 3: Frost Lock (Biaya: 90 Mana)
* **Efek:** Membekukan **3 petak kosong acak di papan lawan** dengan lapisan es tebal selama **3 giliran**.
* **Perilaku Es:** Selama 3 giliran ke depan, petak tersebut tidak bisa ditaruh balok dan tidak bisa dihitung dalam pembersihan garis. Lapisan es mencair otomatis setelah 3 langkah giliran lawan selesai.

---

## 6. Matriks Penargetan Strategis (Targeting Matrix)

Pemain dapat mengganti mode bidikan kapan saja dengan mengetuk tombol mode di layar:

1. **K.O. Hunter (Mode Algojo):**
   * Algoritma otomatis mengunci pemain yang memiliki **sisa petak kosong paling sedikit (< 16 petak)**.
   * Sangat berguna untuk mengamankan *Bounty Kill* dari pemain yang sedang sekarat.
2. **Whale Buster (Incar Pemimpin):**
   * Mengunci pemain yang memegang akumulasi Mana tertinggi atau kill terbanyak.
   * Menyerang pemimpin memberikan efek pengurangan 15% dari simpanan Mana miliknya.
3. **Attacker Shield (Serangan Balik):**
   * Membalas semua pemain yang saat itu sedang mengarahkan garis laser bidikan ke papan kita.
   * Serangan balik (*counter-attack*) mendapatkan **bonus daya rusak +25%** (batu yang dikirimkan berpeluang menjadi 2 batu sekaligus).
4. **Manual Tap:**
   * Pemain cukup mengetuk salah satu papan mini lawan yang berjejer di sekeliling layar utama untuk membidik pemain tersebut secara spesifik.

---

## 7. Timer Giliran & Kondisi Eliminasi (Elimination Rules)

### 7.1 Blitz Turn Timer (4 Detik per Giliran)
* Untuk menjaga tempo cepat dan mencegah pemain mengulur waktu (*stalling*), setiap pemain memiliki **timer berpikir 4 detik** untuk menaruh satu balok.
* **Penalti Waktu Habis:** Jika bar pengukur waktu 4 detik habis dan pemain belum meletakkan balok:
  * Sistem otomatis menaruh balok pertama yang ada di tangan ke petak kosong sah pertama yang ditemukan algoritma (biasanya posisi tidak strategis yang merusak susunan).
  * Pemain terkena penalti pengurangan Mana sebesar `-15 Mana`.

### 7.2 Kondisi Kalah (Eliminated / Top Out)
Pemain dinyatakan gugur dari ronde seketika jika:
* **No Moves Left:** Dari 3 balok yang sedang aktif di tangan, **TIDAK ADA SATU PUN yang muat ditaruh di sisa petak kosong papan**.
* Papan pemain meledak merah, avatar berubah menjadi abu-abu di radar mini seluruh pemain, dan posisi peringkat eliminasi dikunci oleh smart contract.

### 7.3 Bounty Kill & Rampasan
* Pemain yang serangannya menyebabkan lawan tereliminasi (pukulan terakhir / *finishing blow*) dinyatakan sebagai pembunuh sah (*Killer*).
* Killer mendapatkan:
  * Gelar on-chain **+1 K.O. Badge**.
  * **+50% dari sisa Mana** yang ditinggalkan korban.
  * Alokasi persentase hadiah tambahan dari tiket turnamen korban.

### 7.4 Penentuan Pemenang (Victory Condition)
* **Last Survivor:** Pemain terakhir yang berhasil mempertahankan papannya hidup ketika seluruh 15 lawan telah gugur dinobatkan sebagai **Juara 1 (*Royale Victor*)**.
* **Time-Out Standoff (Jika 60 detik habis):** Jika waktu ronde 60 detik habis dan masih ada 2 pemain atau lebih yang hidup, pemenang ditentukan berdasarkan:
  1. Jumlah petak kosong terbanyak (papan paling bersih).
  2. Jika seri, pemain dengan jumlah *K.O. Badges* terbanyak keluar sebagai juara.
