// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

enum RoundStatus {
    IDLE,
    MATCHMAKING,
    ACTIVE,
    COMPLETED,
    CANCELLED
}

enum AttackType {
    GLITCH_STONE,
    TOXIC_HAND,
    FROST_LOCK
}

struct PlayerState {
    uint64 board;             // 64 bit mewakili grid 8x8 (0 = kosong, 1 = terisi/batu)
    uint32 mana;              // Akumulasi Mempool Mana yang siap dibelanjakan
    uint16 score;             // Skor poin eliminasi
    uint8 comboStreak;        // Pengali kombo beruntun saat ini
    uint8 handCycle;          // Siklus paket 3 balok ke berapa
    uint8 usedPiecesMask;     // Bitmask 3 bit (bit 0, 1, 2) untuk balok yang sudah terpasang di siklus ini
    uint8 koBadges;           // Jumlah pemain yang berhasil dieliminasi
    uint32 lastMoveTimestamp; // Penanda waktu langkah terakhir (untuk blitz timer 4 detik)
    bool isAlive;             // Status hidup/mati pemain dalam ronde
    uint8 finishRank;         // Peringkat akhir eliminasi (1 = Juara 1)
}

struct AttackPayload {
    address attacker;
    address target;
    AttackType weapon;
    uint8 intensity;          // Jumlah batu atau durasi beku
    uint32 blockNumber;
}

struct RoundConfig {
    uint256 entryFee;         // Biaya tiket dalam wei (misal 0.1 MON)
    uint16 maxPlayers;        // Jumlah pemain (16 atau 32)
    uint16 durationSeconds;   // Durasi ronde (60 atau 90 detik)
    bool weaponsEnabled;      // True jika mode tempur, False jika mode Zen
    address sponsorToken;     // Alamat token hadiah jika disponsori protokol
}
