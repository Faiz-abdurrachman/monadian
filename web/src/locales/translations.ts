export type Language = 'id' | 'en';

export interface SlideContent {
  tag: string;
  title: string;
  subtitle: string;
  points: { title: string; desc: string; badge?: string }[];
  highlight?: string;
}

export interface TranslationDictionary {
  header: {
    title: string;
    subtitle: string;
    guideBtn: string;
    slidesBtn: string;
    qrBtn: string;
    testnetMode: string;
    stageMode: string;
    sessionKey: string;
    eip7702: string;
  };
  hud: {
    score: string;
    timeRemaining: string;
    aliveCount: string;
    players: string;
    mana: string;
    combo: string;
    streak: string;
    mute: string;
    unmute: string;
  };
  radars: {
    playerPrefix: string;
    selectedTarget: string;
    eliminated: string;
    sabotaged: string;
    safe: string;
  };
  weapons: {
    title: string;
    targetLocked: string;
    glitchName: string;
    glitchCost: string;
    glitchDesc: string;
    toxicName: string;
    toxicCost: string;
    toxicDesc: string;
    frostName: string;
    frostCost: string;
    frostDesc: string;
    insufficientMana: string;
  };
  tray: {
    dragHint: string;
  };
  combat: {
    alertTitle: string;
    glitchAlert: (name: string) => string;
    toxicAlert: (name: string) => string;
    frostAlert: (name: string) => string;
  };
  howToPlay: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    gotItBtn: string;
  };
  gameOver: {
    victoryTitle: string;
    victorySubtitle: string;
    defeatTitle: string;
    defeatSubtitle: string;
    finalScore: string;
    escrowPrize: string;
    maxCombo: string;
    sabotagesFired: string;
    gasMetricLabel: string;
    finalityLabel: string;
    shareBtn: string;
    shareText: (score: string, rank: number, prize: string) => string;
    playAgainBtn: string;
    backToLobbyBtn: string;
  };
  lobby: {
    title: string;
    subtitle: string;
    tagline: string;
    venueBadge: string;
    playerLabel: string;
    playerPlaceholder: string;
    defaultPlayerName: string;
    networkLabel: string;
    networkStage: string;
    networkTestnet: string;
    enterArenaBtn: string;
    guideBtn: string;
    slidesBtn: string;
    qrBtn: string;
    features: {
      speedTitle: string;
      speedDesc: string;
      speedBadge: string;
      potTitle: string;
      potDesc: string;
      potBadge: string;
      uxTitle: string;
      uxDesc: string;
      uxBadge: string;
    };
    sessionActive: string;
    sessionPending: string;
    hostArenaBtn: string;
  };
  createArena: {
    modalTitle: string;
    modalSubtitle: string;
    roomNameLabel: string;
    roomNamePlaceholder: string;
    poolTypeLabel: string;
    poolTypeBuyIn: string;
    poolTypeBuyInDesc: string;
    poolTypeSponsor: string;
    poolTypeSponsorDesc: string;
    prizeSchemeLabel: string;
    schemeWinnerTakesAll: string;
    schemeWinnerTakesAllDesc: string;
    schemePodium: string;
    schemePodiumDesc: string;
    entryFeeLabel: string;
    sponsorPotLabel: string;
    treasuryNotice: string;
    submitBtn: string;
    cancelBtn: string;
  };
  hostArena: {
    title: string;
    subtitle: string;
    roomBadge: (code: string) => string;
    scanHint: string;
    joinedCount: (count: number, max: number) => string;
    playersTitle: string;
    startBtn: string;
    startHint: string;
    copyLinkBtn: string;
    linkCopiedToast: string;
    backToLobby: string;
    sponsoredBadge: string;
    buyInBadge: string;
    potLabel: string;
  };
  guestBanner: {
    invitedTitle: string;
    roomLabel: (code: string) => string;
    sponsoredNotice: (amount: string) => string;
    buyInNotice: (amount: string) => string;
    joinBtn: string;
  };
  lobbyQr: {
    title: string;
    subtitle: string;
    lanLabel: string;
    lanDesc: string;
    tunnelLabel: string;
    tunnelDesc: string;
    copyBtn: string;
    copiedToast: string;
    closeBtn: string;
  };
  pitchDeck: {
    topSub: string;
    toggleFullscreen: string;
    closeSlide: string;
    keyboardHint: string;
    prevBtn: string;
    nextBtn: string;
    slides: SlideContent[];
  };
  blossom: {
    blossomBlast: string;
    home: string;
    playNow: string;
    classicMode: string;
    endlessSubtitle: string;
    adventureMode: string;
    adventureSubtitle: string;
    arenaTournament: string;
    arenaSubtitle: string;
    bestScore: string;
    strawberryCoins: string;
    bunnyMaster: string;
    level: string;
    exp: string;
    nextLvl: string;
    dailyQuestTitle: string;
    dailyQuestTime: string;
    dailyQuestDesc: string;
    dailyQuestReward: string;
    shop: string;
    ranks: string;
    badges: string;
    skins: string;
    playNav: string;
    arenaNav: string;
    hostNav: string;
    settingsNav: string;
    linesCleared: string;
    maxStreak: string;
    blocksPlaced: string;
    monWon: string;
    backToLobby: string;
    playAgain: string;
    breakTime: string;
    noMoreMoves: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  id: {
    header: {
      title: 'BLITZGRID',
      subtitle: 'MONAD PUZZLE ROYALE',
      guideBtn: 'PANDUAN',
      slidesBtn: 'SLIDES',
      qrBtn: 'QR LOBI',
      testnetMode: 'TESTNET 10143',
      stageMode: 'STAGE DEMO',
      sessionKey: 'SESI',
      eip7702: 'EIP-7702',
    },
    hud: {
      score: 'SKOR',
      timeRemaining: 'DETIK',
      aliveCount: 'BERTAHAN',
      players: 'PEMAIN',
      mana: 'MEMPOOL MANA',
      combo: 'KOMBO',
      streak: 'STREAK',
      mute: 'Matikan Suara',
      unmute: 'Nyalakan Suara',
    },
    radars: {
      playerPrefix: 'Pemain',
      selectedTarget: 'TARGET TERPILIH',
      eliminated: 'TERELIMINASI',
      sabotaged: 'DISABOTASE',
      safe: 'AMAN',
    },
    weapons: {
      title: 'SABOTASE LAWAN',
      targetLocked: 'KUNCI',
      glitchName: 'GLITCH',
      glitchCost: '30 MANA',
      glitchDesc: 'Bekukan 1 petak acak di papan lawan',
      toxicName: 'RACUN 3X3',
      toxicCost: '60 MANA',
      toxicDesc: 'Kutuk 1 balok lawan jadi Square 3x3 raksasa',
      frostName: 'KUNCI ES',
      frostCost: '90 MANA',
      frostDesc: 'Pangkas 5 detik waktu berpikir lawan',
      insufficientMana: 'Mana tidak cukup',
    },
    tray: {
      dragHint: '👆 TARIK BALOK KE PAPAN (DRAG & DROP)',
    },
    combat: {
      alertTitle: 'PERINGATAN SERANGAN MASUK!',
      glitchAlert: (name) => `${name} meluncurkan Glitch Stone ke paparmu!`,
      toxicAlert: (name) => `${name} mengutuk bidak tanganmu jadi Racun 3x3!`,
      frostAlert: (name) => `${name} membekukan timermu (-5 detik)!`,
    },
    howToPlay: {
      title: 'PANDUAN KILAT 15 DETIK',
      subtitle: 'Kuasai mekanik Battle Royale On-Chain di Monad Testnet dalam 3 langkah mudah:',
      step1Title: '1. Tarik & Pasang Balok (Drag & Drop)',
      step1Desc: 'Tarik balok permen dari baki bawah ke papan 8x8. Ukuran balok pas 1:1 dengan kotak papan dengan offset anti-tertutup jempol. Hindari kehabisan ruang!',
      step2Title: '2. Cetak Kombo & Kumpulkan Mana',
      step2Desc: 'Ledakkan baris/kolom penuh untuk memicu kombo berantai. Setiap kombo mengisi Mempool Mana Bar untuk persenjataan sabotase.',
      step3Title: '3. Tembak Sabotase & Jadi Juara 1',
      step3Desc: 'Kunci bot di radar atas, lalu tembakkan Glitch Stone, Racun 3x3, atau Kunci Es. Singkirkan 15 lawan dan raih hadiah 1.04 MON!',
      gotItBtn: 'SAYA MENGERTI, GAS BERTANDING!',
    },
    gameOver: {
      victoryTitle: 'VICTORY ROYALE!',
      victorySubtitle: '🏆 Juara 1 Turnamen 100% On-Chain di Monad!',
      defeatTitle: 'TERELIMINASI!',
      defeatSubtitle: '💀 Kamu kehabisan ruang di papan!',
      finalScore: 'SKOR AKHIR',
      escrowPrize: 'HADIAH ESCROW',
      maxCombo: 'KOMBO TERTINGGI',
      sabotagesFired: 'SABOTASE DILONTAR',
      gasMetricLabel: 'Hemat Gas Monad (< 4,500 gas / $0.00001)',
      finalityLabel: 'Monad Testnet 10143: 800ms Finality',
      shareBtn: 'BAGIKAN HASIL KE X / TWITTER',
      shareText: (score, rank, prize) =>
        `Saya baru saja meraih Rank #${rank} di BlitzGrid (The Monad Puzzle Royale) dengan Skor ${score} dan memenangkan ${prize}! ⚡🧱 Dibangun di atas @monad_xyz. Mainkan sekarang: `,
      playAgainBtn: 'MAIN LAGI (PLAY AGAIN)',
      backToLobbyBtn: 'KEMBALI KE LOBI',
    },
    lobby: {
      title: 'BLITZGRID',
      subtitle: 'THE MONAD PUZZLE ROYALE',
      tagline: '100% On-Chain Block Blast Battle Royale 16 Pemain di Monad Testnet',
      venueBadge: 'MONAD BLITZ JOGJA VOL. 2 — GIK UGM',
      playerLabel: 'NICKNAME PEMAIN',
      playerPlaceholder: 'Masukkan nama (cth: Faiz.mon)',
      defaultPlayerName: 'Pemain_1',
      networkLabel: 'PILIH MODE JARINGAN',
      networkStage: 'STAGE DEMO (Offline Safe)',
      networkTestnet: 'MONAD TESTNET (10143)',
      enterArenaBtn: 'MASUK ARENA (ENTER ARENA)',
      guideBtn: '❓ Panduan 15 Detik',
      slidesBtn: '📽️ Slide Panggung',
      qrBtn: '📱 QR Lobi',
      features: {
        speedTitle: '400ms Monad Speed',
        speedDesc: 'Real-time Parallel EVM',
        speedBadge: '< 4,500 gas',
        potTitle: '1.04 MON Escrow Pot',
        potDesc: 'Hadiah On-Chain Otomatis',
        potBadge: 'Juara 1: 65%',
        uxTitle: 'Zero Pop-Up UX',
        uxDesc: 'EIP-7702 Ephemeral Session Key',
        uxBadge: '0 Pop-Up',
      },
      sessionActive: 'Session Key Siap',
      sessionPending: 'Menyiapkan Session Key...',
      hostArenaBtn: '👑 BIKIN ARENA TURNAMEN (HOST)',
    },
    createArena: {
      modalTitle: 'BUAT ARENA TURNAMEN',
      modalSubtitle: 'Konfigurasikan pool hadiah & proyeksikan QR panggung untuk juri & audiens',
      roomNameLabel: 'NAMA ARENA / ROOM',
      roomNamePlaceholder: 'Cth: Monad Blitz Jogja Arena #01',
      poolTypeLabel: 'PILIH MODEL POOL TURNAMEN',
      poolTypeBuyIn: '🪙 P2P Tiket Masuk (Buy-In)',
      poolTypeBuyInDesc: 'Tiap pemain bayar tiket masuk. Pot hadiah terkumpul dari semua peserta.',
      poolTypeSponsor: '🎁 Hadiah Sponsor (Bounty)',
      poolTypeSponsorDesc: 'Didanai sponsor di muka. Juri & audiens masuk 100% GRATIS tanpa modal!',
      prizeSchemeLabel: 'SKEMA DISTRIBUSI HADIAH',
      schemeWinnerTakesAll: '🏆 Winner-Takes-All',
      schemeWinnerTakesAllDesc: '95% Juara 1 sikat bersih, 5% ke Brankas Sponsor Komunitas.',
      schemePodium: '🏅 Podium Esports Top-3',
      schemePodiumDesc: 'Juara 1: 70%, Juara 2: 15%, Juara 3: 10%, Brankas Sponsor: 5%.',
      entryFeeLabel: 'BIAYA TIKET MASUK PER PEMAIN',
      sponsorPotLabel: 'TOTAL HADIAH SPONSOR YANG DISETOR',
      treasuryNotice: '💡 5% dari pot otomatis disisihkan ke Brankas Sponsor (Community Treasury) untuk diputar kembali mendanai ronde gratis berikutnya.',
      submitBtn: '🚀 BUAT ARENA & TAMPILKAN QR',
      cancelBtn: 'Batal',
    },
    hostArena: {
      title: 'ARENA TURNAMEN PANGGUNG',
      subtitle: 'Arahkan kamera HP ke QR Code di bawah untuk bergabung ke ronde ini',
      roomBadge: (code) => `KODE ARENA: ${code}`,
      scanHint: '📱 Scan QR ini dari kamera smartphone untuk langsung bertanding!',
      joinedCount: (count, max) => `Pemain Bergabung: ${count} / ${max}`,
      playersTitle: 'DAFTAR PESERTA DI LOBI',
      startBtn: '🔥 MULAI PERTANDINGAN',
      startHint: 'Slot yang kosong akan otomatis diisi oleh Smart AI Bots agar game langsung jalan 16 pemain!',
      copyLinkBtn: 'Salin Tautan Room',
      linkCopiedToast: 'Tautan Kamar Berhasil Disalin!',
      backToLobby: 'Kembali ke Lobi Utama',
      sponsoredBadge: '🎁 SPONSORED FREE ENTRY',
      buyInBadge: '🪙 P2P BUY-IN ARENA',
      potLabel: 'TOTAL POT HADIAH ON-CHAIN',
    },
    guestBanner: {
      invitedTitle: 'UNDANGAN TURNAMEN PANGGUNG',
      roomLabel: (code) => `Kamar: #${code}`,
      sponsoredNotice: (amount) => `🎁 Masuk 100% GRATIS! Hadiah Disponsori: ${amount}`,
      buyInNotice: (amount) => `🪙 Tiket Masuk: ${amount} (Patungan Pot Escrow)`,
      joinBtn: '🔥 GABUNG SEKARANG',
    },
    lobbyQr: {
      title: 'PINDAI UNTUK BERGABUNG LOBI',
      subtitle: 'Arahkan kamera smartphone untuk langsung bertanding (Multiplayer P2P):',
      lanLabel: 'Wi-Fi Lokal (GIK UGM)',
      lanDesc: 'Koneksi latensi ultra-rendah untuk juri & audiens di venue',
      tunnelLabel: 'Akses Publik (Cloudflare Tunnel)',
      tunnelDesc: 'Dapat diakses dari jaringan data seluler apa pun',
      copyBtn: 'Salin Tautan',
      copiedToast: 'Tautan Berhasil Disalin!',
      closeBtn: 'Tutup',
    },
    pitchDeck: {
      topSub: 'MONAD BLITZ JOGJA VOL. 2 — GIK UGM',
      toggleFullscreen: 'Mode Layar Penuh Proyektor',
      closeSlide: 'Tutup Slide',
      keyboardHint: '(Gunakan panah keyboard ◄ ► atau Space untuk navigasi)',
      prevBtn: 'SEBELUMNYA',
      nextBtn: 'SELANJUTNYA',
      slides: [
        {
          tag: 'SLIDE 01 // COVER',
          title: 'BLITZGRID',
          subtitle: 'The Monad Puzzle Royale — 100% On-Chain Block Blast Battle Royale 16 Pemain',
          points: [
            {
              title: 'Event Presentasi',
              desc: 'Monad Blitz Jogja Vol. 2 — Sabtu, 24 Oktober 2026',
              badge: 'GIK UGM',
            },
            {
              title: 'Kategori Inovasi',
              desc: 'Consumer Gaming & High-Throughput Parallel EVM Showcase',
              badge: 'Monad Testnet',
            },
            {
              title: 'Penyaji Pitch',
              desc: 'Faiz & Tim BlitzGrid — 3 Menit Pitch + 2 Menit Q&A Juri',
              badge: '3-Min Pitch',
            },
          ],
          highlight: 'Membuktikan Kecepatan 400ms Monad Lewat Game Paling Populer di Dunia.',
        },
        {
          tag: 'SLIDE 02 // THE PROBLEM',
          title: 'BLOCK BLAST VIRAL, TAPI SOLO & OFFLINE',
          subtitle: '100+ Juta Orang Main Tiap Hari Tanpa Elemen Kompetisi On-Chain',
          points: [
            {
              title: 'Game Mobile #1 Dunia',
              desc: 'Ratusan juta orang memainkannya saat nongkrong di kafe Jogja, namun 100% solo offline.',
              badge: '100M+ Downloads',
            },
            {
              title: 'Turnamen Uang Mustahil di Web2',
              desc: 'Sangat rawan bot-cheat memori dan manipulasi server terpusat tanpa transparansi.',
              badge: 'Cheat Vulnerable',
            },
            {
              title: 'Game Web3 Selama Ini Gagal',
              desc: 'Dicap membosankan, transaksi lambat, dan penuh pop-up MetaMask yang merusak flow.',
              badge: 'UX Problem',
            },
          ],
          highlight: 'Pemain Butuh Ajang Pembuktian Skill Kompetitif yang Adil, Cepat, dan Transparan.',
        },
        {
          tag: 'SLIDE 03 // THE SOLUTION',
          title: 'BLITZGRID: PUZZLE ROYALE 16P ON-CHAIN',
          subtitle: 'Ubah Mekanik Santai Menjadi Battle Royale Refleks 60 Detik',
          points: [
            {
              title: '16 Pemain Bersamaan',
              desc: 'Setiap pemain menata balok permen di papan 8x8 masing-masing secara live.',
              badge: '16 Players',
            },
            {
              title: 'Kombo Mempool Mana',
              desc: 'Ledakkan garis untuk mengisi Mana Bar dan meluncurkan sabotase ke lawan.',
              badge: 'Combat Loop',
            },
            {
              title: 'Last Player Standing',
              desc: 'Pemain yang kehabisan ruang tereliminasi, pemenang membawa pulang Escrow Prize Monad!',
              badge: '1.04 MON Escrow',
            },
          ],
          highlight: 'Gameplay Adiktif Block Blast + Adrenalin Tetris 99 + Finality Atomik Monad.',
        },
        {
          tag: 'SLIDE 04 // CORE GAMEPLAY LOOP',
          title: 'SUSUN, KOMBO, TEMBAK SABOTASE!',
          subtitle: 'Tempo Refleks Tinggi dengan Interaksi Dua Arah Tanpa Delay',
          points: [
            {
              title: '1. Susun Balok 1:1',
              desc: 'Drag & Drop balok permen ke papan 8x8 dengan thumb offset anti-tertutup jempol.',
              badge: '120 FPS 2D Engine',
            },
            {
              title: '2. Kumpulkan Mana',
              desc: 'Kombo ganda/tiga menghasilkan 15-45 Mempool Mana untuk persenjataan.',
              badge: 'Mana Formula',
            },
            {
              title: '3. Tembak 3 Senjata Sabotase',
              desc: 'Glitch Stone (30 Mana), Racun 3x3 (60 Mana), dan Kunci Es (90 Mana).',
              badge: 'Sabotage Arsenal',
            },
          ],
          highlight: 'Bukan Sekadar Main Puzzle: Setiap Langkahmu Menentukan Hidup-Mati Lawan.',
        },
        {
          tag: 'SLIDE 05 // THE ENGINEERING FEAT',
          title: 'uint64 BITWISE & ASYNC COMBAT INBOX',
          subtitle: '2 Terobosan Arsitektur EVM yang Memaksimalkan Eksekusi Paralel Monad',
          points: [
            {
              title: 'uint64 Bitwise Board (< 3,500 Gas)',
              desc: 'Representasi papan 8x8 dalam 1 slot penyimpanan. Cek tabrakan dan baris penuh dalam 1 opcode bitwise.',
              badge: '98.5% Gas Reduction',
            },
            {
              title: 'Asynchronous Combat Inbox',
              desc: 'Serangan masuk antre di Inbox target dan dieksekusi saat giliran pemain. Nol state contention!',
              badge: 'Parallel Friendly',
            },
            {
              title: '26/26 Foundry Tests Passed',
              desc: 'Suite pengujian smart contract lengkap lulus 100% dengan eksekusi deterministik.',
              badge: '100% Verified',
            },
          ],
          highlight: 'Game Pertama yang Dirancang Khusus untuk Memanfaatkan Keunggulan Parallel Execution Monad.',
        },
        {
          tag: 'SLIDE 06 // INVISIBLE WEB3 UX',
          title: 'EIP-7702 EPHEMERAL SESSION KEY',
          subtitle: '0 Pop-up MetaMask: Pengalaman Bermain Secepat Game Web2 Asli',
          points: [
            {
              title: '1-Click Sesi 60 Detik',
              desc: 'Tanda tangan 1 kali saat masuk turnamen. Kunci sesi sementara memvalidasi move on-chain otomatis.',
              badge: 'Zero Friction',
            },
            {
              title: 'Dual Mode: Live & Offline Safe',
              desc: 'Dapat berpindah mulus antara Monad Testnet (Chain ID 10143) dan Stage Demo tanpa wallet.',
              badge: 'Fail-Proof Demo',
            },
            {
              title: 'Audio Prosedural 0 KB',
              desc: 'Web Audio API sintetis chiptune tanpa download aset mp3 eksternal sama sekali.',
              badge: 'Instant Load',
            },
          ],
          highlight: 'Pemain Tidak Perlu Tahu Ada Blockchain di Belakangnya: Yang Mereka Rasakan Hanyalah Kecepatan Murni.',
        },
        {
          tag: 'SLIDE 07 // LIVE DEMO HIGHLIGHTS',
          title: 'SAATNYA PEMBUKTIAN DI PANGGUNG',
          subtitle: 'Mari Kita Saksikan Pertarungan Real-Time di Hadapan Para Juri',
          points: [
            {
              title: 'Scan QR Code di Layar',
              desc: 'Juri dan penonton dapat langsung bergabung ke room lobi via Wi-Fi GIK UGM atau Cloudflare Tunnel.',
              badge: 'Scan & Play',
            },
            {
              title: 'Tembak Laser Sabotase',
              desc: 'Perhatikan sinar laser melesat dari dock senjata pemain ke mini-radar bot yang terkunci.',
              badge: 'Visual Feedback',
            },
            {
              title: 'Ledakan Garis Voxel Candy',
              desc: 'Sensasi juicy pop saat memecahkan 3 baris sekaligus dan memicu kombo berantai.',
              badge: 'Tactile Polish',
            },
          ],
          highlight: 'Bukan Sekadar Slide Teori: Kode Ini Berjalan Nyata Detik Ini Juga di Depan Anda.',
        },
        {
          tag: 'SLIDE 08 // MARKET & TOKEN SINK',
          title: 'PELUANG PASAR & EKONOMI MONAD',
          subtitle: 'Bagaimana BlitzGrid Mendorong Transaksi Harian Ritel di Jaringan Monad',
          points: [
            {
              title: 'Micro-Wager Escrow Pot',
              desc: 'Setiap pemain memasang 0.05 MON entry fee. 16 pemain menghasilkan 0.8 MON pool per 60 detik.',
              badge: 'Organic Volume',
            },
            {
              title: '5% Treasury & Burn Mechanism',
              desc: '5% dari setiap pool dipotong untuk burn token ekosistem atau reward komunitas mingguan.',
              badge: 'Sustainable Tokenomics',
            },
            {
              title: 'High TPS Generator',
              desc: '16 pemain x ~40 move per ronde = 640 transaksi on-chain per menit per match.',
              badge: 'High Throughput',
            },
          ],
          highlight: 'Mengubah Gamer Kasual Web2 Menjadi Pengguna Aktif On-Chain Monad Terbesar.',
        },
        {
          tag: 'SLIDE 09 // ROADMAP POST-HACKATHON',
          title: 'RENCANA PRODUKSI & PELUNCURAN',
          subtitle: 'Dari Hackathon GIK UGM Menuju Mainnet Monad 2026',
          points: [
            {
              title: 'Bulan 1 (Okt - Nov 2026)',
              desc: 'Audit Slither kontrak, integrasi Envio HyperIndex untuk matchmaking P2P 16 pemain publik.',
              badge: 'Bulan 1',
            },
            {
              title: 'Bulan 2 (Des 2026)',
              desc: 'Public Community Cup berhadiah 500 MON, leaderboard global, dan peluncuran Mainnet.',
              badge: 'Bulan 2',
            },
            {
              title: 'Monad Mobile Mini-App',
              desc: 'Integrasi Telegram / Farcaster Frames untuk onboarding 1-klik jutaan pengguna.',
              badge: 'Mass Adoption',
            },
          ],
          highlight: 'Bukan Sekadar Prototipe Hackathon: Ini Produk Nyata yang Siap Viral di Mainnet Monad.',
        },
        {
          tag: 'SLIDE 10 // CLOSING & CALL TO ACTION',
          title: 'THE MONAD PUZZLE ROYALE IS HERE',
          subtitle: 'Buktikan Sendiri Sensasi 120 FPS Battle Royale di Browser Anda!',
          points: [
            {
              title: 'Live Playable URL',
              desc: 'http://192.168.1.114:3000 (Wi-Fi GIK UGM) atau Public Tunnel',
              badge: 'Play Now',
            },
            {
              title: 'Kode Kontrak Terbuka',
              desc: '26/26 Unit Test Foundry Lulus 100% dengan optimasi gas ekstrem.',
              badge: 'Open Source',
            },
            {
              title: 'Punchline Penutup',
              desc: '"Jika Block Blast membuat jutaan orang terpaku di layar secara sendirian, BlitzGrid membuat jutaan orang bertarung serentak di atas Monad!"',
              badge: 'Faiz & Tim',
            },
          ],
          highlight: 'Terima Kasih Juri dan Komunitas Monad Blitz Jogja Vol. 2! Mari Bertanding!',
        },
      ],
    },
    blossom: {
      blossomBlast: 'BLOSSOM BLAST',
      home: 'Beranda',
      playNow: 'MAIN SEKARANG!',
      classicMode: 'MODE KLASIK',
      endlessSubtitle: 'Puzzle Bunga Sakura Abadi',
      adventureMode: 'PETUALANGAN KELINCI',
      adventureSubtitle: 'Kebun Sakura: Babak 8/12',
      arenaTournament: 'TURNAMEN ARENA ⚡',
      arenaSubtitle: 'Monad Blitz: Hadiah Pot Bergulir',
      bestScore: 'TERBAIK',
      strawberryCoins: 'KOIN STRAWBERRY',
      bunnyMaster: 'Master Kelinci',
      level: 'LVL',
      exp: 'Exp',
      nextLvl: 'LANJUT: LVL 19 🥕',
      dailyQuestTitle: 'MISI SAKURA HARIAN',
      dailyQuestTime: '• 14j 25m',
      dailyQuestDesc: 'Hancurkan 15 garis strawberry',
      dailyQuestReward: '+300 🍓',
      shop: 'Toko',
      ranks: 'Peringkat',
      badges: 'Lencana',
      skins: 'Skin',
      playNav: 'Main 🌸',
      arenaNav: 'Arena',
      hostNav: 'Panggung',
      settingsNav: 'Pengaturan',
      linesCleared: 'GARIS BERSIH',
      maxStreak: 'KOMBO TERBESAR',
      blocksPlaced: 'BALOK DIPASANG',
      monWon: 'MON DIDAPAT',
      backToLobby: '🏠 KEMBALI KE LOBI',
      playAgain: '🔄 MAIN LAGI',
      breakTime: 'WAKTU ISTIRAHAT 🐰',
      noMoreMoves: 'TIDAK ADA LANGKAH LAGI!',
    },
  },
  en: {
    header: {
      title: 'BLITZGRID',
      subtitle: 'MONAD PUZZLE ROYALE',
      guideBtn: 'GUIDE',
      slidesBtn: 'SLIDES',
      qrBtn: 'LOBBY QR',
      testnetMode: 'TESTNET 10143',
      stageMode: 'STAGE DEMO',
      sessionKey: 'SESSION',
      eip7702: 'EIP-7702',
    },
    hud: {
      score: 'SCORE',
      timeRemaining: 'TIME',
      aliveCount: 'ALIVE',
      players: 'PLAYERS',
      mana: 'MEMPOOL MANA',
      combo: 'COMBO',
      streak: 'STREAK',
      mute: 'Mute Audio',
      unmute: 'Unmute Audio',
    },
    radars: {
      playerPrefix: 'Player',
      selectedTarget: 'LOCKED TARGET',
      eliminated: 'ELIMINATED',
      sabotaged: 'SABOTAGED',
      safe: 'SAFE',
    },
    weapons: {
      title: 'SABOTAGE ARSENAL',
      targetLocked: 'LOCK',
      glitchName: 'GLITCH',
      glitchCost: '30 MANA',
      glitchDesc: 'Drop a frozen obstruction stone onto rival board',
      toxicName: 'TOXIC 3X3',
      toxicCost: '60 MANA',
      toxicDesc: 'Curse rival hand with a colossal 3x3 block',
      frostName: 'FROST LOCK',
      frostCost: '90 MANA',
      frostDesc: 'Freeze 5 seconds off rival round timer',
      insufficientMana: 'Insufficient Mana',
    },
    tray: {
      dragHint: '👆 DRAG & DROP BLOCKS TO 8x8 BOARD',
    },
    combat: {
      alertTitle: 'INCOMING ATTACK DETECTED!',
      glitchAlert: (name) => `${name} fired a Glitch Stone onto your board!`,
      toxicAlert: (name) => `${name} cursed your hand with a Toxic 3x3!`,
      frostAlert: (name) => `${name} locked your timer (-5 seconds)!`,
    },
    howToPlay: {
      title: '15-SECOND QUICK GUIDE',
      subtitle: 'Master Monad On-Chain Battle Royale mechanics in 3 simple steps:',
      step1Title: '1. Drag & Snap Blocks (1:1 Scale)',
      step1Desc: 'Drag candy blocks from your tray onto the 8x8 grid. True 1:1 socket precision with finger offset so your view is never blocked. Never run out of space!',
      step2Title: '2. Clear Lines & Charge Mana',
      step2Desc: 'Blast full rows and columns to trigger chained combos. Every combo supercharges your Mempool Mana Bar for tactical sabotage.',
      step3Title: '3. Fire Sabotage & Claim Victory',
      step3Desc: 'Lock targets on the top radar, then unleash Glitch Stones, Toxic 3x3, or Frost Locks. Outlast 15 rivals and seize the 1.04 MON escrow prize!',
      gotItBtn: "GOT IT, LET'S BATTLE!",
    },
    gameOver: {
      victoryTitle: 'VICTORY ROYALE!',
      victorySubtitle: '🏆 #1 Champion in 100% On-Chain Monad Tournament!',
      defeatTitle: 'ELIMINATED!',
      defeatSubtitle: '💀 You ran out of board space!',
      finalScore: 'FINAL SCORE',
      escrowPrize: 'ESCROW PRIZE',
      maxCombo: 'MAX COMBO STREAK',
      sabotagesFired: 'SABOTAGES FIRED',
      gasMetricLabel: 'Monad Gas Saved (< 4,500 gas / $0.00001)',
      finalityLabel: 'Monad Testnet 10143: 800ms Finality',
      shareBtn: 'SHARE RESULT ON X / TWITTER',
      shareText: (score, rank, prize) =>
        `Just scored Rank #${rank} in BlitzGrid (The Monad Puzzle Royale) with ${score} PTS and won ${prize}! ⚡🧱 Powered by @monad_xyz. Play live: `,
      playAgainBtn: 'PLAY AGAIN',
      backToLobbyBtn: 'BACK TO LOBBY',
    },
    lobby: {
      title: 'BLITZGRID',
      subtitle: 'THE MONAD PUZZLE ROYALE',
      tagline: '100% On-Chain Block Blast Battle Royale for 16 Players on Monad',
      venueBadge: 'MONAD BLITZ JOGJA VOL. 2 — GIK UGM',
      playerLabel: 'PLAYER NICKNAME',
      playerPlaceholder: 'Enter name (e.g. Faiz.mon)',
      defaultPlayerName: 'Player_1',
      networkLabel: 'SELECT NETWORK MODE',
      networkStage: 'STAGE DEMO (Offline Safe)',
      networkTestnet: 'MONAD TESTNET (10143)',
      enterArenaBtn: 'ENTER ARENA',
      guideBtn: '❓ 15s Quick Guide',
      slidesBtn: '📽️ Stage Pitch Deck',
      qrBtn: '📱 Lobby QR',
      features: {
        speedTitle: '400ms Monad Speed',
        speedDesc: 'Real-time Parallel EVM',
        speedBadge: '< 4,500 gas',
        potTitle: '1.04 MON Escrow Pot',
        potDesc: 'Automatic On-Chain Prize',
        potBadge: '1st: 65%',
        uxTitle: 'Zero Pop-Up UX',
        uxDesc: 'EIP-7702 Ephemeral Session Key',
        uxBadge: '0 Pop-Up',
      },
      sessionActive: 'Session Key Ready',
      sessionPending: 'Preparing Session Key...',
      hostArenaBtn: '👑 CREATE ARENA (HOST)',
    },
    createArena: {
      modalTitle: 'CREATE TOURNAMENT ARENA',
      modalSubtitle: 'Configure prize pool & project stage QR for judges and audience',
      roomNameLabel: 'ARENA / ROOM NAME',
      roomNamePlaceholder: 'e.g. Monad Blitz Jogja Arena #01',
      poolTypeLabel: 'SELECT TOURNAMENT POOL MODEL',
      poolTypeBuyIn: '🪙 P2P Buy-In (Ticket Fee)',
      poolTypeBuyInDesc: 'Every player pays an entry fee. Prize pot is accumulated from all contenders.',
      poolTypeSponsor: '🎁 Sponsored Bounty (Free Entry)',
      poolTypeSponsorDesc: 'Funded upfront by sponsors. Judges & audience enter 100% FREE with no capital!',
      prizeSchemeLabel: 'PRIZE DISTRIBUTION SCHEME',
      schemeWinnerTakesAll: '🏆 Winner-Takes-All',
      schemeWinnerTakesAllDesc: '95% to Champion, 5% to Community Sponsor Treasury.',
      schemePodium: '🏅 Esports Podium Top-3',
      schemePodiumDesc: '1st: 70%, 2nd: 15%, 3rd: 10%, Sponsor Treasury: 5%.',
      entryFeeLabel: 'TICKET ENTRY FEE PER PLAYER',
      sponsorPotLabel: 'TOTAL SPONSOR BOUNTY DEPOSITED',
      treasuryNotice: '💡 5% of the pot is systematically routed to the Community Sponsor Treasury to fund future free rounds.',
      submitBtn: '🚀 CREATE ARENA & SHOW QR',
      cancelBtn: 'Cancel',
    },
    hostArena: {
      title: 'STAGE TOURNAMENT ARENA',
      subtitle: 'Point any smartphone camera to the QR code below to drop into this battle',
      roomBadge: (code) => `ARENA CODE: ${code}`,
      scanHint: '📱 Scan this QR code from any smartphone camera to battle live!',
      joinedCount: (count, max) => `Contenders Joined: ${count} / ${max}`,
      playersTitle: 'CONTENDERS IN LOBBY',
      startBtn: '🔥 START MATCH',
      startHint: 'Unfilled slots will automatically be staffed by Smart AI Bots for instant 16-player combat!',
      copyLinkBtn: 'Copy Room URL',
      linkCopiedToast: 'Room URL Copied to Clipboard!',
      backToLobby: 'Return to Main Lobby',
      sponsoredBadge: '🎁 SPONSORED FREE ENTRY',
      buyInBadge: '🪙 P2P BUY-IN ARENA',
      potLabel: 'TOTAL ON-CHAIN ESCROW POT',
    },
    guestBanner: {
      invitedTitle: 'STAGE TOURNAMENT INVITATION',
      roomLabel: (code) => `Room: #${code}`,
      sponsoredNotice: (amount) => `🎁 100% FREE Entry! Sponsored Prize: ${amount}`,
      buyInNotice: (amount) => `🪙 Entry Fee: ${amount} (Shared Escrow Pot)`,
      joinBtn: '🔥 JOIN BATTLE NOW',
    },
    lobbyQr: {
      title: 'SCAN TO JOIN LOBBY',
      subtitle: 'Point any smartphone camera to instantly drop into the battle arena (P2P):',
      lanLabel: 'Local Wi-Fi (GIK UGM)',
      lanDesc: 'Ultra-low latency LAN connection for judges & stage audience',
      tunnelLabel: 'Public Access (Cloudflare Tunnel)',
      tunnelDesc: 'Universally accessible across any cellular carrier network',
      copyBtn: 'Copy URL',
      copiedToast: 'Link Copied to Clipboard!',
      closeBtn: 'Close',
    },
    pitchDeck: {
      topSub: 'MONAD BLITZ JOGJA VOL. 2 — GIK UGM',
      toggleFullscreen: 'Toggle Presentation Fullscreen',
      closeSlide: 'Close Slides',
      keyboardHint: '(Use keyboard arrow keys ◄ ► or Space to navigate)',
      prevBtn: 'PREVIOUS',
      nextBtn: 'NEXT',
      slides: [
        {
          tag: 'SLIDE 01 // COVER',
          title: 'BLITZGRID',
          subtitle: 'The Monad Puzzle Royale — 100% On-Chain 16-Player Block Blast Battle Royale',
          points: [
            {
              title: 'Hackathon Event',
              desc: 'Monad Blitz Jogja Vol. 2 — Saturday, October 24, 2026',
              badge: 'GIK UGM',
            },
            {
              title: 'Category',
              desc: 'Consumer Gaming & High-Throughput Parallel EVM Showcase',
              badge: 'Monad Testnet',
            },
            {
              title: 'Pitch Presenter',
              desc: 'Faiz & The BlitzGrid Team — 3-Minute Pitch + 2-Minute Jury Q&A',
              badge: '3-Min Pitch',
            },
          ],
          highlight: "Proving Monad's 400ms Speed Through the World's Most Addictive Casual Mechanic.",
        },
        {
          tag: 'SLIDE 02 // THE PROBLEM',
          title: 'BLOCK BLAST IS VIRAL, BUT SOLO & OFFLINE',
          subtitle: '100M+ Daily Players Trapped in Isolated, Non-Competitive Silos',
          points: [
            {
              title: '#1 Mobile Casual Game',
              desc: 'Hundreds of millions play daily across cafes and commutes, yet it remains 100% offline solo.',
              badge: '100M+ Downloads',
            },
            {
              title: 'Real-Money Stakes Impossible in Web2',
              desc: 'Rampant client-side memory hacks and opaque centralized servers destroy competitive integrity.',
              badge: 'Cheat Vulnerable',
            },
            {
              title: 'Legacy Web3 Gaming Has Failed',
              desc: 'Notoriously sluggish, transaction delays, and relentless wallet approval pop-ups that break immersion.',
              badge: 'UX Problem',
            },
          ],
          highlight: 'Players Crave High-Stakes Competitive Skill Showdowns that are Provably Fair, Fast, and Transparent.',
        },
        {
          tag: 'SLIDE 03 // THE SOLUTION',
          title: 'BLITZGRID: 16P ON-CHAIN PUZZLE ROYALE',
          subtitle: 'Transforming Casual Tile-Matching into a 60-Second Reflex Battle Arena',
          points: [
            {
              title: '16 Concurrent Contenders',
              desc: 'Every contender arranges candy blocks on their private 8x8 grid in real-time.',
              badge: '16 Players',
            },
            {
              title: 'Mempool Mana Loop',
              desc: 'Clearing rows supercharges the Mana Bar to launch tactical sabotage strikes against rivals.',
              badge: 'Combat Loop',
            },
            {
              title: 'Last Contender Standing',
              desc: 'Contenders running out of board space are eliminated; the victor claims the Monad Escrow Prize!',
              badge: '1.04 MON Escrow',
            },
          ],
          highlight: 'Addictive Block Blast Physics + Tetris 99 Adrenaline + Monad Atomic Finality.',
        },
        {
          tag: 'SLIDE 04 // CORE GAMEPLAY LOOP',
          title: 'PLACE, COMBO, FIRE SABOTAGE!',
          subtitle: 'High-Tempo Reflex Warfare with Zero-Latency Bi-Directional Interaction',
          points: [
            {
              title: '1. Precision 1:1 Block Placement',
              desc: 'Drag & drop candy shapes into the 8x8 board with thumb offset for flawless visibility.',
              badge: '120 FPS 2D Engine',
            },
            {
              title: '2. Harvest Mempool Mana',
              desc: 'Multi-line clears harvest 15 to 45 Mempool Mana to fuel combat artillery.',
              badge: 'Mana Formula',
            },
            {
              title: '3. Deploy 3 Sabotage Weapons',
              desc: 'Glitch Stone (30 Mana), Toxic 3x3 Curse (60 Mana), and Frost Lock (90 Mana).',
              badge: 'Sabotage Arsenal',
            },
          ],
          highlight: 'Not Just Solo Puzzling: Every Move You Make Directly Dictates Your Rival’s Survival.',
        },
        {
          tag: 'SLIDE 05 // THE ENGINEERING FEAT',
          title: 'uint64 BITWISE & ASYNC COMBAT INBOX',
          subtitle: 'Two Pioneering EVM Architectural Breakthroughs Built for Monad Parallelism',
          points: [
            {
              title: 'uint64 Bitwise Board (< 3,500 Gas)',
              desc: 'Entire 8x8 board encoded in a single storage slot. Collision and line-clears execute in 1 bitwise opcode.',
              badge: '98.5% Gas Reduction',
            },
            {
              title: 'Asynchronous Combat Inbox',
              desc: 'Incoming attacks queue in isolated target inboxes, evaluated on target turn. Zero state contention!',
              badge: 'Parallel Friendly',
            },
            {
              title: '26/26 Foundry Tests Passing',
              desc: 'Comprehensive smart contract test suite passes 100% with deterministic precision.',
              badge: '100% Verified',
            },
          ],
          highlight: 'The First Game Architected from Day 1 to Exploit Monad’s Parallel Execution Engine.',
        },
        {
          tag: 'SLIDE 06 // INVISIBLE WEB3 UX',
          title: 'EIP-7702 EPHEMERAL SESSION KEYS',
          subtitle: 'Zero MetaMask Pop-ups: Web2-Grade Arcade Fluidity with Web3 Ownership',
          points: [
            {
              title: '1-Click 60-Second Session',
              desc: 'Sign once upon entering the arena. Ephemeral session keys validate on-chain moves in the background.',
              badge: 'Zero Friction',
            },
            {
              title: 'Dual Mode: Live & Offline Safe',
              desc: 'Instantly toggle between Monad Testnet (Chain ID 10143) and zero-wallet offline stage demo.',
              badge: 'Fail-Proof Demo',
            },
            {
              title: 'Procedural Audio (0 KB)',
              desc: 'Pure Web Audio API synthetic chiptune waveforms with zero external mp3 file downloads.',
              badge: 'Instant Load',
            },
          ],
          highlight: 'Players Never Notice the Blockchain Underneath: All They Feel is Blistering Arcade Speed.',
        },
        {
          tag: 'SLIDE 07 // LIVE DEMO HIGHLIGHTS',
          title: 'PROVING IT LIVE ON STAGE',
          subtitle: 'Witness Real-Time Parallel EVM Gameplay Directly in Front of the Jury',
          points: [
            {
              title: 'Scan On-Screen QR Code',
              desc: 'Judges and audience join the live lobby room via GIK UGM Wi-Fi or Cloudflare Tunnel.',
              badge: 'Scan & Play',
            },
            {
              title: 'Real-Time Sabotage Laser Arcs',
              desc: 'Watch laser projectile beams arc across the arena from the weapon dock to locked rival radars.',
              badge: 'Visual Feedback',
            },
            {
              title: 'Juicy Voxel Candy Clears',
              desc: 'Satisfying tactile pops when clearing multi-lines and launching devastating cascade streaks.',
              badge: 'Tactile Polish',
            },
          ],
          highlight: 'Not Theoretical Pitch Slides: This Code is Running Live Right Now in Front of You.',
        },
        {
          tag: 'SLIDE 08 // MARKET & TOKEN SINK',
          title: 'MARKET OPPORTUNITY & TOKEN SINK',
          subtitle: 'How BlitzGrid Drives Daily Retail Transaction Velocity on Monad',
          points: [
            {
              title: 'Micro-Wager Escrow Pools',
              desc: 'Contenders stake 0.05 MON entry fee. 16 players generate 0.8 MON pool every 60 seconds.',
              badge: 'Organic Volume',
            },
            {
              title: '5% Treasury & Burn Mechanism',
              desc: '5% rake allocated toward automated token burns and weekly community tournament rewards.',
              badge: 'Sustainable Tokenomics',
            },
            {
              title: 'High-TPS Generator',
              desc: '16 players x ~40 moves per match = 640 on-chain transactions per minute per arena.',
              badge: 'High Throughput',
            },
          ],
          highlight: 'Converting Web2 Casual Gamers into the Largest Active On-Chain Userbase on Monad.',
        },
        {
          tag: 'SLIDE 09 // POST-HACKATHON ROADMAP',
          title: 'PRODUCTION ROADMAP & ROLLOUT',
          subtitle: 'From GIK UGM Hackathon to Monad Mainnet Launch in 2026',
          points: [
            {
              title: 'Month 1 (Oct - Nov 2026)',
              desc: 'Slither contract audit, Envio HyperIndex integration for global 16-player P2P matchmaking.',
              badge: 'Month 1',
            },
            {
              title: 'Month 2 (Dec 2026)',
              desc: 'Public Community Cup with 500 MON prize pool, global leaderboard, and Mainnet rollout.',
              badge: 'Month 2',
            },
            {
              title: 'Monad Mobile Mini-App',
              desc: 'Telegram & Farcaster Frames integration for 1-click viral onboarding of millions.',
              badge: 'Mass Adoption',
            },
          ],
          highlight: 'Not Just a Hackathon Proof-of-Concept: A Battle-Tested Product Ready to Dominate Monad Mainnet.',
        },
        {
          tag: 'SLIDE 10 // CLOSING & CALL TO ACTION',
          title: 'THE MONAD PUZZLE ROYALE IS HERE',
          subtitle: 'Experience 120 FPS On-Chain Battle Royale Live in Your Mobile Browser!',
          points: [
            {
              title: 'Live Playable URL',
              desc: 'http://192.168.1.114:3000 (GIK UGM Wi-Fi) or Public Cloudflare Tunnel',
              badge: 'Play Now',
            },
            {
              title: 'Open Source Smart Contracts',
              desc: '26/26 Foundry Unit Tests 100% Passing with extreme bitwise gas optimization.',
              badge: 'Open Source',
            },
            {
              title: 'Closing Punchline',
              desc: '"If Block Blast keeps millions playing in solitary confinement, BlitzGrid unites millions in simultaneous on-chain combat on Monad!"',
              badge: 'Faiz & Team',
            },
          ],
          highlight: 'Thank You Judges and the Monad Blitz Jogja Community! Let the Battle Begin!',
        },
      ],
    },
    blossom: {
      blossomBlast: 'BLOSSOM BLAST',
      home: 'Home',
      playNow: 'PLAY NOW!',
      classicMode: 'CLASSIC MODE',
      endlessSubtitle: 'Endless Blossom Puzzle',
      adventureMode: 'BUNNY ADVENTURE',
      adventureSubtitle: 'Sakura Grove: Stage 8/12',
      arenaTournament: 'ARENA TOURNAMENT ⚡',
      arenaSubtitle: 'Monad Blitz: Rotating Bounty Pot',
      bestScore: 'BEST',
      strawberryCoins: 'STRAWBERRY COINS',
      bunnyMaster: 'Bunny Master',
      level: 'LVL',
      exp: 'Exp',
      nextLvl: 'NEXT: LVL 19 🥕',
      dailyQuestTitle: 'DAILY BLOSSOM QUEST',
      dailyQuestTime: '• 14h 25m',
      dailyQuestDesc: 'Clear 15 strawberry lines',
      dailyQuestReward: '+300 🍓',
      shop: 'Shop',
      ranks: 'Ranks',
      badges: 'Badges',
      skins: 'Skins',
      playNav: 'Play 🌸',
      arenaNav: 'Arena',
      hostNav: 'Stage',
      settingsNav: 'Settings',
      linesCleared: 'LINES CLEARED',
      maxStreak: 'MAX STREAK',
      blocksPlaced: 'BLOCKS PLACED',
      monWon: 'MON WON',
      backToLobby: '🏠 BACK TO LOBBY',
      playAgain: '🔄 PLAY AGAIN',
      breakTime: 'BREAK TIME 🐰',
      noMoreMoves: 'NO MORE MOVES!',
    },
  },
};
