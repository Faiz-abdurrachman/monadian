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
  ShieldCheck,
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
        width: 190,
        margin: 1.5,
        color: {
          dark: '#241022',
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
    <div className="flex-1 min-h-0 w-full flex flex-col justify-between items-center text-center select-none font-quicksand bg-gradient-to-b from-[#FFF5F7] via-[#FFF0F4] to-[#FFE4EC] text-[#241022] p-3 sm:p-5 overflow-y-auto scrollbar-none relative z-10">
      {/* 1. TOP HEADER (Back to Lobby & Language) */}
      <header className="w-full flex items-center justify-between gap-2 flex-shrink-0 pt-0.5">
        <button
          type="button"
          onClick={onBackToLobby}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-50/60 border-2 border-[#FFD8E3] text-xs font-comfortaa font-bold text-[#E11D48] transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Home className="w-4 h-4 text-[#FF3366]" />
          <span>{language === 'id' ? 'Lobi Utama' : 'Main Lobby'}</span>
        </button>

        <LanguageToggle />
      </header>

      {/* 2. ARENA HERO IDENTITY & POT CARD */}
      <div className="w-full max-w-[365px] flex flex-col items-center flex-shrink-0 my-1.5">
        <h1 className="font-comfortaa font-bold text-lg sm:text-xl text-[#241022] leading-tight">
          {config.roomName}
        </h1>

        {/* Status Capsule */}
        <div className="flex items-center justify-center gap-2 mt-1.5 px-3.5 py-1 rounded-full bg-white border border-[#FFD8E3] text-[11px] font-comfortaa font-bold text-[#241022] shadow-xs flex-wrap">
          <span className="text-[#B45309] flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
            <span>#{config.roomCode}</span>
          </span>
          <span className="text-pink-300">•</span>
          <span className="text-[#FF3366] font-extrabold">
            🎁 {totalPotFormatted}
          </span>
          <span className="text-pink-300">•</span>
          <span className="text-emerald-700 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>{config.poolType === 'sponsored' ? 'GRATIS' : 'P2P BUY-IN'}</span>
          </span>
        </div>
      </div>

      {/* 3. BIG STAGE QR CODE (Soft Rounded Bento Card) */}
      <div className="w-full max-w-[365px] flex flex-col items-center flex-shrink-0 my-1">
        <div className="relative p-4 rounded-[34px] sm:rounded-[38px] bg-white shadow-[0_12px_35px_rgba(255,160,185,0.35)] border-2 border-[#FFD8E3]">
          <canvas ref={canvasRef} className="rounded-2xl block mx-auto shadow-inner" />
        </div>

        <p className="text-[11px] font-comfortaa font-bold text-[#795B6B] mt-2">
          📱 {language === 'id' ? 'Scan QR dengan HP untuk langsung masuk arena' : 'Scan QR with phone to join arena live'}
        </p>

        {/* Copy Link Pill Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="mt-1.5 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-pink-50/60 border border-[#FFD8E3] text-xs text-[#FF3366] font-comfortaa font-bold transition-all active:scale-95 shadow-xs cursor-pointer select-none"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-extrabold">{language === 'id' ? 'Tautan Disalin!' : 'Link Copied!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#FF3366]" />
              <span>{language === 'id' ? 'Salin Tautan Room' : 'Copy Room Link'}</span>
            </>
          )}
        </button>
      </div>

      {/* 4. CONTENDERS DOCK (Clean Rounded-Full Avatar Strip) */}
      <div className="w-full max-w-[365px] flex flex-col gap-1.5 flex-shrink-0 text-left my-1.5 p-3.5 rounded-[30px] bg-white border-2 border-[#FFD8E3] shadow-xs">
        <div className="flex items-center justify-between text-xs font-comfortaa font-bold text-[#241022] px-1">
          <span className="flex items-center gap-1.5 text-[#FF3366]">
            <Users className="w-3.5 h-3.5 text-[#FF3366]" />
            <span>{language === 'id' ? 'PESERTA SIAP' : 'CONTENDERS READY'}</span>
          </span>
          <span className="font-mono text-[#FF3366] bg-[#FFEBF1] border border-[#FCD2DF] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            {joinedPlayers.length} / {config.maxPlayers}
          </span>
        </div>

        {/* Player Chips / Avatar Bubbles */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          {joinedPlayers.map((player, idx) => (
            <span
              key={`${player}-${idx}`}
              className={`px-3 py-1 rounded-full text-[11px] font-comfortaa font-bold flex items-center gap-1.5 shadow-xs ${
                idx === 0
                  ? 'bg-[#FEF9C3] border border-[#FDE047] text-[#B45309]'
                  : 'bg-[#FFEBF1] border border-[#FCD2DF] text-[#FF3366]'
              }`}
            >
              {idx === 0 ? (
                <Crown className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
              ) : (
                <MonaBunnyMascot mood="happy" size={16} showAura={false} />
              )}
              <span>{player}</span>
            </span>
          ))}

          {joinedPlayers.length < config.maxPlayers && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-comfortaa font-bold bg-[#FFF0F4] border border-[#FCD2DF] text-[#795B6B] flex items-center gap-1">
              <Bot className="w-3 h-3 text-[#FF3366]" />
              <span>+ {config.maxPlayers - joinedPlayers.length} AI Auto-Fill</span>
            </span>
          )}
        </div>
      </div>

      {/* 5. PRIMARY CTA START BUTTON (Juicy 3D Coral Button Matching Figma) */}
      <div className="w-full max-w-[365px] flex-shrink-0 pt-1 pb-1">
        <button
          type="button"
          onClick={handleStart}
          className="w-full h-13 sm:h-14 rounded-[22px] sm:rounded-[24px] bg-[#FF5C7A] text-white border-b-[5px] border-[#D81B60] shadow-[0_10px_25px_rgba(255,92,122,0.38)] hover:brightness-105 active:translate-y-1 active:border-b-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer font-comfortaa font-black text-sm sm:text-base tracking-wider uppercase select-none group px-4"
        >
          <Flame className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform animate-bounce flex-shrink-0" />
          <span className="truncate">
            {language === 'id'
              ? `MULAI PERTANDINGAN (${config.maxPlayers || 16}P)`
              : `START BATTLE (${config.maxPlayers || 16}P)`}
          </span>
        </button>
      </div>
    </div>
  );
};
