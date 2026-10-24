/**
 * Monadian Combat Engine — Asynchronous Combat Inbox & Bot AI Threat System
 * Mengimplementasikan pola 1:1 dari kontrak Solidity MonadianCombat.sol
 */

import { isBitSet } from './bitwise';

export type WeaponType = 'glitch' | 'toxic' | 'frost';

export interface CombatAttack {
  id: string;
  senderId: string;
  senderName: string;
  targetId: string; // 'player' atau opponent.id
  type: WeaponType;
  timestamp: number;
}

export interface OpponentState {
  id: string;
  name: string;
  boardFillPercent: number;
  isAlive: boolean;
  sabotaged: boolean;
  mana: number;
  lastAttackTime: number;
}

/**
 * Mencari indeks petak kosong (0 - 63) yang belum terisi balok maupun batu sabotase.
 * Memprioritaskan petak di paruh bawah papan (baris 4-7) agar lebih menantang bagi pemain.
 */
export function findRandomEmptyCell(board: bigint, sabotageMask: bigint): number | null {
  const combined = board | sabotageMask;
  const bottomEmpty: number[] = [];
  const topEmpty: number[] = [];

  for (let idx = 0; idx < 64; idx++) {
    if (!isBitSet(combined, idx)) {
      if (idx >= 32) {
        bottomEmpty.push(idx);
      } else {
        topEmpty.push(idx);
      }
    }
  }

  if (bottomEmpty.length > 0) {
    const choice = Math.floor(Math.random() * bottomEmpty.length);
    return bottomEmpty[choice];
  }

  if (topEmpty.length > 0) {
    const choice = Math.floor(Math.random() * topEmpty.length);
    return topEmpty[choice];
  }

  return null;
}

/**
 * Mengonsumsi antrean serangan masuk (Asynchronous Combat Inbox) milik pemain saat giliran berikutnya.
 * Memproses:
 * 1. Glitch Stone: Menanam 1 batu titanium abu-abu pada petak kosong.
 * 2. Toxic Hand: Mengaktifkan status kutukan tangan (balok 3x3 raksasa).
 * 3. Frost Lock: Mengurangi timer 5 detik dan membekukan papan sesaat.
 */
export function consumePlayerInbox(
  pendingAttacks: CombatAttack[],
  currentBoard: bigint,
  currentSabotage: bigint
): {
  newBoard: bigint;
  newSabotageMask: bigint;
  hasToxicCurse: boolean;
  timePenaltySeconds: number;
  consumed: CombatAttack[];
  addedStonesCount: number;
} {
  let newBoard = currentBoard;
  let newSabotageMask = currentSabotage;
  let hasToxicCurse = false;
  let timePenaltySeconds = 0;
  let addedStonesCount = 0;

  for (const attack of pendingAttacks) {
    if (attack.type === 'glitch') {
      const emptySlot = findRandomEmptyCell(newBoard, newSabotageMask);
      if (emptySlot !== null) {
        const bit = 1n << BigInt(emptySlot);
        newSabotageMask |= bit;
        newBoard |= bit;
        addedStonesCount++;
      }
    } else if (attack.type === 'toxic') {
      hasToxicCurse = true;
    } else if (attack.type === 'frost') {
      timePenaltySeconds += 5;
    }
  }

  return {
    newBoard,
    newSabotageMask,
    hasToxicCurse,
    timePenaltySeconds,
    consumed: [...pendingAttacks],
    addedStonesCount,
  };
}

/**
 * Loop Evaluasi AI Bot Opponents
 * Dijalankan tiap detik dalam game loop untuk menentukan apakah bot mengumpulkan mana
 * dan melancarkan serangan ke pemain atau ke bot lainnya.
 */
export function evaluateBotCombat(
  opponents: OpponentState[],
  roundTimeLeft: number,
  onBotAttackPlayer: (attack: CombatAttack) => void,
  onBotAttackBot: (attack: CombatAttack) => void
): OpponentState[] {
  const now = Date.now();
  const aliveBots = opponents.filter((o) => o.isAlive);

  return opponents.map((bot) => {
    if (!bot.isAlive) return bot;

    // Tambah mana bot secara organik (2-6 mana per tick)
    const manaGain = Math.floor(Math.random() * 5) + 2;
    const currentMana = Math.min(100, (bot.mana || 0) + manaGain);

    // Minimal jeda 6 detik antar serangan per bot
    const timeSinceLastAttack = now - (bot.lastAttackTime || 0);
    if (timeSinceLastAttack < 6000) {
      return { ...bot, mana: currentMana };
    }

    // Tentukan apakah bot ingin menyerang saat mana cukup (30+)
    // Jika waktu tersisa < 20 detik (Endgame), intensitas serangan bot melonjak!
    const endgameMultiplier = roundTimeLeft < 20 ? 1.8 : 1.0;
    const shouldAttack = currentMana >= 30 && Math.random() < 0.16 * endgameMultiplier;

    if (shouldAttack) {
      // Pilih jenis senjata berdasarkan mana bot
      let weaponType: WeaponType = 'glitch';
      let manaCost = 30;

      if (currentMana >= 100 && Math.random() < 0.3) {
        weaponType = 'frost';
        manaCost = 100;
      } else if (currentMana >= 60 && Math.random() < 0.4) {
        weaponType = 'toxic';
        manaCost = 60;
      }

      // Tentukan target: 30% peluang menargetkan Player Utama, 70% menargetkan bot lain
      const targetsPlayer = Math.random() < 0.30;

      const attack: CombatAttack = {
        id: `atk-${now}-${Math.random().toString(36).substring(2, 6)}`,
        senderId: bot.id,
        senderName: bot.name,
        targetId: targetsPlayer ? 'player' : '',
        type: weaponType,
        timestamp: now,
      };

      if (targetsPlayer) {
        onBotAttackPlayer(attack);
      } else {
        // Pilih bot acak selain dirinya sendiri
        const otherBots = aliveBots.filter((b) => b.id !== bot.id);
        if (otherBots.length > 0) {
          const victim = otherBots[Math.floor(Math.random() * otherBots.length)];
          attack.targetId = victim.id;
          onBotAttackBot(attack);
        }
      }

      return {
        ...bot,
        mana: currentMana - manaCost,
        lastAttackTime: now,
      };
    }

    return { ...bot, mana: currentMana };
  });
}
