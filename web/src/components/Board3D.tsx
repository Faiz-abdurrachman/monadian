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
}

// 6 Palet Warna Permen Block Blast Mochi Physical System (Figma 1182:885 PAKE INI)
export const CANDY_THEMES = [
  // 0: Sky Candy Blue (Line 2/3, Blue Gem)
  {
    name: 'cyan',
    bg: 'bg-gradient-to-b from-[#BAE6FD] via-[#7DD3FC] to-[#38BDF8]',
    borderTop: 'border-t-white/90 border-l-white/70',
    borderBottom: 'border-b-[#0284C7] border-r-[#0284C7]',
    glow: 'shadow-[0_4px_10px_rgba(56,189,248,0.4)]',
    capBorder: 'border-t-white/80 border-l-white/80',
    glint: 'bg-white/80',
  },
  // 1: Monad Lavender Violet (Purple / Corner Gem)
  {
    name: 'purple',
    bg: 'bg-gradient-to-b from-[#E9D5FF] via-[#C084FC] to-[#A855F7]',
    borderTop: 'border-t-white/90 border-l-white/70',
    borderBottom: 'border-b-[#7E22CE] border-r-[#7E22CE]',
    glow: 'shadow-[0_4px_10px_rgba(168,85,247,0.4)]',
    capBorder: 'border-t-white/80 border-l-white/80',
    glint: 'bg-white/80',
  },
  // 2: Sunset Peach Orange (Square 3x3 Gem)
  {
    name: 'orange',
    bg: 'bg-gradient-to-b from-[#FED7AA] via-[#FB923C] to-[#F97316]',
    borderTop: 'border-t-white/90 border-l-white/70',
    borderBottom: 'border-b-[#C2410C] border-r-[#C2410C]',
    glow: 'shadow-[0_4px_10px_rgba(249,115,22,0.45)]',
    capBorder: 'border-t-white/80 border-l-white/80',
    glint: 'bg-white/80',
  },
  // 3: Sakura Blossom Cherry Pink (Red / Pink Gem)
  {
    name: 'rose',
    bg: 'bg-gradient-to-b from-[#FBCFE8] via-[#F472B6] to-[#FF4D6D]',
    borderTop: 'border-t-white/90 border-l-white/70',
    borderBottom: 'border-b-[#C92A47] border-r-[#C92A47]',
    glow: 'shadow-[0_4px_10px_rgba(255,77,109,0.45)]',
    capBorder: 'border-t-white/80 border-l-white/80',
    glint: 'bg-white/80',
  },
  // 4: Pastel Mint Green (Emerald / Square 2x2 Gem)
  {
    name: 'emerald',
    bg: 'bg-gradient-to-b from-[#99F6E4] via-[#6EE7B7] to-[#2DD4BF]',
    borderTop: 'border-t-white/90 border-l-white/70',
    borderBottom: 'border-b-[#0F766E] border-r-[#0F766E]',
    glow: 'shadow-[0_4px_10px_rgba(45,212,191,0.4)]',
    capBorder: 'border-t-white/80 border-l-white/80',
    glint: 'bg-white/80',
  },
  // 5: Lemon Cream Honey Yellow (Sunshine Amber / Dot 1x1 Gem)
  {
    name: 'gold',
    bg: 'bg-gradient-to-b from-[#FEF08A] via-[#FDE047] to-[#F59E0B]',
    borderTop: 'border-t-white/90 border-l-white/70',
    borderBottom: 'border-b-[#D97706] border-r-[#D97706]',
    glow: 'shadow-[0_4px_10px_rgba(245,158,11,0.4)]',
    capBorder: 'border-t-white/80 border-l-white/80',
    glint: 'bg-white/80',
  },
];

export const getPieceThemeIndex = (pieceId: number, slotIndex?: number): number => {
  if (pieceId === 10) {
    // Square 3x3: slot 0 -> orange (2), slot 1 -> rose (3), slot 2 -> gold (5)
    if (slotIndex === 1) return 3;
    if (slotIndex === 2) return 5;
    return 2;
  }
  if (pieceId === 9) return 4; // Square 2x2: emerald mint green
  if (pieceId === 0) return 5; // Dot: gold
  if (pieceId >= 1 && pieceId <= 4) return 0; // Line 2, 3: sky candy blue
  if (pieceId >= 5 && pieceId <= 8) return 1; // Line 4, 5: monad purple
  if (pieceId >= 11 && pieceId <= 14) return 1; // Corner 2x2: monad purple
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
      {/* DECORATIVE BUNNY EARS ON TOP OF BOARD (Figma #1182:885 PAKE INI)     */}
      {/* ==================================================================== */}
      <div className="absolute -top-5 sm:-top-6 left-6 right-6 sm:left-8 sm:right-8 flex items-center justify-between pointer-events-none z-0">
        {/* Left Bunny Ear */}
        <div className="w-7 h-8 sm:w-8 sm:h-10 rounded-t-full bg-gradient-to-t from-[#FCE7F3] via-pink-100 to-white border-2 border-b-0 border-[#FBCFE8] shadow-sm flex items-center justify-center p-0.5 sm:p-1">
          <div className="w-3 h-5 sm:w-3.5 sm:h-6 rounded-t-full bg-[#FF758F]/60" />
        </div>
        {/* Right Bunny Ear */}
        <div className="w-7 h-8 sm:w-8 sm:h-10 rounded-t-full bg-gradient-to-t from-[#FCE7F3] via-pink-100 to-white border-2 border-b-0 border-[#FBCFE8] shadow-sm flex items-center justify-center p-0.5 sm:p-1">
          <div className="w-3 h-5 sm:w-3.5 sm:h-6 rounded-t-full bg-[#FF758F]/60" />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 8x8 MATRIX KAWAII BLOSSOM BOARD (Figma #1178:690 PAKE INI)           */}
      {/* ==================================================================== */}
      <div
        ref={containerRef}
        id="blitzgrid-board-2d"
        className={`relative w-full h-full p-2 sm:p-3 bg-[#FFF8FA] rounded-[28px] sm:rounded-[36px] border-4 border-pink-200/90 shadow-[0_10px_35px_rgba(255,175,190,0.35)] flex items-center justify-center pointer-events-none select-none z-10 transition-transform ${
          isShaking ? 'animate-[boardShock_350ms_ease-in-out]' : ''
        }`}
      >
        {/* Ambient Inset Glow Overlay */}
        <div className="absolute inset-1 rounded-[28px] sm:rounded-[32px] shadow-[inset_0_3px_6px_rgba(255,255,255,0.95)] pointer-events-none" />

        {/* Corner Sakura Accents (Subtle Kawaii Floral Motifs) */}
        <span className="absolute top-2 left-2.5 text-[10px] text-pink-300/60 select-none pointer-events-none">🌸</span>
        <span className="absolute top-2 right-2.5 text-[10px] text-pink-300/60 select-none pointer-events-none">🌸</span>
        <span className="absolute bottom-2 left-2.5 text-[10px] text-pink-300/60 select-none pointer-events-none">🌸</span>
        <span className="absolute bottom-2 right-2.5 text-[10px] text-pink-300/60 select-none pointer-events-none">🌸</span>

        {/* Floating Arcade Line Clear Banner */}
        {clearBanner && (
          <div className="absolute top-1/2 left-1/2 z-40 pointer-events-none select-none animate-[bannerPop_500ms_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
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

        {/* 8x8 Grid Container (Figma #1178:691) */}
        <div className="grid grid-cols-8 grid-rows-8 gap-1 sm:gap-1.5 w-full h-full relative z-10">
          {Array.from({ length: 64 }, (_, idx) => {
            const row = Math.floor(idx / 8);
            const col = idx % 8;
            const isOccupied = isBitSet(board, idx);
            const isSabotage = isBitSet(sabotageMask, idx);
            const isClearing = clearingRows.includes(row) || clearingCols.includes(col);
            const isGhost = ghostMask !== null && isBitSet(ghostMask, idx);

            // Pilih varian warna balok permen (1 Bidak = 1 Warna Solid Bersih)
            const themeIndex = cellColors && cellColors[idx] !== null && cellColors[idx] !== undefined
              ? cellColors[idx]!
              : (row + col * 2) % CANDY_THEMES.length;
            const theme = CANDY_THEMES[themeIndex % CANDY_THEMES.length];

            // 1. Balok Sabotase (Batu Glitch Frost / Sakura Ice Crystal)
            if (isSabotage) {
              return (
                <div
                  key={idx}
                  className={`relative w-full h-full rounded-[7px] sm:rounded-[11px] bg-gradient-to-b from-sky-100 via-sky-300 to-slate-400 border-t-2 border-l-2 border-white/90 border-b-[3px] border-r-2 border-slate-600 shadow-[0_4px_10px_rgba(56,189,248,0.35)] flex items-center justify-center transition-transform ${
                    isClearing
                      ? 'animate-[blastShatter_420ms_cubic-bezier(0.2,0.8,0.2,1)_forwards] z-20 shadow-[0_0_24px_rgba(56,189,248,0.9)]'
                      : 'scale-100'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white/70 absolute top-1 right-1" />
                  <span className="text-[10px]">❄️</span>
                  {isClearing && (
                    <>
                      <span className="absolute -top-1 -left-1 text-[11px] animate-[sparkleFloat_420ms_ease-out_forwards] pointer-events-none select-none z-30" style={{ '--tw-tx': '-20px', '--tw-ty': '-20px' } as any}>❄️</span>
                      <span className="absolute -bottom-1 -right-1 text-[11px] animate-[sparkleFloat_420ms_ease-out_forwards] pointer-events-none select-none z-30" style={{ '--tw-tx': '20px', '--tw-ty': '20px' } as any}>✨</span>
                    </>
                  )}
                </div>
              );
            }

            // 2. Balok Permen Meledak Spektakuler Saat Garis Bersih (Wah Explosion!)
            if (isClearing && isOccupied) {
              return (
                <div
                  key={idx}
                  className="relative w-full h-full rounded-[7px] sm:rounded-[11px] flex items-center justify-center z-20"
                >
                  {/* Shattering Jewel Core */}
                  <div
                    className={`absolute inset-0 rounded-[7px] sm:rounded-[11px] ${theme.bg} ${theme.glow} border-2 border-white animate-[blastShatter_420ms_cubic-bezier(0.2,0.8,0.2,1)_forwards] shadow-[0_0_26px_rgba(255,215,0,0.85)] flex items-center justify-center overflow-hidden`}
                  >
                    <div className="w-2 h-2 rounded-full bg-white absolute top-1 right-1 animate-ping" />
                    <div className="w-3/5 h-2/5 rounded-[4px] bg-white/60 mx-auto" />
                  </div>

                  {/* Explosive Sakura Petals & Glint Particles */}
                  <span
                    className="absolute -top-1 -left-1 text-[12px] animate-[sparkleFloat_420ms_ease-out_forwards] pointer-events-none select-none z-30"
                    style={{ '--tw-tx': '-22px', '--tw-ty': '-22px' } as any}
                  >
                    🌸
                  </span>
                  <span
                    className="absolute -bottom-1 -right-1 text-[11px] animate-[sparkleFloat_420ms_ease-out_forwards] pointer-events-none select-none z-30"
                    style={{ '--tw-tx': '22px', '--tw-ty': '22px' } as any}
                  >
                    ✨
                  </span>
                  <span
                    className="absolute -top-1 -right-1 text-[10px] animate-[sparkleFloat_420ms_ease-out_forwards] pointer-events-none select-none z-30"
                    style={{ '--tw-tx': '18px', '--tw-ty': '-18px' } as any}
                  >
                    💥
                  </span>
                </div>
              );
            }

            // 3. Balok Permen Aktif Normal (Juicy 3D Beveled Candy Gem Block)
            if (isOccupied) {
              return (
                <div
                  key={idx}
                  className={`relative w-full h-full rounded-[7px] sm:rounded-[11px] ${theme.bg} ${theme.glow} border-t-2 border-l-2 ${theme.borderTop} border-b-[3px] border-r-2 ${theme.borderBottom} flex items-center justify-center transition-all duration-150 overflow-hidden scale-100`}
                >
                  {/* Glossy Candy Glint Reflection Dot (Figma detail) */}
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${theme.glint} absolute top-1 right-1 shadow-xs`} />

                  {/* Glossy Top Bevel Cap */}
                  <div
                    className={`w-3/5 h-2/5 rounded-[4px] bg-white/40 backdrop-blur-[0.5px] border-t border-l ${theme.capBorder} mx-auto mt-0.5`}
                  />
                </div>
              );
            }

            // 4. Ghost Preview (Siluet Balok Saat Melayang di Atas Papan)
            if (isGhost) {
              return (
                <div
                  key={idx}
                  className={`relative w-full h-full rounded-[7px] sm:rounded-[11px] transition-all duration-100 ${
                    isGhostValid
                      ? 'bg-mint/45 border-2 border-mint shadow-[0_0_12px_#2dd4bf] animate-pulse'
                      : 'bg-cherry/45 border-2 border-cherry shadow-[0_0_10px_#ff4d6d]'
                  }`}
                />
              );
            }

            // 5. Soket Kosong (Recessed Soft Pink/Cream Pastel Socket)
            return (
              <div
                key={idx}
                className="relative w-full h-full rounded-[7px] sm:rounded-[11px] bg-[#FFF5F7] border border-pink-200/60 shadow-[inset_0_2px_4px_rgba(255,182,193,0.22)] transition-colors"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

Board3D.displayName = 'Board3D';
