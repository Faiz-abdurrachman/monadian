/**
 * Monadian Engine — TypeScript Bitwise Mirror
 * 1:1 mirroring dari logika Solidity MonadianPieces & MonadianGame uint64
 * Dilengkapi dengan Palet Warna Candy Block Blast & Visual Layout
 */

export interface PieceData {
  id: number;
  name: string;
  width: number;
  height: number;
  baseMask: bigint;
  layout: number[][]; // visual matrix for rendering
  hexColor: number;   // for Three.js materials
  colorClass: string; // for Tailwind CSS badges
  glowColor: string;
}

export const PIECES: PieceData[] = [
  // 0: Dot 1x1 (Sunshine Gold)
  {
    id: 0,
    name: "Dot 1x1",
    width: 1,
    height: 1,
    baseMask: 0x1n,
    layout: [[1]],
    hexColor: 0xfbbf24,
    colorClass: "bg-amber-400 shadow-[0_0_12px_#fbbf24]",
    glowColor: "#fbbf24",
  },
  // 1: Line H2 (Vibrant Sky Cyan)
  {
    id: 1,
    name: "Line H2",
    width: 2,
    height: 1,
    baseMask: 0x3n,
    layout: [[1, 1]],
    hexColor: 0x06b6d4,
    colorClass: "bg-cyan-400 shadow-[0_0_12px_#06b6d4]",
    glowColor: "#06b6d4",
  },
  // 2: Line V2 (Vibrant Sky Cyan)
  {
    id: 2,
    name: "Line V2",
    width: 1,
    height: 2,
    baseMask: 0x0101n,
    layout: [[1], [1]],
    hexColor: 0x06b6d4,
    colorClass: "bg-cyan-400 shadow-[0_0_12px_#06b6d4]",
    glowColor: "#06b6d4",
  },
  // 3: Line H3 (Vivid Ocean Blue)
  {
    id: 3,
    name: "Line H3",
    width: 3,
    height: 1,
    baseMask: 0x7n,
    layout: [[1, 1, 1]],
    hexColor: 0x3b82f6,
    colorClass: "bg-blue-500 shadow-[0_0_12px_#3b82f6]",
    glowColor: "#3b82f6",
  },
  // 4: Line V3 (Vivid Ocean Blue)
  {
    id: 4,
    name: "Line V3",
    width: 1,
    height: 3,
    baseMask: 0x010101n,
    layout: [[1], [1], [1]],
    hexColor: 0x3b82f6,
    colorClass: "bg-blue-500 shadow-[0_0_12px_#3b82f6]",
    glowColor: "#3b82f6",
  },
  // 5: Line H4 (Royal Cobalt)
  {
    id: 5,
    name: "Line H4",
    width: 4,
    height: 1,
    baseMask: 0xFn,
    layout: [[1, 1, 1, 1]],
    hexColor: 0x2563eb,
    colorClass: "bg-indigo-500 shadow-[0_0_12px_#2563eb]",
    glowColor: "#2563eb",
  },
  // 6: Line V4 (Royal Cobalt)
  {
    id: 6,
    name: "Line V4",
    width: 1,
    height: 4,
    baseMask: 0x01010101n,
    layout: [[1], [1], [1], [1]],
    hexColor: 0x2563eb,
    colorClass: "bg-indigo-500 shadow-[0_0_12px_#2563eb]",
    glowColor: "#2563eb",
  },
  // 7: Line H5 (Deep Sapphire)
  {
    id: 7,
    name: "Line H5",
    width: 5,
    height: 1,
    baseMask: 0x1Fn,
    layout: [[1, 1, 1, 1, 1]],
    hexColor: 0x1d4ed8,
    colorClass: "bg-blue-600 shadow-[0_0_12px_#1d4ed8]",
    glowColor: "#1d4ed8",
  },
  // 8: Line V5 (Deep Sapphire)
  {
    id: 8,
    name: "Line V5",
    width: 1,
    height: 5,
    baseMask: 0x0101010101n,
    layout: [[1], [1], [1], [1], [1]],
    hexColor: 0x1d4ed8,
    colorClass: "bg-blue-600 shadow-[0_0_12px_#1d4ed8]",
    glowColor: "#1d4ed8",
  },
  // 9: Square 2x2 (Crisp Apple Emerald)
  {
    id: 9,
    name: "Square 2x2",
    width: 2,
    height: 2,
    baseMask: 0x0303n,
    layout: [[1, 1], [1, 1]],
    hexColor: 0x10b981,
    colorClass: "bg-emerald-400 shadow-[0_0_12px_#10b981]",
    glowColor: "#10b981",
  },
  // 10: Square 3x3 (Danger Coral Red - The Giant Block)
  {
    id: 10,
    name: "Square 3x3",
    width: 3,
    height: 3,
    baseMask: 0x070707n,
    layout: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    hexColor: 0xf97316,
    colorClass: "bg-orange-500 shadow-[0_0_15px_#f97316]",
    glowColor: "#f97316",
  },
  // 11: Corner TL (Royal Monad Violet)
  {
    id: 11,
    name: "Corner TL",
    width: 2,
    height: 2,
    baseMask: 0x0103n,
    layout: [[1, 1], [1, 0]],
    hexColor: 0x8b5cf6,
    colorClass: "bg-purple-500 shadow-[0_0_12px_#8b5cf6]",
    glowColor: "#8b5cf6",
  },
  // 12: Corner TR (Royal Monad Violet)
  {
    id: 12,
    name: "Corner TR",
    width: 2,
    height: 2,
    baseMask: 0x0203n,
    layout: [[1, 1], [0, 1]],
    hexColor: 0x8b5cf6,
    colorClass: "bg-purple-500 shadow-[0_0_12px_#8b5cf6]",
    glowColor: "#8b5cf6",
  },
  // 13: Corner BL (Royal Monad Violet)
  {
    id: 13,
    name: "Corner BL",
    width: 2,
    height: 2,
    baseMask: 0x0301n,
    layout: [[1, 0], [1, 1]],
    hexColor: 0x8b5cf6,
    colorClass: "bg-purple-500 shadow-[0_0_12px_#8b5cf6]",
    glowColor: "#8b5cf6",
  },
  // 14: Corner BR (Royal Monad Violet)
  {
    id: 14,
    name: "Corner BR",
    width: 2,
    height: 2,
    baseMask: 0x0302n,
    layout: [[0, 1], [1, 1]],
    hexColor: 0x8b5cf6,
    colorClass: "bg-purple-500 shadow-[0_0_12px_#8b5cf6]",
    glowColor: "#8b5cf6",
  },
  // 15: T-Up (Tangerine Orange)
  {
    id: 15,
    name: "T-Up",
    width: 3,
    height: 2,
    baseMask: 0x0702n,
    layout: [[0, 1, 0], [1, 1, 1]],
    hexColor: 0xf97316,
    colorClass: "bg-orange-400 shadow-[0_0_12px_#f97316]",
    glowColor: "#f97316",
  },
  // 16: T-Down (Tangerine Orange)
  {
    id: 16,
    name: "T-Down",
    width: 3,
    height: 2,
    baseMask: 0x0207n,
    layout: [[1, 1, 1], [0, 1, 0]],
    hexColor: 0xf97316,
    colorClass: "bg-orange-400 shadow-[0_0_12px_#f97316]",
    glowColor: "#f97316",
  },
  // 17: T-Left (Tangerine Orange)
  {
    id: 17,
    name: "T-Left",
    width: 2,
    height: 3,
    baseMask: 0x020302n,
    layout: [[0, 1], [1, 1], [0, 1]],
    hexColor: 0xf97316,
    colorClass: "bg-orange-400 shadow-[0_0_12px_#f97316]",
    glowColor: "#f97316",
  },
  // 18: T-Right (Tangerine Orange)
  {
    id: 18,
    name: "T-Right",
    width: 2,
    height: 3,
    baseMask: 0x010301n,
    layout: [[1, 0], [1, 1], [1, 0]],
    hexColor: 0xf97316,
    colorClass: "bg-orange-400 shadow-[0_0_12px_#f97316]",
    glowColor: "#f97316",
  },
];

export const ROW_MASK = 0xFFn;
export const COL_MASK = 0x0101010101010101n;

/**
 * Menghitung bitmask uint64 pada koordinat (x, y) dengan Boundary Guard.
 */
export function getMaskAt(pieceId: number, x: number, y: number): bigint | null {
  const piece = PIECES[pieceId];
  if (!piece) return null;
  if (x < 0 || y < 0 || x + piece.width > 8 || y + piece.height > 8) {
    return null; // Exceeds boundary
  }

  const shift = BigInt(y * 8 + x);
  return piece.baseMask << shift;
}

/**
 * Cek tabrakan bitwise: (board & mask) == 0n
 */
export function checkCollision(board: bigint, mask: bigint): boolean {
  return (board & mask) !== 0n;
}

/**
 * Menaruh balok: board | mask
 */
export function placePiece(board: bigint, mask: bigint): bigint {
  return board | mask;
}

/**
 * Deteksi dan pembersihan baris & kolom secara simultan.
 */
export function clearLines(board: bigint): { newBoard: bigint; linesCleared: number; clearedRowIndices: number[]; clearedColIndices: number[] } {
  let linesCleared = 0;
  let clearMask = 0n;
  const clearedRowIndices: number[] = [];
  const clearedColIndices: number[] = [];

  // 8 Baris
  for (let r = 0; r < 8; r++) {
    const rMask = ROW_MASK << BigInt(r * 8);
    if ((board & rMask) === rMask) {
      clearMask |= rMask;
      linesCleared++;
      clearedRowIndices.push(r);
    }
  }

  // 8 Kolom
  for (let c = 0; c < 8; c++) {
    const cMask = COL_MASK << BigInt(c);
    if ((board & cMask) === cMask) {
      clearMask |= cMask;
      linesCleared++;
      clearedColIndices.push(c);
    }
  }

  const newBoard = board & ~clearMask;
  return { newBoard, linesCleared, clearedRowIndices, clearedColIndices };
}

/**
 * Perhitungan Mempool Mana berdasarkan base mana dan combo streak.
 */
export function calculateMana(linesCleared: number, comboStreak: number): number {
  if (linesCleared === 0) return 0;
  const baseMana = linesCleared === 1 ? 10 : linesCleared === 2 ? 25 : linesCleared === 3 ? 50 : 80;
  return Math.floor((baseMana * (10 + comboStreak * 5)) / 10);
}

/**
 * Mengecek apakah sebuah bit aktif pada indeks (0..63).
 */
export function isBitSet(board: bigint, bitIndex: number): boolean {
  return ((board >> BigInt(bitIndex)) & 1n) === 1n;
}

/**
 * Mengecek apakah satu balok tertentu masih bisa dipasang di posisi manapun pada papan saat ini.
 */
export function canPlaceSinglePiece(board: bigint, pieceId: number): boolean {
  const piece = PIECES[pieceId];
  if (!piece) return false;

  for (let y = 0; y <= 8 - piece.height; y++) {
    for (let x = 0; x <= 8 - piece.width; x++) {
      const mask = getMaskAt(pieceId, x, y);
      if (mask !== null && !checkCollision(board, mask)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Mengecek apakah pemain masih punya gerakan sah (Game Over check).
 */
export function canPlaceAnyPiece(board: bigint, availablePieceIds: number[]): boolean {
  for (const pieceId of availablePieceIds) {
    if (canPlaceSinglePiece(board, pieceId)) {
      return true;
    }
  }
  return false;
}

/**
 * Mencari posisi penempatan terbaik (originX, originY) ketika pemain menyentuh/klik sel (targetX, targetY).
 * Memprioritaskan:
 * 1. Penempatan berpusat (centered) di sel target.
 * 2. Penempatan direct (top-left) di sel target.
 * 3. Setiap penempatan sah yang melingkupi/menutupi sel target tanpa tabrakan.
 */
export function findBestPlacement(
  board: bigint,
  pieceId: number,
  targetX: number,
  targetY: number
): { x: number; y: number; mask: bigint } | null {
  const piece = PIECES[pieceId];
  if (!piece) return null;

  // 1. Prioritas 1: Centered placement
  const centeredX = Math.max(0, Math.min(8 - piece.width, targetX - Math.floor((piece.width - 1) / 2)));
  const centeredY = Math.max(0, Math.min(8 - piece.height, targetY - Math.floor((piece.height - 1) / 2)));
  const centeredMask = getMaskAt(pieceId, centeredX, centeredY);
  if (centeredMask !== null && !checkCollision(board, centeredMask)) {
    return { x: centeredX, y: centeredY, mask: centeredMask };
  }

  // 2. Prioritas 2: Direct top-left placement
  if (targetX <= 8 - piece.width && targetY <= 8 - piece.height) {
    const directMask = getMaskAt(pieceId, targetX, targetY);
    if (directMask !== null && !checkCollision(board, directMask)) {
      return { x: targetX, y: targetY, mask: directMask };
    }
  }

  // 3. Prioritas 3: Posisi sah mana pun yang menutupi (targetX, targetY) dengan balok aktif
  for (let r = 0; r < piece.height; r++) {
    for (let c = 0; c < piece.width; c++) {
      if (piece.layout[r][c] === 1) {
        const originX = targetX - c;
        const originY = targetY - r;
        if (
          originX >= 0 &&
          originX + piece.width <= 8 &&
          originY >= 0 &&
          originY + piece.height <= 8
        ) {
          const candidateMask = getMaskAt(pieceId, originX, originY);
          if (candidateMask !== null && !checkCollision(board, candidateMask)) {
            return { x: originX, y: originY, mask: candidateMask };
          }
        }
      }
    }
  }

  return null;
}

