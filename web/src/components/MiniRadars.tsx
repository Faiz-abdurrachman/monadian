import React from 'react';
import { Skull, Crosshair } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';

export interface Opponent {
  id: string;
  name: string;
  isAlive: boolean;
  boardFillPercent: number;
  sabotaged: boolean;
}

interface MiniRadarsProps {
  opponents: Opponent[];
  selectedTargetId: string;
  onSelectTarget: (id: string) => void;
}

export const MiniRadars: React.FC<MiniRadarsProps> = ({
  opponents,
  selectedTargetId,
  onSelectTarget,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-[390px] mx-auto overflow-x-auto py-1 px-1 scrollbar-none flex items-center gap-1.5 select-none font-quicksand">
      {opponents.map((opp, idx) => {
        const isSelected = selectedTargetId === opp.id;
        const displayName = opp.id.startsWith('bot-')
          ? `P${parseInt(opp.id.replace('bot-', '')) + 1}`
          : opp.name
          ? (opp.name.length > 4 ? opp.name.slice(0, 3) : opp.name)
          : `P${idx + 2}`;

        return (
          <button
            key={opp.id}
            data-opponent-id={opp.id}
            onClick={() => opp.isAlive && onSelectTarget(opp.id)}
            disabled={!opp.isAlive}
            title={
              !opp.isAlive
                ? `${displayName}: ${t.radars.eliminated}`
                : opp.sabotaged
                ? `${displayName}: ${t.radars.sabotaged}`
                : `${displayName}: ${opp.boardFillPercent}%`
            }
            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center relative cursor-pointer ${
              !opp.isAlive
                ? 'bg-zinc-100 border-zinc-200 opacity-30 cursor-not-allowed'
                : isSelected
                ? 'bg-[#FFF0F3] border-[#FF4D6D] shadow-[0_0_10px_rgba(255,77,109,0.4)] scale-110 z-10'
                : 'bg-white border-pink-200 hover:border-pink-300 active:scale-95 shadow-xs'
            }`}
          >
            {!opp.isAlive ? (
              <Skull className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <span
                className={`text-[9.5px] font-comfortaa font-bold ${
                  isSelected ? 'text-[#FF4D6D]' : 'text-[#2F121A]'
                }`}
              >
                {displayName}
              </span>
            )}

            {/* Target indicator */}
            {isSelected && opp.isAlive && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF4D6D] flex items-center justify-center shadow-xs">
                <Crosshair className="w-2 h-2 text-white animate-spin" />
              </span>
            )}

            {/* Sabotaged indicator */}
            {opp.sabotaged && opp.isAlive && (
              <span className="absolute -bottom-0.5 inset-x-1 h-1 rounded-full bg-cherry animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};
