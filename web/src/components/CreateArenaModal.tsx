import React, { useState, useEffect } from 'react';
import { useLanguage } from '../locales/LanguageContext';

export interface ArenaConfig {
  roomCode: string;
  roomName: string;
  hostName: string;
  poolType: 'buyIn' | 'sponsored';
  entryFeeMon: string;
  sponsorPotMon: string;
  prizeScheme: 'winnerTakesAll' | 'podium';
  maxPlayers: number;
}

interface CreateArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostName: string;
  onCreateArena: (config: ArenaConfig) => void;
}

const ENTRY_FEE_PRESETS = ['0.05', '0.1', '0.25', '0.5'];

export const CreateArenaModal: React.FC<CreateArenaModalProps> = ({
  isOpen,
  onClose,
  hostName,
  onCreateArena,
}) => {
  const { language } = useLanguage();

  const [playerCount, setPlayerCount] = useState<number>(16);
  const [entryFee, setEntryFee] = useState<string>('0.05');
  const [winnerScheme, setWinnerScheme] = useState<'1 WINNER' | '3 WINNER'>('1 WINNER');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMinus = () => {
    setPlayerCount((prev) => Math.max(2, prev - 1));
  };

  const handlePlus = () => {
    setPlayerCount((prev) => Math.min(24, prev + 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(100 + Math.random() * 900).toString();
    onCreateArena({
      roomCode: randomCode,
      roomName: 'Monadian Arena',
      hostName: hostName || 'Pemain_1',
      poolType: 'buyIn',
      entryFeeMon: entryFee,
      sponsorPotMon: '0',
      prizeScheme: winnerScheme === '1 WINNER' ? 'winnerTakesAll' : 'podium',
      maxPlayers: playerCount,
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] animate-fadeIn select-none font-quicksand"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[365px] sm:max-w-[385px] bg-white border-2 border-[#FFD8E2] rounded-[40px] sm:rounded-[44px] px-6 pt-8 pb-8 sm:px-7 sm:pt-9 sm:pb-9 shadow-[0_22px_65px_rgba(255,160,185,0.45)] flex flex-col items-center text-center text-[#241022]"
      >
        {/* Header Title & Subtitle */}
        <h2 className="font-comfortaa font-bold text-[26px] sm:text-[28px] text-[#241022] tracking-tight uppercase leading-none">
          {language === 'id' ? 'CREATE AN ARENA' : 'CREATE AN ARENA'}
        </h2>
        <p className="font-quicksand font-medium text-[15px] sm:text-[16px] text-[#241022] mt-2 mb-6">
          {language === 'id' ? 'Set Player Count & Ticket Price' : 'Set Player Count & Ticket Price'}
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          {/* SECTION 1: PLAYER COUNT STEPPER */}
          <div className="w-full bg-[#FFEBF1] border border-[#FCD2DF] rounded-[28px] p-3.5 sm:p-4">
            <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-comfortaa font-bold uppercase tracking-wider text-[#795B6B] px-1">
              <span>{language === 'id' ? 'PLAYER COUNT' : 'PLAYER COUNT'}</span>
              <span>MAX 24</span>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2.5 w-full">
              {/* Minus Button */}
              <button
                type="button"
                onClick={handleMinus}
                className="w-14 h-[52px] rounded-[20px] bg-white text-[#241022] font-black text-2xl flex items-center justify-center shadow-xs cursor-pointer hover:bg-pink-50/50 active:scale-95 transition-all select-none"
              >
                −
              </button>

              {/* Number Display */}
              <div className="flex-1 h-[52px] rounded-[20px] bg-white text-[#241022] font-comfortaa font-bold text-[28px] flex items-center justify-center shadow-xs select-none">
                {playerCount}
              </div>

              {/* Plus Button */}
              <button
                type="button"
                onClick={handlePlus}
                className="w-14 h-[52px] rounded-[20px] bg-white text-[#241022] font-black text-2xl flex items-center justify-center shadow-xs cursor-pointer hover:bg-pink-50/50 active:scale-95 transition-all select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* SECTION 2: ENTRY FEE (MON) */}
          <div className="w-full text-left mt-5">
            <span className="text-[11px] sm:text-xs font-comfortaa font-bold uppercase tracking-wider text-[#795B6B] block mb-2 px-1">
              {language === 'id' ? 'ENTRY FEE (MON)' : 'ENTRY FEE (MON)'}
            </span>

            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full">
              {ENTRY_FEE_PRESETS.map((fee) => {
                const isSelected = entryFee === fee;
                return (
                  <button
                    key={fee}
                    type="button"
                    onClick={() => setEntryFee(fee)}
                    className={`h-[48px] rounded-[20px] font-comfortaa font-bold text-sm sm:text-base flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF5C7A] text-white shadow-xs'
                        : 'bg-white border border-[#FCD2DF] text-[#241022] hover:bg-pink-50/50'
                    }`}
                  >
                    {fee}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: WINNER SCHEME */}
          <div className="w-full text-left mt-5">
            <span className="text-[11px] sm:text-xs font-comfortaa font-bold uppercase tracking-wider text-[#795B6B] block mb-2 px-1">
              {language === 'id' ? 'WINNER SCHEME' : 'WINNER SCHEME'}
            </span>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
              {(['1 WINNER', '3 WINNER'] as const).map((scheme) => {
                const isSelected = winnerScheme === scheme;
                return (
                  <button
                    key={scheme}
                    type="button"
                    onClick={() => setWinnerScheme(scheme)}
                    className={`h-[54px] rounded-[22px] font-comfortaa font-bold text-sm sm:text-base tracking-wide flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF5C7A] text-white shadow-xs'
                        : 'bg-white border border-[#FCD2DF] text-[#241022] hover:bg-pink-50/50'
                    }`}
                  >
                    {scheme}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRIMARY ACTION BUTTON: MAKE ARENA */}
          <div className="w-full mt-7">
            <button
              type="submit"
              className="w-full h-[62px] rounded-[24px] bg-[#FF5C7A] text-white border-b-[6px] border-[#D81B60] shadow-[0_12px_28px_rgba(255,92,122,0.38)] hover:brightness-105 active:translate-y-1 active:border-b-[2px] transition-all flex items-center justify-center cursor-pointer font-comfortaa font-black text-xl sm:text-[22px] tracking-wider uppercase"
            >
              {language === 'id' ? 'MAKE ARENA' : 'MAKE ARENA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
