import { useRef, forwardRef, useImperativeHandle } from 'react';
import { isBitSet } from '../engine/bitwise';

export interface Board3DHandle {
  getGridCoordsAt: (clientX: number, clientY: number) => { x: number; y: number } | null;
  getCellSizePx: () => number;
  getBoardRect: () => DOMRect | null;
}

interface Board3DProps {
  board: bigint;
  sabotageMask: bigint;
  ghostMask: bigint | null;
  isGhostValid: boolean;
  clearingRows: number[];
  clearingCols: number[];
  cellColors?: (number | null)[];
  clearBanner?: { text: string; subtext?: string } | null;
  isShaking?: boolean;
  onCellClick?: (x: number, y: number) => void;
}

// 6 Palet Warna Permen Bubble Pop-it (Figma Exact Match)
export const CANDY_THEMES = [
  // 0: Sky Candy Blue
  {
    name: 'cyan',
    bg: 'bg-gradient-to-b from-[#7DD3FC] via-[#38BDF8] to-[#0284C7]',
    borderBottom: 'border-b-[#0369A1]',
    glow: 'shadow-[0_4px_10px_rgba(56,189,248,0.45)]',
    glint: 'bg-white/90',
  },
  // 1: Monad Lavender Violet
  {
    name: 'purple',
    bg: 'bg-gradient-to-b from-[#E9D5FF] via-[#C084FC] to-[#9333EA]',
    borderBottom: 'border-b-[#7E22CE]',
    glow: 'shadow-[0_4px_10px_rgba(168,85,247,0.45)]',
    glint: 'bg-white/90',
  },
  // 2: Sunset Peach Orange
  {
    name: 'orange',
    bg: 'bg-gradient-to-b from-[#FED7AA] via-[#FB923C] to-[#EA580C]',
    borderBottom: 'border-b-[#C2410C]',
    glow: 'shadow-[0_4px_10px_rgba(249,115,22,0.45)]',
    glint: 'bg-white/90',
  },
  // 3: Sakura Blossom Cherry Pink
  {
    name: 'rose',
    bg: 'bg-gradient-to-b from-[#FBCFE8] via-[#FF5C7A] to-[#E11D48]',
    borderBottom: 'border-b-[#BE123C]',
    glow: 'shadow-[0_4px_10px_rgba(255,92,122,0.45)]',
    glint: 'bg-white/90',
  },
  // 4: Pastel Mint Green
  {
    name: 'emerald',
    bg: 'bg-gradient-to-b from-[#99F6E4] via-[#2DD4BF] to-[#0D9488]',
    borderBottom: 'border-b-[#0F766E]',
    glow: 'shadow-[0_4px_10px_rgba(45,212,191,0.45)]',
    glint: 'bg-white/90',
  },
  // 5: Lemon Cream Honey Yellow
  {
    name: 'gold',
    bg: 'bg-gradient-to-b from-[#FEF08A] via-[#FBBF24] to-[#D97706]',
    borderBottom: 'border-b-[#B45309]',
    glow: 'shadow-[0_4px_10px_rgba(245,158,11,0.45)]',
    glint: 'bg-white/90',
  },
];

export const getPieceThemeIndex = (pieceId: number, slotIndex?: number): number => {
  if (pieceId === 10) {
    if (slotIndex === 1) return 3;
    if (slotIndex === 2) return 5;
    return 2;
  }
  if (pieceId === 9) return 5; // Square 2x2: Yellow/Gold like Figma!
  if (pieceId === 0) return 5; // Dot: gold
  if (pieceId >= 1 && pieceId <= 4) return 4; // Line 2, 3: mint green like Figma!
  if (pieceId >= 5 && pieceId <= 8) return 0; // Line 4, 5: cyan blue
  if (pieceId >= 11 && pieceId <= 14) return 0; // Corner 2x2: blue like Figma!
  if (pieceId >= 15 && pieceId <= 18) return 3; // Corner 3x3: rose pink
  return (pieceId + (slotIndex || 0)) % CANDY_THEMES.length;
};

export const Board3D = forwardRef<Board3DHandle, Board3DProps>(({
  board,
  sabotageMask,
  ghostMask,
  isGhostValid,
  clearingRows,
  clearingCols,
  cellColors,
  clearBanner = null,
  isShaking = false,
  onCellClick,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose coordinate raycasting & layout metrics for external dragging from hand tray
  useImperativeHandle(ref, () => ({
    getGridCoordsAt: (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return null;
      const gridEl = (el.querySelector('.grid') as HTMLElement) || el;
      const rect = gridEl.getBoundingClientRect();
      
      // Extended tolerance margin around board edges for natural thumb feel
      if (
        clientX < rect.left - 24 ||
        clientX > rect.right + 24 ||
        clientY < rect.top - 24 ||
        clientY > rect.bottom + 24
      ) {
        return null;
      }

      const col = Math.floor(((clientX - rect.left) / rect.width) * 8);
      const row = Math.floor(((clientY - rect.top) / rect.height) * 8);

      if (col >= 0 && col < 8 && row >= 0 && row < 8) {
        return { x: col, y: row };
      }
      return null;
    },
    getCellSizePx: () => {
      const firstCell = containerRef.current?.querySelector('.grid > div');
      if (firstCell) {
        const cellRect = firstCell.getBoundingClientRect();
        if (cellRect.width > 12) {
          return Math.round(cellRect.width);
        }
      }
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return 38;
      const innerW = rect.width - 24;
      return Math.round(innerW / 8);
    },
    getBoardRect: () => {
      return containerRef.current?.getBoundingClientRect() || null;
    },
  }));

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* ==================================================================== */}
      {/* TWO PINK CALENDAR BINDER HANGING LOOPS (Exact Figma Match)           */}
      {/* ==================================================================== */}
      <div className="absolute -top-3.5 sm:-top-4 left-0 right-0 px-[22%] flex items-center justify-between pointer-events-none z-20">
        {/* Left Loop */}
        <div className="w-7 h-6 sm:w-8 sm:h-7 rounded-t-[10px] bg-[#FF6584] border-2 border-b-0 border-[#F43F5E] shadow-xs flex items-center justify-center pt-0.5">
          <div className="w-2.5 h-3.5 sm:w-3 sm:h-4 rounded-full bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]" />
        </div>
        {/* Right Loop */}
        <div className="w-7 h-6 sm:w-8 sm:h-7 rounded-t-[10px] bg-[#FF6584] border-2 border-b-0 border-[#F43F5E] shadow-xs flex items-center justify-center pt-0.5">
          <div className="w-2.5 h-3.5 sm:w-3 sm:h-4 rounded-full bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]" />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 8x8 MATRIX KAWAII BLOSSOM BOARD (Calendar Notepad Style)             */}
      {/* ==================================================================== */}
      <div
        ref={containerRef}
        id="monadian-board-2d"
        className={`relative w-full h-full p-3 sm:p-4 bg-white rounded-[34px] sm:rounded-[38px] border-2 border-[#FFD8E2] shadow-[0_16px_40px_rgba(255,180,200,0.35)] flex items-center justify-center select-none z-10 transition-transform ${
          isShaking ? 'animate-[boardShock_350ms_ease-in-out]' : ''
        }`}
      >
        {/* Floating Arcade Line Clear Banner */}
        {clearBanner && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none select-none animate-[bannerPop_500ms_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
            <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF758F] via-[#FF4D6D] to-[#E61E4F] text-white shadow-[0_8px_30px_rgba(230,30,79,0.55),0_0_24px_rgba(255,215,0,0.7)] border-2 border-white flex flex-col items-center justify-center min-w-[170px] whitespace-nowrap">
              <div className="text-xs sm:text-sm font-comfortaa font-black tracking-wider uppercase drop-shadow-md flex items-center gap-1.5">
                <span>{clearBanner.text}</span>
              </div>
              {clearBanner.subtext && (
                <div className="text-[10px] font-mono font-bold text-amber-200 tracking-wide mt-0.5 drop-shadow-sm">
                  {clearBanner.subtext}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Laser Sweep Beams (Horizontal) */}
        {clearingRows.map((r) => (
          <div
            key={`h-laser-${r}`}
            className="absolute left-1 right-1 h-3 -translate-y-1/2 pointer-events-none z-30 animate-[laserSweepH_420ms_cubic-bezier(0.2,0.9,0.3,1)_forwards] flex items-center"
            style={{ top: `${(r + 0.5) * 12.5}%` }}
          >
            <div className="w-full h-2 rounded-full bg-gradient-to-r from-transparent via-[#FF4D6D] to-transparent shadow-[0_0_20px_#FF4D6D,0_0_35px_#FFD700]" />
            <div className="w-full h-0.5 rounded-full bg-white absolute inset-0 m-auto blur-[0.5px]" />
          </div>
        ))}

        {/* Laser Sweep Beams (Vertical) */}
        {clearingCols.map((c) => (
          <div
            key={`v-laser-${c}`}
            className="absolute top-1 bottom-1 w-3 -translate-x-1/2 pointer-events-none z-30 animate-[laserSweepV_420ms_cubic-bezier(0.2,0.9,0.3,1)_forwards] flex justify-center"
            style={{ left: `${(c + 0.5) * 12.5}%` }}
          >
            <div className="h-full w-2 rounded-full bg-gradient-to-b from-transparent via-[#38BDF8] to-transparent shadow-[0_0_20px_#38BDF8,0_0_35px_#FFD700]" />
            <div className="h-full w-0.5 rounded-full bg-white absolute inset-0 m-auto blur-[0.5px]" />
          </div>
        ))}

        {/* 8x8 Grid Container (Circular Pop-it Bubbles) */}
        <div className="grid grid-cols-8 grid-rows-8 gap-1.5 sm:gap-2 w-full h-full relative z-10">
          {Array.from({ length: 64 }, (_, idx) => {
            const row = Math.floor(idx / 8);
            const col = idx % 8;
            const isOccupied = isBitSet(board, idx);
            const isSabotage = isBitSet(sabotageMask, idx);
            const isClearing = clearingRows.includes(row) || clearingCols.includes(col);
            const isGhost = ghostMask !== null && isBitSet(ghostMask, idx);

            // Color variant
            const themeIndex = cellColors && cellColors[idx] !== null && cellColors[idx] !== undefined
              ? cellColors[idx]!
              : (row + col * 2) % CANDY_THEMES.length;
            const theme = CANDY_THEMES[themeIndex % CANDY_THEMES.length];

            // 1. Sabotage Bubble Block (Glitch Frost Crystal)
            if (isSabotage) {
              return (
                <div
                  key={idx}
                  className={`relative w-full h-full rounded-full bg-gradient-to-b from-sky-100 via-sky-300 to-slate-400 border border-white/80 shadow-[0_3px_8px_rgba(56,189,248,0.35)] flex items-center justify-center transition-transform ${
                    isClearing
                      ? 'animate-[blastShatter_420ms_cubic-bezier(0.2,0.8,0.2,1)_forwards] z-20 shadow-[0_0_24px_rgba(56,189,248,0.9)]'
                      : 'scale-100'
                  }`}
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/80 absolute top-1 right-1" />
                  <span className="text-[10px]">❄️</span>
                </div>
              );
            }

            // 2. Exploding Bubble Block (Line Clear Explosion)
            if (isClearing && isOccupied) {
              return (
                <div
                  key={idx}
                  className="relative w-full h-full rounded-full flex items-center justify-center z-20"
                >
                  <div
                    className={`absolute inset-0 rounded-full ${theme.bg} ${theme.glow} border-2 border-white animate-[blastShatter_420ms_cubic-bezier(0.2,0.8,0.2,1)_forwards] shadow-[0_0_26px_rgba(255,215,0,0.85)] flex items-center justify-center overflow-hidden`}
                  >
                    <div className="w-2 h-2 rounded-full bg-white absolute top-1 right-1 animate-ping" />
                  </div>
                  <span
                    className="absolute -top-1 -left-1 text-[12px] animate-[sparkleFloat_420ms_ease-out_forwards] pointer-events-none select-none z-30"
                    style={{ '--tw-tx': '-20px', '--tw-ty': '-20px' } as any}
                  >
                    🌸
                  </span>
                  <span
                    className="absolute -bottom-1 -right-1 text-[11px] animate-[sparkleFloat_420ms_ease-out_forwards] pointer-events-none select-none z-30"
                    style={{ '--tw-tx': '20px', '--tw-ty': '20px' } as any}
                  >
                    ✨
                  </span>
                </div>
              );
            }

            // 3. Active Placed Bubble (Shiny Spherical Candy Gem)
            if (isOccupied) {
              return (
                <div
                  key={idx}
                  className={`relative w-full h-full rounded-full ${theme.bg} ${theme.glow} border-b-2 ${theme.borderBottom} flex items-center justify-center transition-all duration-150 overflow-hidden scale-100`}
                >
                  {/* Glossy Reflection Glint Dot (Figma detail) */}
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${theme.glint} absolute top-1 right-1 shadow-xs`} />
                </div>
              );
            }

            // 4. Ghost Preview Indicator
            if (isGhost) {
              return (
                <div
                  key={idx}
                  className={`relative w-full h-full rounded-full transition-all duration-100 ${
                    isGhostValid
                      ? 'bg-mint/50 border-2 border-mint shadow-[0_0_12px_#2dd4bf] animate-pulse'
                      : 'bg-cherry/50 border-2 border-cherry shadow-[0_0_10px_#ff4d6d]'
                  }`}
                />
              );
            }

            // 5. Empty Pop-it Circular Socket
            return (
              <div
                key={idx}
                data-cell-index={idx}
                onClick={() => onCellClick?.(col, row)}
                className="relative w-full h-full rounded-full bg-[#FFF0F4] border border-[#FED7E2] shadow-[inset_0_2px_4px_rgba(255,182,193,0.3)] transition-colors cursor-pointer hover:bg-[#FFE6F0]"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

Board3D.displayName = 'Board3D';
