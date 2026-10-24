import React from 'react';
import { PIECES } from '../engine/bitwise';
import { sounds } from '../engine/audio';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';
import { CANDY_THEMES, getPieceThemeIndex } from './Board3D';

interface HandTrayProps {
  pieces: number[];
  used: boolean[];
  canFit?: boolean[];
  selectedSlot: number | null;
  draggedSlot?: number | null;
  onSelectSlot: (slot: number) => void;
  onDragStart?: (slot: number, clientX: number, clientY: number) => void;
}

export const HandTray: React.FC<HandTrayProps> = ({
  pieces,
  used,
  canFit,
  selectedSlot,
  draggedSlot = null,
  onSelectSlot,
  onDragStart,
}) => {
  const { language } = useLanguage();

  return (
    // Section - Bottom Kawaii Block Spawner Dock (Cloud/Pill cards) (Figma #1182:810 PAKE INI)
    <div className="w-full max-w-[390px] mx-auto px-3 py-2 bg-white/95 backdrop-blur-xl rounded-[32px] border-2 border-pink-200 shadow-blossom-dock flex justify-between items-center gap-2 select-none relative z-20">
      {pieces.map((pieceId, slot) => {
        const piece = PIECES[pieceId];
        const isUsed = used[slot];
        const isBeingDragged = draggedSlot === slot;
        const isSelected = selectedSlot === slot;
        const cannotFit = !isUsed && canFit && canFit[slot] === false;
        const themeIdx = getPieceThemeIndex(pieceId, slot);
        const theme = CANDY_THEMES[themeIdx % CANDY_THEMES.length];

        // 1. Used Piece Slot (Clean Empty Recessed Socket like Block Blast)
        if (isUsed || !piece) {
          return (
            <div
              key={slot}
              className="flex-1 h-[78px] rounded-[26px] border-2 border-dashed border-pink-200/50 bg-[#FFF5F7]/40 flex flex-col items-center justify-center shadow-[inset_0_2px_4px_rgba(255,182,193,0.12)] pointer-events-none"
            >
              <div className="w-5 h-5 rounded-full border border-pink-200/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-300/40" />
              </div>
            </div>
          );
        }

        // 2. Currently Being Dragged Slot (Piece is LIFTED in the air onto user's finger!)
        if (isBeingDragged) {
          return (
            <div
              key={slot}
              className="flex-1 h-[78px] rounded-[26px] border-2 border-dashed border-[#FF758F]/60 bg-[#FFF0F3]/50 flex flex-col items-center justify-center shadow-[inset_0_2px_8px_rgba(255,117,143,0.22)] relative overflow-hidden transition-all pointer-events-none animate-pulse"
            >
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#FF758F]/60 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-ping" />
              </div>
              <span className="text-[8px] font-comfortaa font-bold text-[#FF4D6D] mt-1 uppercase tracking-wider">
                {language === 'id' ? 'Diangkat' : 'Lifted'}
              </span>
            </div>
          );
        }

        // Adaptive Cell Sizing: pieces with 4 or 5 blocks scale down dynamically so they NEVER overflow!
        const maxDim = Math.max(piece.width, piece.height);
        const cellSize = maxDim >= 5 ? 9 : maxDim === 4 ? 11 : maxDim === 3 ? 13 : 15;
        const cellRounded = maxDim >= 5 ? 'rounded-[3px]' : 'rounded-[5px]';
        const cellGap = maxDim >= 5 ? 'gap-[1.5px]' : 'gap-0.5';

        // 2. Interactive Piece Slot (Draggable Polyomino Jewel)
        return (
          <button
            key={slot}
            data-slot={slot}
            type="button"
            disabled={cannotFit}
            onPointerDown={(e) => {
              if (cannotFit) return;
              if (e.button === 0 || e.pointerType === 'touch') {
                e.currentTarget.setPointerCapture?.(e.pointerId);
                onDragStart?.(slot, e.clientX, e.clientY);
              }
            }}
            onClick={() => {
              if (cannotFit) return;
              sounds.playPickup();
              onSelectSlot(slot);
            }}
            className={`flex-1 h-[78px] rounded-[26px] transition-all duration-200 flex flex-col items-center justify-center p-1.5 relative touch-none select-none cursor-grab active:cursor-grabbing overflow-hidden ${
              cannotFit
                ? 'opacity-40 grayscale-[60%] border-2 border-dashed border-rose-300 bg-rose-50 cursor-not-allowed shadow-none'
                : isSelected
                ? 'bg-[#FFF5F7] border-2 border-cherry shadow-[0_0_16px_rgba(255,77,109,0.35)] scale-103 active:scale-95'
                : 'bg-[#FFF5F7] hover:bg-pink-50 border-2 border-sakura-border shadow-[inset_0_2px_4px_1px_rgba(255,182,193,0.22)] active:scale-95'
            }`}
          >
            {/* Warning badge if piece cannot fit anywhere */}
            {cannotFit && (
              <div className="absolute -top-1.5 bg-cherry text-white text-[7.5px] font-comfortaa font-bold px-1.5 py-0.5 rounded-full shadow-md tracking-wider flex items-center gap-0.5 z-10 animate-pulse border border-white">
                <AlertCircle className="w-2.5 h-2.5" />
                <span>{language === 'id' ? 'PENUH' : 'FULL'}</span>
              </div>
            )}

            {/* Render 3D Candy Gem Polyomino Layout with Dynamic Adaptive Size */}
            <div
              className={`grid ${cellGap} items-center justify-center m-auto transition-transform ${
                isSelected ? 'scale-105' : ''
              }`}
              style={{
                gridTemplateColumns: `repeat(${piece.width}, minmax(0, 1fr))`,
              }}
            >
              {piece.layout.map((row, rIdx) =>
                row.map((val, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                    className={`${cellRounded} relative transition-all duration-150 ${
                      val === 1
                        ? cannotFit
                          ? 'bg-zinc-400 border border-zinc-300'
                          : `${theme.bg} ${theme.glow} border-t border-l border-white/80 border-b-2 border-r ${theme.borderBottom} shadow-xs`
                        : 'opacity-0'
                    }`}
                  >
                    {/* Top-right gloss highlight glint */}
                    {val === 1 && !cannotFit && (
                      <div className="w-1 h-1 rounded-full bg-white/70 absolute top-0.5 right-0.5" />
                    )}
                  </div>
                ))
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
