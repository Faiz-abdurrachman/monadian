import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';

interface GamePauseModalProps {
  isOpen: boolean;
  score: number;
  bestScore?: number;
  isMuted?: boolean;
  onResume: () => void;
  onRestart: () => void;
  onBackToLobby: () => void;
  onToggleMute?: () => void;
}

export const GamePauseModal: React.FC<GamePauseModalProps> = ({
  isOpen,
  score,
  bestScore = 14850,
  onResume,
  onRestart,
  onBackToLobby,
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      onClick={onResume}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-[2px] animate-fadeIn select-none font-quicksand"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[340px] sm:max-w-[365px] bg-white border-2 border-[#FFD8E3] rounded-[38px] sm:rounded-[42px] pt-8 pb-7 px-6 sm:pt-9 sm:pb-8 sm:px-7 shadow-[0_22px_65px_rgba(255,160,185,0.45)] flex flex-col items-center text-center text-[#241022]"
      >
        {/* ================================================================ */}
        {/* TOP BUNNY EARS (Figma Exact: uploaded_media_1792829296626.png)     */}
        {/* ================================================================ */}
        <div className="absolute -top-6 left-0 right-0 flex items-center justify-center gap-5 pointer-events-none z-0">
          {/* Left Bunny Ear */}
          <div className="w-7 h-10 rounded-t-full bg-white border-2 border-b-0 border-[#FF758F] shadow-xs flex items-center justify-center pt-2">
            <div className="w-3.5 h-6 rounded-t-full bg-[#FF8DA1]/50" />
          </div>
          {/* Right Bunny Ear */}
          <div className="w-7 h-10 rounded-t-full bg-white border-2 border-b-0 border-[#FF758F] shadow-xs flex items-center justify-center pt-2">
            <div className="w-3.5 h-6 rounded-t-full bg-[#FF8DA1]/50" />
          </div>
        </div>

        {/* Header Title */}
        <h2 className="font-comfortaa font-bold text-[24px] sm:text-[27px] text-[#241022] tracking-tight uppercase leading-none mb-3.5">
          {language === 'id' ? 'GAME PAUSED' : 'GAME PAUSED'}
        </h2>

        {/* Stats Pill Row (SCORE & BEST) */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full">
          {/* Current Score Pill */}
          <div className="bg-[#FFEBF1] border border-[#FCD2DF] rounded-full py-1.5 px-3.5 flex items-center gap-1.5 shadow-xs">
            <span className="text-[11px] font-comfortaa font-bold uppercase tracking-wider text-[#795B6B]">
              SCORE
            </span>
            <span className="font-comfortaa font-extrabold text-sm sm:text-base text-[#FF3366] tracking-tight">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Best Score Trophy Pill */}
          <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-full py-1.5 px-3.5 flex items-center gap-1.5 shadow-xs">
            <span className="text-[11px] font-comfortaa font-bold uppercase tracking-wider text-[#B45309] flex items-center gap-1">
              <span>🏆</span>
              <span>BEST</span>
            </span>
            <span className="font-comfortaa font-extrabold text-sm sm:text-base text-[#241022] tracking-tight">
              {Math.max(score, bestScore).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Button 1: RESUME (Juicy Coral-Pink 3D Button) */}
        <button
          type="button"
          onClick={onResume}
          className="w-full h-14 sm:h-[58px] rounded-[22px] sm:rounded-[24px] bg-[#FF5C7A] text-white border-b-[6px] border-[#D81B60] shadow-[0_12px_28px_rgba(255,92,122,0.38)] hover:brightness-105 active:translate-y-1 active:border-b-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer font-comfortaa font-black text-lg sm:text-xl tracking-wider uppercase mt-5 mb-3 select-none"
        >
          <Play className="w-5 h-5 fill-white ml-0.5" />
          <span>{language === 'id' ? 'RESUME' : 'RESUME'}</span>
        </button>

        {/* Button 2: RESTART RUN (Soft Pastel Pink Pill Button) */}
        <button
          type="button"
          onClick={onRestart}
          className="w-full h-13 sm:h-14 rounded-[22px] sm:rounded-[24px] bg-[#FFF0F4] hover:bg-pink-100/60 border border-[#FCD2DF] text-[#A12D4C] shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer font-comfortaa font-bold text-sm sm:text-base tracking-wider uppercase mb-4 select-none"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>{language === 'id' ? 'RESTART RUN' : 'RESTART RUN'}</span>
        </button>

        {/* Button 3: HOP TO MENU (Clean Text Link with Home Icon) */}
        <button
          type="button"
          onClick={onBackToLobby}
          className="text-[#4A2E3B] hover:text-[#FF4D6D] font-comfortaa font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none py-1"
        >
          <Home className="w-4 h-4 stroke-[2.2]" />
          <span>{language === 'id' ? 'HOP TO MENU' : 'HOP TO MENU'}</span>
        </button>
      </div>
    </div>
  );
};
