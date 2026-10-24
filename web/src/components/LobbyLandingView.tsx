import React from 'react';
import {
  HelpCircle,
  Presentation,
  QrCode,
  Play,
  ArrowRight,
  LogOut,
  Copy,
  Check,
} from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { sounds } from '../engine/audio';

export interface GuestRoomInfo {
  roomCode: string;
  mode: 'buyIn' | 'sponsored';
  pot: string;
}

interface LobbyLandingViewProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onEnterArena: () => void;
  onOpenCreateArena: () => void;
  isLiveTestnet: boolean;
  onToggleNetwork: () => void;
  onOpenGuide: () => void;
  onOpenPitchDeck: () => void;
  onOpenQr: () => void;
  sessionAddress?: string | null;
  guestRoomInfo?: GuestRoomInfo | null;
  userAddress?: string | null;
  isConnectingWallet?: boolean;
  onConnectWallet?: () => void;
  onDisconnectWallet?: () => void;
}

export const LobbyLandingView: React.FC<LobbyLandingViewProps> = ({
  onEnterArena,
  onOpenCreateArena,
  onOpenGuide,
  onOpenPitchDeck,
  onOpenQr,
  guestRoomInfo,
  userAddress,
  isConnectingWallet,
  onConnectWallet,
  onDisconnectWallet,
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleStartClassic = () => {
    sounds.playPickup();
    onEnterArena();
  };

  const handleStartArena = () => {
    sounds.playPickup();
    onOpenCreateArena();
  };

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Truncate address for clean pill display (e.g. 0x8C2Bc47a...2510c69c6)
  const formatAddress = (addr: string) => {
    if (addr.length <= 20) return addr;
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col justify-between items-center text-center select-none font-quicksand bg-gradient-to-b from-[#FFF5F6] via-[#FFEBF0] to-[#FFF0F4] text-[#2F121A] relative p-3 sm:p-5 overflow-y-auto overflow-x-hidden">
      {/* Soft Ambient Blossom Glows */}
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-60 h-60 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 left-1/4 w-56 h-56 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />

      {/* ==================================================================== */}
      {/* 1. TOP BAR (Monadian Brand, Language Pill, Slide & Guide Buttons)    */}
      {/* ==================================================================== */}
      <header className="w-full max-w-md flex items-center justify-between flex-shrink-0 pt-1 pb-1 z-20">
        {/* Brand Title: Monadian */}
        <h1 className="font-fredoka font-bold text-2xl sm:text-3xl text-[#2F121A] tracking-tight">
          Monadian
        </h1>

        {/* Right Controls: Language Toggle + Pitch Deck + Guide Help */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageToggle />

          {/* Quick Pitch Deck Modal Button */}
          <button
            onClick={onOpenPitchDeck}
            className="w-8 h-8 rounded-full bg-white/90 border border-pink-200 shadow-xs flex items-center justify-center text-[#574144] hover:text-[#FF4D6D] hover:bg-pink-50 active:scale-95 transition-all cursor-pointer"
            title={language === 'id' ? 'Buka Slide Presentasi Juri' : 'Open Stage Pitch Deck'}
          >
            <Presentation className="w-3.5 h-3.5 text-amber-600" />
          </button>

          {/* Guide Help Button */}
          <button
            onClick={onOpenGuide}
            className="w-8 h-8 rounded-full bg-white/90 border border-pink-200 shadow-xs flex items-center justify-center text-[#FF4D6D] hover:bg-pink-50 active:scale-95 transition-all cursor-pointer font-bold text-sm"
            title={language === 'id' ? 'Panduan Singkat' : 'Quick Guide'}
          >
            <HelpCircle className="w-4 h-4 text-[#FF4D6D]" />
          </button>
        </div>
      </header>

      {/* Guest Invitation Banner (if scanned room QR link) */}
      {guestRoomInfo && (
        <div className="w-full max-w-md flex-shrink-0 p-2.5 my-1 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border-2 border-[#FBCFE8] shadow-sm text-left flex items-center justify-between gap-2 z-20 animate-pulse">
          <div className="leading-tight">
            <span className="text-[10px] font-comfortaa font-bold text-[#FF4D6D] block">
              🌸 {language === 'id' ? `Undangan Room #${guestRoomInfo.roomCode}` : `Room #${guestRoomInfo.roomCode} Invite`}
            </span>
            <span className="text-[9px] text-[#574144]">
              {language === 'id' ? `Pot Hadiah: ${guestRoomInfo.pot} MON` : `Prize Pot: ${guestRoomInfo.pot} MON`}
            </span>
          </div>
          <button
            onClick={handleStartArena}
            className="py-1 px-3 rounded-xl bg-gradient-to-r from-[#FF758F] to-[#FF4D6D] text-white text-[9px] font-comfortaa font-bold shadow-xs active:scale-95 cursor-pointer"
          >
            {language === 'id' ? 'GABUNG' : 'JOIN'}
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. CENTER STAGE: BEST SCORE BADGE & 3D STICKER MASCOT                */}
      {/* ==================================================================== */}
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center py-2 z-10">
        {/* Floating Best Score Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-pink-200 shadow-[0_2px_10px_rgba(255,77,109,0.12)] mb-2">
          <span className="text-sm">🏆</span>
          <span className="text-[11px] font-comfortaa font-extrabold tracking-wider text-[#FF4D6D] uppercase">
            BEST
          </span>
          <span className="text-sm font-comfortaa font-black text-[#FF4D6D] ml-0.5">
            14,850
          </span>
        </div>

        {/* Dynamic 3D Bunny Mascot Sticker */}
        <div className="relative flex items-center justify-center my-1 select-none pointer-events-none">
          {userAddress ? (
            /* UDAH CONNECT: Happy waving bunny with open smile & excitement lines */
            <img
              src="/assets/homepage/bunny_connected.png"
              alt="Monadian Happy Mascot"
              className="w-48 sm:w-56 h-auto max-h-[220px] object-contain drop-shadow-[0_12px_24px_rgba(255,100,130,0.25)] animate-bounce-subtle"
            />
          ) : (
            /* BELUM CONNECT: Cute shy bunny with hands in front */
            <img
              src="/assets/homepage/bunny_disconnected.png"
              alt="Monadian Shy Mascot"
              className="w-44 sm:w-52 h-auto max-h-[220px] object-contain drop-shadow-[0_12px_24px_rgba(255,100,130,0.2)] animate-pulse-subtle"
            />
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. SECTION - PLAYER STATUS (Connected vs Disconnected Wallet Card)    */}
      {/* ==================================================================== */}
      <div className="w-full max-w-md flex-shrink-0 z-10 mb-3">
        <div className="w-full bg-white/95 backdrop-blur-md rounded-[28px] border-2 border-pink-200/90 shadow-[0_8px_25px_rgba(255,175,190,0.2)] p-3.5 sm:p-4 flex flex-col items-center">
          {userAddress ? (
            /* ---------------- STATE A: CONNECTED TO MONAD ---------------- */
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-xs sm:text-sm font-comfortaa font-bold text-[#574144]">
                {language === 'id' ? 'Terhubung ke Monad' : 'Connected to Monad'}
              </span>

              {/* Juicy Pastel Pill with Connected Address */}
              <div className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#F9A8D4] via-[#F472B6] to-[#F9A8D4] border border-pink-200 text-white shadow-xs flex items-center justify-between gap-2">
                <span className="font-comfortaa font-bold text-xs sm:text-sm tracking-wide truncate">
                  {formatAddress(userAddress)}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
                    title={copied ? 'Tersalin!' : 'Salin Alamat'}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                  </button>
                  {onDisconnectWallet && (
                    <button
                      type="button"
                      onClick={onDisconnectWallet}
                      className="p-1 rounded-full bg-white/20 hover:bg-rose-500 text-white transition-all cursor-pointer"
                      title={language === 'id' ? 'Putuskan Wallet' : 'Disconnect'}
                    >
                      <LogOut className="w-3.5 h-3.5 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ---------------- STATE B: NO WALLET CONNECTED --------------- */
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-xs sm:text-sm font-comfortaa font-bold text-[#574144]">
                {language === 'id' ? 'Belum Terhubung' : 'No Wallet Connected'}
              </span>

              {/* Primary Connect Button */}
              <button
                type="button"
                onClick={onConnectWallet}
                disabled={isConnectingWallet}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#E61E4F] text-white font-comfortaa font-bold text-sm sm:text-base shadow-[0_6px_20px_rgba(255,77,109,0.4)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <span>
                  {isConnectingWallet
                    ? (language === 'id' ? 'Menghubungkan...' : 'Connecting...')
                    : (language === 'id' ? 'Hubungkan Wallet' : 'Connect Wallet')}
                </span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. PRIMARY 3D JUICY ACTION BUTTONS (PLAY PVP & PLAY SOLO)             */}
      {/* ==================================================================== */}
      <div className="w-full max-w-md flex-shrink-0 flex flex-col gap-3 z-10 mb-2">
        {/* BUTTON 1: PLAY PVP (Coral-Pink 3D Button) */}
        <button
          type="button"
          onClick={handleStartArena}
          className="w-full h-16 sm:h-18 rounded-[26px] bg-gradient-to-r from-[#FF6584] via-[#FF4D6D] to-[#E61E4F] text-white shadow-[0_6px_0_#D81B60,0_12px_24px_rgba(255,77,109,0.35)] hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#D81B60,0_6px_12px_rgba(255,77,109,0.25)] transition-all flex items-center justify-between px-4 sm:px-5 cursor-pointer group"
        >
          {/* Left Translucent Play Circle */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0 border border-white/30">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>

          {/* Center Text Block */}
          <div className="flex-1 text-left px-3 sm:px-4 leading-tight">
            <span className="block font-comfortaa font-extrabold text-base sm:text-lg tracking-wider uppercase text-white drop-shadow-xs">
              {language === 'id' ? 'MAIN PVP' : 'PLAY PVP'}
            </span>
            <span className="block text-[11px] sm:text-xs font-quicksand font-bold text-white/90">
              {language === 'id' ? 'Main Arena PVP 1.5 mon' : 'Main Arena PVP 1.5 mon'}
            </span>
          </div>

          {/* Right Crisp Circular Arrow Button */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-5 h-5 text-[#FF4D6D] stroke-[2.5]" />
          </div>
        </button>

        {/* BUTTON 2: PLAY SOLO (Lavender-Pink 3D Button) */}
        <button
          type="button"
          onClick={handleStartClassic}
          className="w-full h-16 sm:h-18 rounded-[26px] bg-gradient-to-r from-[#F9A8D4] via-[#F472B6] to-[#EC4899] text-white shadow-[0_6px_0_#DB2777,0_12px_24px_rgba(244,114,182,0.35)] hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#DB2777,0_6px_12px_rgba(244,114,182,0.25)] transition-all flex items-center justify-between px-4 sm:px-5 cursor-pointer group"
        >
          {/* Left Translucent Play Circle */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/25 backdrop-blur-xs flex items-center justify-center flex-shrink-0 border border-white/30">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>

          {/* Center Text Block */}
          <div className="flex-1 text-left px-3 sm:px-4 leading-tight">
            <span className="block font-comfortaa font-extrabold text-base sm:text-lg tracking-wider uppercase text-white drop-shadow-xs">
              {language === 'id' ? 'MAIN SOLO' : 'PLAY SOLO'}
            </span>
            <span className="block text-[11px] sm:text-xs font-quicksand font-bold text-white/90">
              {language === 'id' ? 'Latihan Mandiri' : 'Training'}
            </span>
          </div>

          {/* Right Crisp Circular Arrow Button */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-5 h-5 text-[#EC4899] stroke-[2.5]" />
          </div>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 5. MINIMAL BOTTOM DOCK (Clean, Discreet Stage & QR Modal Access)     */}
      {/* ==================================================================== */}
      <footer className="w-full max-w-md flex items-center justify-center gap-3 pt-1 z-10">
        <button
          type="button"
          onClick={onOpenCreateArena}
          className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-pink-200/80 shadow-2xs text-[11px] font-comfortaa font-bold text-[#574144] hover:text-[#FF4D6D] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>🎪</span>
          <span>{language === 'id' ? 'Panggung' : 'Stage'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenQr}
          className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-pink-200/80 shadow-2xs text-[11px] font-comfortaa font-bold text-[#574144] hover:text-[#FF4D6D] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <QrCode className="w-3.5 h-3.5 text-[#FF4D6D]" />
          <span>QR</span>
        </button>
      </footer>
    </div>
  );
};
