import React from 'react';
import {
  Play,
  ArrowRight,
  LogOut,
  Copy,
  Check,
  Camera,
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
  onOpenPitchDeck?: () => void;
  onOpenQr?: () => void;
  onOpenQrScanner?: () => void;
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
  onOpenQrScanner,
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
    if (!userAddress && onConnectWallet) {
      onConnectWallet();
    } else {
      onOpenCreateArena();
    }
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
    if (addr.length <= 22) return addr;
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col justify-between items-center text-center select-none font-quicksand bg-gradient-to-b from-[#FFF5F6] via-[#FFEBF0] to-[#FFF0F4] text-[#2F121A] relative px-4 pt-3 pb-4 sm:px-6 sm:pt-5 sm:pb-6 overflow-x-hidden overflow-y-auto">
      {/* Soft Ambient Blossom Glows */}
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-60 h-60 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 left-1/4 w-56 h-56 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />

      {/* ==================================================================== */}
      {/* 1. TOP BAR (Monadian Brand, Language Toggle, Help Button)            */}
      {/* ==================================================================== */}
      <header className="w-full max-w-[360px] sm:max-w-[380px] flex items-center justify-between flex-shrink-0 z-20 pt-1 pb-1">
        {/* Brand Title: Monadian */}
        <h1 className="font-fredoka font-bold text-2xl sm:text-[28px] text-[#241022] tracking-tight leading-none select-none">
          Monadian
        </h1>

        {/* Right Controls: Language Toggle + Help (?) Button */}
        <div className="flex items-center gap-2">
          <LanguageToggle />

          {/* Camera QR Scanner Button */}
          {onOpenQrScanner && (
            <button
              type="button"
              onClick={onOpenQrScanner}
              className="w-8 h-8 rounded-full bg-white/80 border border-[#FBCFE8] flex items-center justify-center text-[#FF3366] hover:bg-white active:scale-95 transition-all cursor-pointer shadow-2xs"
              title={language === 'id' ? 'Scan QR Arena (Kamera)' : 'Scan Arena QR (Camera)'}
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          {/* Guide Help Button (?) */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="w-8 h-8 rounded-full bg-white/80 border border-[#FBCFE8] flex items-center justify-center text-[#846875] hover:text-[#FF4D6D] hover:bg-white active:scale-95 transition-all cursor-pointer font-comfortaa font-bold text-sm shadow-2xs"
            title={language === 'id' ? 'Panduan Singkat' : 'Quick Guide'}
          >
            ?
          </button>
        </div>
      </header>

      {/* Guest Invitation Banner (if scanned room QR link) */}
      {guestRoomInfo && (
        <div className="w-full max-w-[360px] sm:max-w-[380px] flex-shrink-0 p-2.5 my-1 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border-2 border-[#FBCFE8] shadow-sm text-left flex items-center justify-between gap-2 z-20 animate-pulse">
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
      {/* 2. MAIN CENTER STACK (Mascot + Wallet Card + Action Buttons)         */}
      {/* ==================================================================== */}
      <div className="w-full max-w-[350px] sm:max-w-[370px] flex flex-col items-center flex-1 justify-center z-10 my-auto py-1">
        {/* Floating Best Score Pill Badge (Tucked Behind Bunny Ears like Figma) */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/95 border border-[#FBCFE8] shadow-[0_3px_12px_rgba(255,100,130,0.12)] z-10 -mb-7 sm:-mb-8">
          <span className="text-sm">🏆</span>
          <span className="text-[11px] font-comfortaa font-extrabold tracking-wider text-[#FF4D6D] uppercase">
            BEST
          </span>
          <span className="text-sm font-comfortaa font-black text-[#FF3358] ml-0.5">
            14,850
          </span>
        </div>

        {/* Dynamic 3D Bunny Mascot Sticker (Sits in front of the pill, behind player card) */}
        <div className="relative w-full flex items-center justify-center select-none pointer-events-none z-20">
          {userAddress ? (
            /* UDAH CONNECT: Happy waving bunny sticker */
            <img
              src="/assets/homepage/bunny_connected.png"
              alt="Monadian Happy Mascot"
              className="w-[245px] sm:w-[270px] max-w-full h-auto object-contain drop-shadow-[0_16px_32px_rgba(255,100,140,0.22)] select-none pointer-events-none"
              style={{ aspectRatio: '1040 / 1620' }}
            />
          ) : (
            /* BELUM CONNECT: Cute shy bunny sticker */
            <img
              src="/assets/homepage/bunny_disconnected.png"
              alt="Monadian Shy Mascot"
              className="w-[210px] sm:w-[235px] max-w-full h-auto object-contain drop-shadow-[0_16px_32px_rgba(255,100,140,0.22)] select-none pointer-events-none"
              style={{ aspectRatio: '972 / 1852' }}
            />
          )}
        </div>

        {/* SECTION - PLAYER STATUS (Connected vs Disconnected Wallet Card) */}
        {/* Overlaps the bottom of the bunny directly like Figma */}
        <div className={`w-full relative z-30 ${userAddress ? '-mt-24 sm:-mt-28' : '-mt-28 sm:-mt-32'}`}>
          <div className="w-full bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[32px] border-2 border-[#FFD8E2] shadow-[0_8px_25px_rgba(255,182,193,0.28)] p-3.5 sm:p-4 flex flex-col items-center gap-2 sm:gap-2.5">
            {userAddress ? (
              /* ---------------- STATE A: CONNECTED TO MONAD ---------------- */
              <>
                <span className="text-xs sm:text-sm font-comfortaa font-bold text-[#3B1F2D]">
                  {language === 'id' ? 'Terhubung ke Monad' : 'Connected to Monad'}
                </span>

                {/* Juicy Pastel Pill with Connected Address */}
                <div className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#F8A0CB] via-[#F472B6] to-[#F8A0CB] text-white shadow-xs flex items-center justify-between gap-2">
                  <span className="font-comfortaa font-bold text-xs sm:text-sm tracking-wide truncate">
                    {formatAddress(userAddress)}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
                      title={copied ? (language === 'id' ? 'Tersalin!' : 'Copied!') : (language === 'id' ? 'Salin Alamat' : 'Copy Address')}
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

                {/* SCAN QR CAMERA BUTTON TO JOIN ARENA */}
                {onOpenQrScanner && (
                  <button
                    type="button"
                    onClick={onOpenQrScanner}
                    className="w-full py-2 px-3 rounded-full bg-[#FFF0F4] hover:bg-pink-100/70 border border-[#FCD2DF] text-[#A12D4C] shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer font-comfortaa font-bold text-xs tracking-wider select-none mt-0.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#FF3366]" />
                    <span>{language === 'id' ? 'SCAN QR ARENA (KAMERA)' : 'SCAN ARENA QR (CAMERA)'}</span>
                  </button>
                )}
              </>
            ) : (
              /* ---------------- STATE B: NO WALLET CONNECTED --------------- */
              <>
                <span className="text-xs sm:text-sm font-comfortaa font-bold text-[#3B1F2D]">
                  {language === 'id' ? 'Belum Terhubung' : 'No Wallet Connected'}
                </span>

                {/* Primary Connect Button */}
                <button
                  type="button"
                  onClick={onConnectWallet}
                  disabled={isConnectingWallet}
                  className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FF5170] via-[#FF3B62] to-[#FF2D55] text-white font-comfortaa font-extrabold text-sm sm:text-base shadow-[0_4px_16px_rgba(255,61,98,0.4)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  <span>
                    {isConnectingWallet
                      ? (language === 'id' ? 'Menghubungkan...' : 'Connecting...')
                      : (language === 'id' ? 'Hubungkan Wallet' : 'Connect Wallet')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                </button>

                {/* Scan QR Arena Camera Button (Direct Join) */}
                {onOpenQrScanner && (
                  <button
                    type="button"
                    onClick={onOpenQrScanner}
                    className="w-full py-2 px-3 rounded-full bg-[#FFF0F4] hover:bg-pink-100/70 border border-[#FCD2DF] text-[#A12D4C] shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-comfortaa font-bold text-xs tracking-wider select-none mt-0.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#FF3366]" />
                    <span>{language === 'id' ? 'SCAN QR ARENA (KAMERA)' : 'SCAN ARENA QR (CAMERA)'}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 3. PRIMARY 3D JUICY ACTION BUTTONS (PLAY PVP & PLAY SOLO)             */}
        {/* ==================================================================== */}
        <div className="w-full flex flex-col gap-3 sm:gap-3.5 z-20 mt-3.5 sm:mt-4">
          {/* BUTTON 1: PLAY PVP (Coral-Pink 3D Button) */}
          <button
            type="button"
            onClick={handleStartArena}
            className="w-full h-16 sm:h-[70px] rounded-[26px] bg-gradient-to-r from-[#FF5E7C] via-[#FF4366] to-[#F42553] text-white border-b-[6px] border-[#D11648] shadow-[0_10px_25px_rgba(255,67,102,0.35)] hover:brightness-105 active:translate-y-1 active:border-b-[2px] transition-all flex items-center justify-between px-4 sm:px-5 cursor-pointer group"
          >
            {/* Left Translucent Play Circle */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0 backdrop-blur-xs">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>

            {/* Center Text Block */}
            <div className="flex-1 text-left px-3 sm:px-4 leading-tight">
              <span className="block font-comfortaa font-black text-base sm:text-lg tracking-wider uppercase text-white drop-shadow-xs">
                {language === 'id' ? 'MAIN PVP' : 'PLAY PVP'}
              </span>
              <span className="block text-[11px] sm:text-xs font-quicksand font-bold text-white/90">
                {language === 'id' ? 'Main Arena PVP 1.5 mon' : 'Main Arena PVP 1.5 mon'}
              </span>
            </div>

            {/* Right Crisp Circular Arrow Button */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-5 h-5 text-[#FF4366] stroke-[2.8]" />
            </div>
          </button>

          {/* BUTTON 2: PLAY SOLO (Lavender-Pink 3D Button) */}
          <button
            type="button"
            onClick={handleStartClassic}
            className="w-full h-16 sm:h-[70px] rounded-[26px] bg-gradient-to-r from-[#F8A3CD] via-[#F472B6] to-[#EC4899] text-white border-b-[6px] border-[#C22076] shadow-[0_10px_25px_rgba(244,114,182,0.35)] hover:brightness-105 active:translate-y-1 active:border-b-[2px] transition-all flex items-center justify-between px-4 sm:px-5 cursor-pointer group"
          >
            {/* Left Translucent Play Circle */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/25 border border-white/30 flex items-center justify-center flex-shrink-0 backdrop-blur-xs">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>

            {/* Center Text Block */}
            <div className="flex-1 text-left px-3 sm:px-4 leading-tight">
              <span className="block font-comfortaa font-black text-base sm:text-lg tracking-wider uppercase text-white drop-shadow-xs">
                {language === 'id' ? 'MAIN SOLO' : 'PLAY SOLO'}
              </span>
              <span className="block text-[11px] sm:text-xs font-quicksand font-bold text-white/90">
                {language === 'id' ? 'Latihan Solo' : 'Training'}
              </span>
            </div>

            {/* Right Crisp Circular Arrow Button */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-5 h-5 text-[#EC4899] stroke-[2.8]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
