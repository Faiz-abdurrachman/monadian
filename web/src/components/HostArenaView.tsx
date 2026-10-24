import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  Crown,
  Flame,
  Copy,
  Check,
  Users,
  Home,
  Bot,
} from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { ArenaConfig } from './CreateArenaModal';
import { sounds } from '../engine/audio';
import { MonaBunnyMascot } from './MonaBunnyMascot';

interface HostArenaViewProps {
  config: ArenaConfig;
  joinedPlayers: string[];
  onStartGame: () => void;
  onBackToLobby: () => void;
}

export const HostArenaView: React.FC<HostArenaViewProps> = ({
  config,
  joinedPlayers,
  onStartGame,
  onBackToLobby,
}) => {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate shareable URL with room and pool parameters
  const getShareUrl = () => {
    if (typeof window === 'undefined') return 'http://localhost:3000';
    const baseUrl = window.location.origin.includes('localhost')
      ? 'http://192.168.1.114:3000'
      : window.location.origin;
    return `${baseUrl}?room=${config.roomCode}&mode=${config.poolType}&pot=${
      config.poolType === 'sponsored' ? config.sponsorPotMon : config.entryFeeMon
    }&players=${config.maxPlayers || 16}`;
  };

  const shareUrl = getShareUrl();

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(
      canvasRef.current,
      shareUrl,
      {
        width: 200,
        margin: 1.5,
        color: {
          dark: '#2F121A',
          light: '#ffffff',
        },
      },
      (error) => {
        if (error) console.error('Host QR code generation error:', error);
      }
    );
  }, [shareUrl]);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalPotFormatted =
    config.poolType === 'sponsored'
      ? `${config.sponsorPotMon} MON`
      : `${(parseFloat(config.entryFeeMon) * (config.maxPlayers || 16)).toFixed(2)} MON`;

  const handleStart = () => {
    sounds.playPickup();
    onStartGame();
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col justify-between items-center text-center select-none font-quicksand bg-[#FFF8F7] text-[#2F121A] p-3 sm:p-4 overflow-y-auto scrollbar-none relative z-10">
      {/* 1. TOP HEADER (Back to Lobby & Language) */}
      <header className="w-full flex items-center justify-between gap-2 flex-shrink-0 pt-0.5">
        <button
          type="button"
          onClick={onBackToLobby}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-[10px] font-comfortaa font-bold text-[#FF4D6D] transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5 text-[#FF4D6D]" />
          <span>{language === 'id' ? 'Lobi Utama' : 'Main Lobby'}</span>
        </button>

        <LanguageToggle />
      </header>

      {/* 2. ARENA HERO IDENTITY (Unified Clean Title & Status Pill) */}
      <div className="w-full flex flex-col items-center flex-shrink-0 my-1">
        <h1 className="font-comfortaa font-bold text-base sm:text-lg text-[#2F121A] leading-tight">
          {config.roomName}
        </h1>

        {/* 1-Line Status Capsule */}
        <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-pink-100/80 border border-pink-200 text-[10px] font-comfortaa font-bold text-[#2F121A] shadow-xs">
          <span className="text-amber-800 flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
            <span>#{config.roomCode}</span>
          </span>
          <span className="text-pink-300">•</span>
          <span className="text-[#FF4D6D]">
            🎁 {totalPotFormatted}
          </span>
          <span className="text-pink-300">•</span>
          <span className="text-emerald-700">
            {config.poolType === 'sponsored' ? 'GRATIS' : 'P2P BUY-IN'}
          </span>
        </div>
      </div>

      {/* 3. BIG STAGE QR CODE (Soft Rounded Bento Card) */}
      <div className="flex flex-col items-center flex-shrink-0 my-1">
        <div className="relative p-3.5 rounded-[30px] bg-white shadow-[0_8px_25px_rgba(255,175,190,0.3)] border-2 border-pink-200">
          <canvas ref={canvasRef} className="rounded-2xl block mx-auto" />
        </div>

        <p className="text-[10px] font-comfortaa font-bold text-[#574144] mt-1.5">
          📱 {language === 'id' ? 'Scan QR dengan HP untuk langsung masuk arena' : 'Scan QR with phone to join arena live'}
        </p>

        {/* Copy Link Pill Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="mt-1 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white hover:bg-pink-50 border border-pink-200 text-[10px] text-[#FF4D6D] font-comfortaa font-bold transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600">{language === 'id' ? 'Tautan Disalin!' : 'Link Copied!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-[#FF4D6D]" />
              <span>{language === 'id' ? 'Salin Tautan Room' : 'Copy Room Link'}</span>
            </>
          )}
        </button>
      </div>

      {/* 4. CONTENDERS DOCK (Clean Rounded-Full Avatar Strip) */}
      <div className="w-full flex flex-col gap-1.5 flex-shrink-0 text-left my-1 p-3 rounded-[28px] bg-white border border-pink-200/80 shadow-xs">
        <div className="flex items-center justify-between text-[10px] font-comfortaa font-bold text-[#2F121A] px-1">
          <span className="flex items-center gap-1.5 text-[#FF4D6D]">
            <Users className="w-3.5 h-3.5 text-[#FF4D6D]" />
            <span>{language === 'id' ? 'PESERTA SIAP' : 'CONTENDERS READY'}</span>
          </span>
          <span className="font-mono text-[#FF4D6D] bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full text-[9px]">
            {joinedPlayers.length} / {config.maxPlayers}
          </span>
        </div>

        {/* Player Chips / Avatar Bubbles */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          {joinedPlayers.map((player, idx) => (
            <span
              key={`${player}-${idx}`}
              className={`px-2.5 py-1 rounded-full text-[10px] font-comfortaa font-bold flex items-center gap-1.5 shadow-xs ${
                idx === 0
                  ? 'bg-amber-100 border border-amber-300 text-amber-800'
                  : 'bg-pink-100 border border-pink-200 text-[#FF4D6D]'
              }`}
            >
              {idx === 0 ? (
                <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
              ) : (
                <MonaBunnyMascot mood="happy" size={16} showAura={false} />
              )}
              <span>{player}</span>
            </span>
          ))}

          {joinedPlayers.length < config.maxPlayers && (
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-comfortaa font-bold bg-pink-50 border border-pink-200/60 text-[#574144] flex items-center gap-1">
              <Bot className="w-2.5 h-2.5 text-[#FF4D6D]" />
              <span>+ {config.maxPlayers - joinedPlayers.length} AI Auto-Fill</span>
            </span>
          )}
        </div>
      </div>

      {/* 5. PRIMARY CTA START BUTTON (Juicy 3D Mochi Pill) */}
      <div className="w-full flex-shrink-0 pt-1">
        <button
          type="button"
          onClick={handleStart}
          className="relative w-full h-[54px] rounded-full bg-gradient-to-b from-[#FF758F] via-[#FA436C] to-[#E61E4F] text-white shadow-[0_5px_0_0_#A81B3F,0_10px_20px_rgba(230,30,79,0.3)] active:translate-y-1 active:shadow-[0_1px_0_0_#A81B3F] transition-all flex items-center justify-center gap-2 px-5 cursor-pointer group"
        >
          <Flame className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform animate-bounce" />
          <span className="font-comfortaa font-black text-sm tracking-wider uppercase drop-shadow-sm">
            {language === 'id'
              ? `MULAI PERTANDINGAN (${config.maxPlayers || 16} PEMAIN)`
              : `START BATTLE (${config.maxPlayers || 16} PLAYERS)`}
          </span>
        </button>
      </div>
    </div>
  );
};
