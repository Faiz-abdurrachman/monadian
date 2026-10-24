import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Share2 } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';

interface GameOverModalProps {
  isWinner: boolean;
  rank: number;
  score: number;
  prizeMon: number;
  maxCombo?: number;
  sabotageCount?: number;
  playerName?: string;
  maxPlayers?: number;
  onRestart: () => void;
  onBackToLobby?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isWinner,
  rank,
  score,
  prizeMon,
  maxCombo = 1,
  sabotageCount = 0,
  playerName,
  maxPlayers = 16,
  onRestart,
  onBackToLobby,
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    if (isWinner) {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#FF5C7A', '#FCD34D', '#2DD4BF', '#38BDF8', '#C084FC'],
      });
    }
  }, [isWinner]);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Saya baru saja mencetak skor ${score.toLocaleString()} di Monadian - 100% On-Chain Puzzle Royale di Monad! ⚡🌸 #Monad #Monadian`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 animate-fadeIn font-quicksand select-none">
      <div className="relative w-full max-w-[340px] sm:max-w-[365px] flex flex-col items-center">
        {/* ================================================================ */}
        {/* TOP BUNNY EARS (Tucked cleanly behind the card)                  */}
        {/* ================================================================ */}
        <div className="absolute -top-6 left-0 right-0 flex items-center justify-center gap-5 pointer-events-none z-0">
          <div className="w-7 h-10 rounded-t-full bg-white border-2 border-[#FF758F] shadow-xs flex items-center justify-center pt-2">
            <div className="w-3.5 h-6 rounded-t-full bg-[#FF8DA1]/50" />
          </div>
          <div className="w-7 h-10 rounded-t-full bg-white border-2 border-[#FF758F] shadow-xs flex items-center justify-center pt-2">
            <div className="w-3.5 h-6 rounded-t-full bg-[#FF8DA1]/50" />
          </div>
        </div>

        {/* Main Card */}
        <div className="relative z-10 w-full bg-white border-2 border-[#FFD8E3] rounded-[38px] sm:rounded-[42px] pt-8 pb-7 px-6 sm:pt-9 sm:pb-8 sm:px-7 shadow-[0_22px_65px_rgba(255,160,185,0.45)] flex flex-col items-center text-center text-[#241022]">
          {/* Header Title */}
          <h2 className="font-comfortaa font-bold text-[24px] sm:text-[27px] text-[#241022] tracking-tight uppercase leading-none mb-1">
          {isWinner
            ? (language === 'id' ? 'VICTORY ROYALE!' : 'VICTORY ROYALE!')
            : (language === 'id' ? 'GAME OVER' : 'GAME OVER')}
        </h2>
        <p className="text-xs font-bold text-[#795B6B] mb-3.5">
          {isWinner
            ? '🏆 Juara 1 Turnamen on-chain Monad!'
            : `${playerName || 'Pemain'} • Peringkat #${rank} / ${maxPlayers}`}
        </p>

        {/* Stats Pill Row (SCORE & PRIZE / BEST) */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full mb-3.5">
          {/* Current Score Pill */}
          <div className="flex-1 bg-[#FFEBF1] border border-[#FCD2DF] rounded-full py-1.5 px-3 flex items-center justify-center gap-1.5 shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-comfortaa font-bold uppercase tracking-wider text-[#795B6B]">
              SCORE
            </span>
            <span className="font-comfortaa font-extrabold text-sm sm:text-base text-[#FF3366] tracking-tight">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Prize / Escrow Pill */}
          <div className="flex-1 bg-[#FEF9C3] border border-[#FDE047] rounded-full py-1.5 px-3 flex items-center justify-center gap-1.5 shadow-xs">
            <span className="text-[10px] sm:text-[11px] font-comfortaa font-bold uppercase tracking-wider text-[#B45309] flex items-center gap-0.5">
              <span>🥕</span>
              <span>HADIAH</span>
            </span>
            <span className="font-comfortaa font-extrabold text-xs sm:text-sm text-[#241022] tracking-tight truncate">
              {prizeMon > 0 ? `+${prizeMon.toFixed(2)} MON` : '0 MON'}
            </span>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-2 mb-3 text-left">
          <div className="p-2.5 bg-[#FFF5F8] rounded-[18px] border border-[#FEDCE6]">
            <span className="text-[10px] font-comfortaa font-bold text-[#795B6B] block">
              💖 Kombo Terbaik
            </span>
            <span className="font-comfortaa font-extrabold text-sm text-[#241022] mt-0.5 block">
              {maxCombo}x Combo
            </span>
          </div>
          <div className="p-2.5 bg-[#FFF5F8] rounded-[18px] border border-[#FEDCE6]">
            <span className="text-[10px] font-comfortaa font-bold text-[#795B6B] block">
              ⚡ Sabotase Keluar
            </span>
            <span className="font-comfortaa font-extrabold text-sm text-[#241022] mt-0.5 block">
              {sabotageCount} Serangan
            </span>
          </div>
        </div>

        {/* Monad Finality Badge */}
        <div className="w-full py-1 px-3 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-between text-[10px] font-comfortaa font-bold text-[#795B6B] mb-4">
          <span>⚡ Monad Sub-Second Finality</span>
          <span className="text-[#FF4D6D]">0.4s BLOCK</span>
        </div>

        {/* Button 1: RETRY RUN (Juicy 3D Button) */}
        <button
          type="button"
          onClick={onRestart}
          className="w-full h-14 sm:h-[58px] rounded-[22px] sm:rounded-[24px] bg-[#FF5C7A] text-white border-b-[6px] border-[#D81B60] shadow-[0_12px_28px_rgba(255,92,122,0.38)] hover:brightness-105 active:translate-y-1 active:border-b-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer font-comfortaa font-black text-lg sm:text-xl tracking-wider uppercase mb-3 select-none"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>{language === 'id' ? 'RETRY RUN' : 'RETRY RUN'}</span>
        </button>

        {/* Button 2: HOP TO MENU (Clean Text Link) */}
        {onBackToLobby && (
          <button
            type="button"
            onClick={onBackToLobby}
            className="text-[#4A2E3B] hover:text-[#FF4D6D] font-comfortaa font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none py-1 mb-1"
          >
            <Home className="w-4 h-4 stroke-[2.2]" />
            <span>{language === 'id' ? 'HOP TO MENU' : 'HOP TO MENU'}</span>
          </button>
        )}

        {/* Share to X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-comfortaa font-bold text-[#FF5C7A] hover:underline flex items-center gap-1 mt-1 cursor-pointer"
        >
          <Share2 className="w-3 h-3 text-[#FF5C7A]" />
          <span>Bagikan ke X (Twitter)</span>
        </a>
      </div>
    </div>
  </div>
  );
};
