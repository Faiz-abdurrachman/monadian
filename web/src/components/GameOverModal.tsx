import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Share2, Home } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';
import { MonaBunnyMascot } from './MonaBunnyMascot';

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
  const { t } = useLanguage();

  useEffect(() => {
    if (isWinner) {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#FF4D6D', '#FCD34D', '#2DD4BF', '#38BDF8', '#C084FC'],
      });
    }
  }, [isWinner]);

  const tweetText = encodeURIComponent(
    t.gameOver.shareText(score.toLocaleString(), rank, prizeMon > 0 ? `+${prizeMon.toFixed(2)} MON` : '0 MON')
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    // Foreground Game Over Modal Viewport (Kawaii Pink Bunny Blossom Theme) (Figma #1169:327)
    <div className="fixed inset-0 z-50 bg-[#2F121A]/50 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn font-quicksand select-none">
      <div className="relative w-full max-w-sm rounded-[32px] p-5 bg-white border border-pink-200 shadow-2xl flex flex-col items-center text-center text-[#2F121A]">

        {/* Kawaii Mascot Expression */}
        <MonaBunnyMascot mood={isWinner ? 'victory' : 'sad'} size={76} className="mb-2" />

        {/* Title & Subtitle */}
        <h2 className="font-comfortaa font-bold text-xl tracking-tight text-[#2F121A] mb-0.5">
          {isWinner ? t.gameOver.victoryTitle : t.blossom.noMoreMoves}
        </h2>
        <p className="text-xs font-bold text-[#574144] mb-3.5 flex items-center justify-center gap-1.5 flex-wrap">
          {playerName && (
            <span className="text-[#FF4D6D] font-comfortaa font-bold px-2 py-0.5 rounded-full bg-pink-100 border border-pink-200">
              🌸 {playerName}
            </span>
          )}
          <span>
            {isWinner
              ? t.gameOver.victorySubtitle
              : `${t.radars.playerPrefix} #${rank} / ${maxPlayers}`}
          </span>
        </p>

        {/* Kawaii Stats Bento Grid (Pastel Pink & Soft Peach Pills) (Figma #1169:327) */}
        <div className="w-full grid grid-cols-2 gap-2 mb-3.5 text-left">
          {/* Stat 1: Final Score */}
          <div className="p-2.5 bg-white rounded-2xl border border-pink-200 shadow-xs">
            <span className="text-[9px] font-comfortaa font-bold text-[#574144] block flex items-center gap-1">
              🌸 {t.gameOver.finalScore}
            </span>
            <span className="font-comfortaa font-bold text-base text-[#2F121A] mt-0.5 block">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Stat 2: Prize MON / Escrow */}
          <div className="p-2.5 bg-pink-50 rounded-2xl border border-pink-200 shadow-xs">
            <span className="text-[9px] font-comfortaa font-bold text-[#FF4D6D] block flex items-center gap-1">
              🥕 {t.gameOver.escrowPrize}
            </span>
            <span className="font-comfortaa font-bold text-base text-[#FF4D6D] mt-0.5 block">
              {prizeMon > 0 ? `+${prizeMon.toFixed(2)} MON` : '0 MON'}
            </span>
          </div>

          {/* Stat 3: Max Streak / Combo */}
          <div className="p-2.5 bg-white rounded-2xl border border-pink-200 shadow-xs">
            <span className="text-[9px] font-comfortaa font-bold text-[#574144] block flex items-center gap-1">
              💖 {t.gameOver.maxCombo}
            </span>
            <span className="font-comfortaa font-bold text-sm text-[#2F121A] mt-0.5 block">
              {maxCombo}x Combo
            </span>
          </div>

          {/* Stat 4: Sabotages Fired */}
          <div className="p-2.5 bg-white rounded-2xl border border-pink-200 shadow-xs">
            <span className="text-[9px] font-comfortaa font-bold text-[#574144] block flex items-center gap-1">
              🐾 {t.gameOver.sabotagesFired}
            </span>
            <span className="font-comfortaa font-bold text-sm text-[#2F121A] mt-0.5 block">
              {sabotageCount} Fired
            </span>
          </div>
        </div>

        {/* Monad Gas Efficiency Stamp */}
        <div className="w-full py-1.5 px-3 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-between text-[9px] font-comfortaa font-bold text-[#574144] mb-3.5">
          <span>⚡ {t.gameOver.gasMetricLabel}</span>
          <span className="text-[#FF4D6D]">0.4s FINALITY</span>
        </div>

        {/* Action Buttons: KEMBALI KE LOBI vs MAIN LAGI (Figma 1190:1928 Tactile Mochi Buttons) */}
        <div className="w-full flex items-center gap-2.5">
          {onBackToLobby && (
            <button
              onClick={onBackToLobby}
              className="flex-1 py-3 px-3 rounded-full bg-white border-2 border-[#FCE7F3] shadow-[0_3px_0_0_#FDB2C5] hover:bg-pink-50 active:translate-y-1 active:shadow-none text-[#A8334E] font-comfortaa font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#FF4D6D]" />
              <span>{t.blossom.backToLobby}</span>
            </button>
          )}

          <button
            onClick={onRestart}
            className="flex-1 py-3 px-3 rounded-full bg-gradient-to-b from-[#FF758F] via-[#FA436C] to-[#E61E4F] text-white shadow-[0_4px_0_0_#A81B3F,0_10px_20px_rgba(230,30,79,0.35)] hover:brightness-105 active:translate-y-1 active:shadow-none font-comfortaa font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-white" />
            <span>{t.blossom.playAgain}</span>
          </button>
        </div>

        {/* Share Score to X / Community */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-[9.5px] font-comfortaa font-bold text-[#FF4D6D] hover:underline flex items-center gap-1"
        >
          <Share2 className="w-3 h-3 text-[#FF4D6D]" />
          <span>{t.gameOver.shareBtn}</span>
        </a>
      </div>
    </div>
  );
};
