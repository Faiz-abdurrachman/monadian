import React, { useState } from 'react';
import {
  HelpCircle,
  Presentation,
  QrCode,
  Edit2,
  Check,
  Play,
  Swords,
  Wallet,
} from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { sounds } from '../engine/audio';
import { MonaBunnyMascot } from './MonaBunnyMascot';

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

const PRESET_NAMES = ['Faiz.mon', 'Juri_UGM', 'MonadChad', 'SakuraKing'];

export const LobbyLandingView: React.FC<LobbyLandingViewProps> = ({
  playerName,
  onPlayerNameChange,
  onEnterArena,
  onOpenCreateArena,
  isLiveTestnet,
  onToggleNetwork,
  onOpenGuide,
  onOpenPitchDeck,
  onOpenQr,
  sessionAddress,
  guestRoomInfo,
  userAddress,
  isConnectingWallet,
  onConnectWallet,
  onDisconnectWallet,
}) => {
  const { language } = useLanguage();
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(playerName);

  const handleStartClassic = () => {
    sounds.playPickup();
    onEnterArena();
  };

  const handleStartArena = () => {
    sounds.playPickup();
    onOpenCreateArena();
  };

  const handleSaveName = () => {
    const trimmed = tempName.trim() || 'Faiz.mon';
    onPlayerNameChange(trimmed);
    setIsEditingName(false);
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col justify-between items-center text-center select-none font-quicksand bg-[#FFF8F7] text-[#2F121A] relative p-3 sm:p-4 overflow-hidden">
      {/* Ambient Blossom & Strawberry Lighting Blobs (Figma Tokens) */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-12 w-56 h-56 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-52 h-52 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />

      {/* Floating Sparkles & Blossom Emojis */}
      <div className="absolute top-12 left-3 text-pink-300/60 text-base pointer-events-none select-none">🌸</div>
      <div className="absolute top-24 right-4 text-pink-300/50 text-xs pointer-events-none select-none">✨</div>

      {/* ==================================================================== */}
      {/* 1. TOP HEADER (Logo, Network Mode Switch, Language, Quick Guide)     */}
      {/* ==================================================================== */}
      <header className="w-full flex items-center justify-between gap-2 flex-shrink-0 pt-0.5 z-10">
        {/* Logo & Network Tag */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#FF758F] to-[#FF4D6D] border-2 border-white text-white shadow-xs flex items-center justify-center text-sm font-black">
            🌸
          </div>
          <div className="text-left leading-tight">
            <h1 className="font-comfortaa font-bold text-sm text-[#2F121A] tracking-wider uppercase">
              BLITZGRID
            </h1>
            <button
              onClick={onToggleNetwork}
              className={`text-[8px] font-comfortaa font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                isLiveTestnet
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-pink-100 text-[#FF4D6D] border-pink-200'
              }`}
              title={language === 'id' ? 'Klik untuk ganti mode jaringan' : 'Click to toggle network mode'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveTestnet ? 'bg-emerald-500 animate-pulse' : 'bg-[#FF4D6D]'}`} />
              <span>{isLiveTestnet ? 'MONAD TESTNET' : 'STAGE DEMO'}</span>
            </button>
          </div>
        </div>

        {/* Right Controls: Language Switcher & Quick Guide Modal */}
        <div className="flex items-center gap-1.5">
          <LanguageToggle />

          <button
            onClick={onOpenGuide}
            className="w-8 h-8 rounded-full bg-white border border-pink-200 shadow-xs flex items-center justify-center text-[#574144] hover:text-[#FF4D6D] hover:bg-pink-50 active:scale-95 transition-all cursor-pointer"
            title={language === 'id' ? 'Panduan Singkat 15 Detik' : '15-Second Judge Guide'}
          >
            <HelpCircle className="w-4 h-4 text-[#FF4D6D]" />
          </button>
        </div>
      </header>

      {/* Guest Invitation Banner (if scanned room link) */}
      {guestRoomInfo && (
        <div className="w-full flex-shrink-0 p-2.5 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border-2 border-[#FBCFE8] shadow-sm text-left flex items-center justify-between gap-2 z-10 animate-pulse">
          <div className="leading-tight">
            <span className="text-[10px] font-comfortaa font-bold text-[#FF4D6D] block">
              🌸 {language === 'id' ? `Undangan Masuk Room #${guestRoomInfo.roomCode}` : `Room #${guestRoomInfo.roomCode} Invitation`}
            </span>
            <span className="text-[9px] text-[#574144]">
              {guestRoomInfo.mode === 'sponsored'
                ? language === 'id' ? `Mode Bounty Gratis • Hadiah ${guestRoomInfo.pot} MON` : `Sponsored Bounty • ${guestRoomInfo.pot} MON Prize`
                : language === 'id' ? `Mode P2P Buy-In • Pot ${guestRoomInfo.pot} MON` : `P2P Buy-In • ${guestRoomInfo.pot} MON Pot`}
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
      {/* 2. HERO PRESENTATION CARD (Minimal, Spacious & Kawaii)               */}
      {/* ==================================================================== */}
      <div className="w-full flex-shrink-0 bg-white/95 backdrop-blur-xl border border-pink-200/80 rounded-[32px] p-4 sm:p-5 shadow-[0_8px_30px_rgba(255,175,190,0.2)] flex flex-col items-center relative z-10">
        <MonaBunnyMascot mood="idle" size={76} className="mb-1" />

        <h2 className="font-fredoka font-bold text-xl text-[#2F121A] tracking-wide uppercase">
          PUZZLE ROYALE
        </h2>
        <p className="text-xs font-jakarta text-[#8A6B73] mt-0.5 font-medium">
          {language === 'id'
            ? 'Block Blast Battle Royale di Monad Testnet'
            : 'Block Blast Battle Royale on Monad Testnet'}
        </p>
      </div>

      {/* ==================================================================== */}
      {/* 3. PLAYER & WEB3 WALLET CARD (Prominent & Clear Connected State)     */}
      {/* ==================================================================== */}
      <div className="w-full flex-shrink-0 bg-white/95 backdrop-blur-md border border-pink-200/80 rounded-[28px] p-3 shadow-xs flex flex-col gap-2.5 z-10">
        {/* Tier 1: Player Profile & High Score */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <MonaBunnyMascot mood={userAddress ? 'happy' : 'idle'} size={32} showAura={false} className="flex-shrink-0" />
            <div className="min-w-0">
              {isEditingName ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tempName}
                      maxLength={16}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-24 px-2 py-0.5 text-xs font-jakarta font-bold border border-pink-300 rounded-full bg-pink-50 text-[#2F121A] focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 rounded-full bg-[#FF4D6D] text-white text-xs cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {PRESET_NAMES.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          setTempName(name);
                          onPlayerNameChange(name);
                          setIsEditingName(false);
                        }}
                        className="text-[8px] font-jakarta px-1.5 py-0.5 rounded-full bg-pink-100 hover:bg-pink-200 text-[#FF4D6D] transition-colors cursor-pointer"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTempName(playerName);
                    setIsEditingName(true);
                  }}
                  className="flex items-center gap-1 text-xs font-jakarta font-bold text-[#2F121A] hover:text-[#FF4D6D] truncate cursor-pointer text-left"
                  title="Klik untuk ubah nama"
                >
                  <span className="truncate">{playerName || 'Faiz.mon'}</span>
                  <Edit2 className="w-2.5 h-2.5 text-[#FF4D6D] flex-shrink-0 opacity-60" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="font-jakarta font-bold text-[10px] text-[#574144] bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
              🏆 14.8k
            </span>
          </div>
        </div>

        {/* Tier 2: Dedicated Web3 Wallet Status (High Visibility & Clear Distinction) */}
        {userAddress ? (
          /* STATE A: SUDAH KONEK / CONNECTED TO MONAD TESTNET */
          <div className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-pink-50 border-2 border-emerald-400/80 shadow-xs flex items-center justify-between gap-2 text-left animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Check className="w-4 h-4 text-white stroke-[3]" />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-jakarta font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    {language === 'id' ? 'TERHUBUNG KE MONAD' : 'CONNECTED TO MONAD'}
                  </span>
                  <span className="text-[8.5px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded-full">
                    Chain 10143
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs font-mono font-bold text-[#2F121A] truncate">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </span>
                  {sessionAddress && (
                    <span className="text-[9px] font-jakarta font-bold text-[#FF4D6D] bg-pink-100 px-1.5 py-0.2 rounded-full border border-pink-200">
                      🔑 0 Gas Session
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onDisconnectWallet}
              className="text-[10px] font-jakarta font-bold text-[#574144] hover:text-rose-600 bg-white hover:bg-rose-50 border border-pink-200 px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs flex-shrink-0"
              title={language === 'id' ? 'Putuskan koneksi wallet' : 'Disconnect wallet'}
            >
              {language === 'id' ? 'Putus' : 'Disconnect'}
            </button>
          </div>
        ) : (
          /* STATE B: BELUM KONEK / CALL-TO-ACTION PROMINEN */
          <button
            type="button"
            onClick={onConnectWallet}
            disabled={isConnectingWallet}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-[#836EF9] via-[#9333EA] to-[#FF4D6D] text-white font-jakarta font-bold text-xs shadow-[0_4px_16px_rgba(131,110,249,0.35)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-xs font-bold text-white">
                  {isConnectingWallet
                    ? (language === 'id' ? 'Menghubungkan...' : 'Connecting...')
                    : (language === 'id' ? 'Hubungkan Wallet (MetaMask / Rabby)' : 'Connect Web3 Wallet')}
                </span>
                <span className="block text-[9.5px] text-white/80 font-medium">
                  {language === 'id' ? 'Aktifkan mode on-chain Monad Testnet' : 'Enable Monad Testnet on-chain mode'}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-white/25 px-2.5 py-0.5 rounded-full font-bold text-white ml-2">
              {language === 'id' ? 'KONEK' : 'CONNECT'} &rarr;
            </span>
          </button>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 4. PRIMARY ACTIONS: PVP ARENA (HERO) & SOLO PRACTICE (CLEAN)         */}
      {/* ==================================================================== */}
      <div className="w-full flex-shrink-0 flex flex-col gap-2.5 z-10">
        {/* BUTTON 1 (PRIMARY): PVP BATTLE ROYALE */}
        <button
          type="button"
          onClick={handleStartArena}
          className="w-full h-14 rounded-full bg-gradient-to-r from-[#FF758F] via-[#FF4D6D] to-[#E61E4F] text-white shadow-[0_8px_25px_rgba(255,77,109,0.35)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 px-6 cursor-pointer group"
        >
          <Swords className="w-5 h-5 text-white" />
          <span className="font-comfortaa font-bold text-sm sm:text-base tracking-wider uppercase text-white">
            {language === 'id' ? 'MAIN ARENA PVP' : 'PVP BATTLE ROYALE'}
          </span>
          <span className="text-[10px] font-mono bg-white/20 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-bold ml-1">
            1.5 MON
          </span>
        </button>

        {/* BUTTON 2 (SECONDARY): LATIHAN SOLO */}
        <button
          type="button"
          onClick={handleStartClassic}
          className="w-full h-11 rounded-full bg-white/90 border border-pink-200 text-[#574144] hover:text-[#2F121A] hover:bg-pink-50 font-comfortaa font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <Play className="w-3.5 h-3.5 text-[#FF4D6D] fill-[#FF4D6D]" />
          <span>{language === 'id' ? 'Latihan Solo (Offline)' : 'Solo Practice (Offline)'}</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 5. BOTTOM NAVIGATION (Rounded-Full Pill Dock)                        */}
      {/* ==================================================================== */}
      <nav className="w-full flex-shrink-0 h-12 bg-white/95 backdrop-blur-md rounded-full border-2 border-[#FCE7F3] shadow-xs flex items-center justify-around px-3 z-10">
        {/* Tab 1: Lobby */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100 text-[#FF4D6D] font-comfortaa font-bold text-[10px] cursor-pointer"
        >
          <span>🎮</span>
          <span>{language === 'id' ? 'Lobi' : 'Lobby'}</span>
        </button>

        {/* Tab 2: Host Stage QR */}
        <button
          type="button"
          onClick={onOpenCreateArena}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#574144] hover:text-[#2F121A] hover:bg-pink-50 transition-all font-comfortaa font-bold text-[10px] cursor-pointer"
          title={language === 'id' ? 'Panggung Proyektor' : 'Stage Projector'}
        >
          <span>🎪</span>
          <span>{language === 'id' ? 'Panggung' : 'Stage'}</span>
        </button>

        {/* Tab 3: Pitch Slides */}
        <button
          type="button"
          onClick={onOpenPitchDeck}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#574144] hover:text-[#2F121A] hover:bg-pink-50 transition-all font-comfortaa font-bold text-[10px] cursor-pointer"
          title={language === 'id' ? 'Slide Juri' : 'Pitch Deck'}
        >
          <Presentation className="w-3.5 h-3.5 text-amber-600" />
          <span>{language === 'id' ? 'Slide Juri' : 'Pitch Deck'}</span>
        </button>

        {/* Tab 4: Scan QR */}
        <button
          type="button"
          onClick={onOpenQr}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#574144] hover:text-[#2F121A] hover:bg-pink-50 transition-all font-comfortaa font-bold text-[10px] cursor-pointer"
          title="QR"
        >
          <QrCode className="w-3.5 h-3.5 text-[#FF4D6D]" />
          <span>QR</span>
        </button>
      </nav>
    </div>
  );
};
