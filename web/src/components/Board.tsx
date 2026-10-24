import React from 'react';
import { isBitSet } from '../engine/bitwise';

interface BoardProps {
  board: bigint;
  sabotageMask: bigint;
  ghostMask: bigint | null;
  isGhostValid: boolean;
  clearingRows: number[];
  clearingCols: number[];
  onCellHover?: (x: number, y: number) => void;
  onCellClick?: (x: number, y: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  sabotageMask,
  ghostMask,
  isGhostValid,
  clearingRows,
  clearingCols,
  onCellHover,
  onCellClick,
}) => {
  const cells = [];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const bitIndex = y * 8 + x;
      const bitMask = 1n << BigInt(bitIndex);

      const isOccupied = isBitSet(board, bitIndex);
      const isSabotage = isBitSet(sabotageMask, bitIndex);
      const isGhost = ghostMask !== null && (ghostMask & bitMask) !== 0n;
      const isClearing = clearingRows.includes(y) || clearingCols.includes(x);

      let cellClass = "w-full h-full rounded transition-all duration-150 flex items-center justify-center ";

      if (isClearing) {
        cellClass += "bg-white shadow-[0_0_20px_#ffffff] scale-95 animate-ping ";
      } else if (isGhost) {
        if (isGhostValid) {
          cellClass += "bg-emerald-400/60 border border-emerald-300 shadow-[0_0_12px_#34d399] ";
        } else {
          cellClass += "bg-rose-500/60 border border-rose-400 shadow-[0_0_12px_#f43f5e] ";
        }
      } else if (isSabotage) {
        cellClass += "bg-zinc-700 border border-zinc-500 shadow-inner ";
      } else if (isOccupied) {
        cellClass += "bg-gradient-to-br from-monad-light to-monad-purple border border-monad-cyan/50 shadow-[0_0_10px_rgba(131,110,249,0.7)] ";
      } else {
        cellClass += "bg-monad-card/60 hover:bg-monad-card border border-white/5 ";
      }

      cells.push(
        <div
          key={`${x}-${y}`}
          className="aspect-square p-0.5"
          onMouseEnter={() => onCellHover?.(x, y)}
          onClick={() => onCellClick?.(x, y)}
        >
          <div className={cellClass}>
            {isSabotage && !isClearing && (
              <span className="text-[10px] text-zinc-400 font-bold">✕</span>
            )}
            {isOccupied && !isSabotage && !isClearing && (
              <div className="w-1.5 h-1.5 rounded-full bg-monad-cyan/70 shadow-[0_0_4px_#20e2d7]"></div>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="relative p-2 rounded-2xl bg-monad-dark/80 border-2 border-monad-purple/40 shadow-[0_0_30px_rgba(131,110,249,0.25)]">
      {/* Background Cyber Grid Accent */}
      <div className="grid grid-cols-8 gap-1 w-full max-w-[340px] mx-auto select-none">
        {cells}
      </div>
    </div>
  );
};
