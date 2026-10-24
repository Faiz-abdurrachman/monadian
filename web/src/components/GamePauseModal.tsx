import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';

interface GamePauseModalProps {
  isOpen: boolean;
  score: number;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onBackToLobby: () => void;
  onToggleMute: () => void;
}

export const GamePauseModal: React.FC<GamePauseModalProps> = ({
  isOpen,
  score,
  isMuted,
  onResume,
  onRestart,
  onBackToLobby,
  onToggleMute,
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
        className="relative w-full max-w-[340px] bg-white border-2 border-[#FFD8E2] rounded-[36px] p-6 shadow-[0_20px_60px_rgba(255,160,185,0.45)] flex flex-col items-center text-center text-[#241022]"
      >
        <span className="text-3xl mb-1">🌸</span>
        <h2 className="font-comfortaa font-bold text-2xl text-[#241022] tracking-tight uppercase">
          {language === 'id' ? 'GAME DIJEDA' : 'GAME PAUSED'}
        </h2>
        <p className="font-quicksand font-semibold text-sm text-[#795B6B] mt-1 mb-5">
          {language === 'id' ? 'Skor Saat Ini:' : 'Current Score:'}{' '}
          <span className="text-[#FF5C7A] font-bold text-base font-comfortaa">
            {score.toLocaleString()}
          </span>
        </p>

        <div className="w-full flex flex-col gap-3">
          {/* Resume Button */}
          <button
            type="button"
            onClick={onResume}
            className="w-full h-13 rounded-[22px] bg-[#FF5C7A] text-white border-b-[5px] border-[#D81B60] shadow-[0_8px_20px_rgba(255,92,122,0.35)] hover:brightness-105 active:translate-y-1 active:border-b-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer font-comfortaa font-bold text-base uppercase tracking-wider"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{language === 'id' ? 'LANJUTKAN' : 'RESUME'}</span>
          </button>

          {/* Sound / Music Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="w-full h-11 rounded-[20px] bg-white border border-[#FCD2DF] hover:bg-pink-50/50 text-[#241022] font-comfortaa font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#FF5C7A]" /> : <Volume2 className="w-4 h-4 text-[#2DD4BF]" />}
            <span>{isMuted ? (language === 'id' ? 'SUARA: MATI' : 'SOUND: OFF') : (language === 'id' ? 'SUARA: AKTIF' : 'SOUND: ON')}</span>
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={onRestart}
            className="w-full h-11 rounded-[20px] bg-white border border-[#FCD2DF] hover:bg-pink-50/50 text-[#241022] font-comfortaa font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4 text-[#795B6B]" />
            <span>{language === 'id' ? 'ULANGI' : 'RESTART'}</span>
          </button>

          {/* Back to Lobby Button */}
          <button
            type="button"
            onClick={onBackToLobby}
            className="w-full h-11 rounded-[20px] bg-[#FFF0F4] border border-[#FCD2DF] hover:bg-pink-100/50 text-[#795B6B] font-comfortaa font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{language === 'id' ? 'KEMBALI KE LOBI' : 'BACK TO LOBBY'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
