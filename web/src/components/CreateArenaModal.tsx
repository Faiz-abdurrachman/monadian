import React, { useState } from 'react';
import {
  X,
  Users,
  Coins,
  Gift,
  Trophy,
  Medal,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../locales/LanguageContext';
import { MonaBunnyMascot } from './MonaBunnyMascot';

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

const BUY_IN_PRESETS = ['0.05', '0.1', '0.25', '0.5'];
const SPONSOR_PRESETS = ['1.0', '1.5', '2.5', '5.0'];
const QUICK_PLAYER_CHIPS = [4, 8, 16, 32, 64];

export const CreateArenaModal: React.FC<CreateArenaModalProps> = ({
  isOpen,
  onClose,
  hostName,
  onCreateArena,
}) => {
  const { language } = useLanguage();

  const roomName = 'Monad Blitz Arena';
  const [maxPlayers, setMaxPlayers] = useState<number>(16);
  const [poolType, setPoolType] = useState<'buyIn' | 'sponsored'>('buyIn');
  const [entryFeeMon, setEntryFeeMon] = useState<string>('0.1');
  const [sponsorPotMon, setSponsorPotMon] = useState<string>('1.5');
  const [prizeScheme, setPrizeScheme] = useState<'winnerTakesAll' | 'podium'>('winnerTakesAll');

  if (!isOpen) return null;

  const handleStepPlayers = (delta: number) => {
    setMaxPlayers((prev) => {
      const next = prev + delta;
      const clamped = Math.max(2, Math.min(128, next));
      if (clamped < 3 && prizeScheme === 'podium') {
        setPrizeScheme('winnerTakesAll');
      }
      return clamped;
    });
  };

  const handleCustomPlayerInput = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setMaxPlayers(2);
      return;
    }
    const clamped = Math.max(2, Math.min(256, num));
    setMaxPlayers(clamped);
    if (clamped < 3 && prizeScheme === 'podium') {
      setPrizeScheme('winnerTakesAll');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(100 + Math.random() * 900).toString();
    onCreateArena({
      roomCode: randomCode,
      roomName: roomName.trim() || 'Monad Blitz Arena',
      hostName: hostName || 'Presenter',
      poolType,
      entryFeeMon,
      sponsorPotMon,
      prizeScheme: maxPlayers < 3 ? 'winnerTakesAll' : prizeScheme,
      maxPlayers,
    });
  };

  // Kalkulasi Total Pot Hadiah & Estimasi Hadiah Juara 1
  const totalPotNumber =
    poolType === 'sponsored'
      ? parseFloat(sponsorPotMon)
      : parseFloat(entryFeeMon) * maxPlayers;

  const totalPotFormatted = totalPotNumber.toFixed(2);
  const winnerPercentage = (prizeScheme === 'winnerTakesAll' || maxPlayers < 3) ? 0.95 : 0.65;
  const estimatedWinnerMon = (totalPotNumber * winnerPercentage).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2F121A]/50 backdrop-blur-sm animate-fadeIn select-none font-quicksand">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white border border-pink-200 rounded-[32px] p-5 sm:p-6 shadow-[0_20px_60px_rgba(255,140,165,0.25)] flex flex-col text-[#2F121A]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-[#574144] hover:text-[#FF4D6D] transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pr-8 text-left">
          <MonaBunnyMascot mood="battle" size={44} showAura={false} className="flex-shrink-0" />
          <div>
            <h2 className="font-fredoka font-bold text-lg text-[#2F121A] leading-tight">
              {language === 'id' ? 'Buat Pool & Arena' : 'Create Tournament Arena'}
            </h2>
            <p className="text-xs font-jakarta text-[#8A6B73] font-medium mt-0.5">
              {language === 'id'
                ? 'Tentukan jumlah pemain dan nominal tiket panggung'
                : 'Set player capacity & entry pot for live competition'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-left">
          {/* 1. Model Pool (Buy-In P2P vs Hadiah Sponsor) */}
          <div className="p-1 rounded-2xl bg-pink-50 border border-pink-100 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPoolType('buyIn')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-comfortaa font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                poolType === 'buyIn'
                  ? 'bg-[#FF4D6D] text-white shadow-xs'
                  : 'text-[#574144] hover:text-[#2F121A]'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Tiket P2P (Buy-In)' : 'P2P Buy-In'}</span>
            </button>

            <button
              type="button"
              onClick={() => setPoolType('sponsored')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-comfortaa font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                poolType === 'sponsored'
                  ? 'bg-[#FF4D6D] text-white shadow-xs'
                  : 'text-[#574144] hover:text-[#2F121A]'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Hadiah Sponsor' : 'Sponsor Bounty'}</span>
            </button>
          </div>

          {/* 2. Jumlah Pemain (Custom Stepper + Quick Chips) */}
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#FFF8FA] border border-pink-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-comfortaa font-bold text-[#2F121A] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#FF4D6D]" />
                <span>{language === 'id' ? 'Jumlah Pemain' : 'Player Capacity'}</span>
              </span>
              <span className="text-[10px] text-[#8A6B73] font-medium">
                {language === 'id' ? 'Ketik bebas / pilih preset' : 'Type freely / pick preset'}
              </span>
            </div>

            {/* Counter Stepper Row */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStepPlayers(-1)}
                disabled={maxPlayers <= 2}
                className="w-10 h-10 rounded-xl bg-white border border-pink-200 text-[#2F121A] hover:bg-pink-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Minus className="w-4 h-4 text-[#FF4D6D]" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="number"
                  min={2}
                  max={256}
                  value={maxPlayers}
                  onChange={(e) => handleCustomPlayerInput(e.target.value)}
                  className="w-full h-10 text-center font-comfortaa font-black text-lg bg-white border border-pink-200 focus:border-[#FF4D6D] rounded-xl text-[#2F121A] focus:outline-none shadow-xs"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-comfortaa font-bold text-[#8A6B73] pointer-events-none">
                  {language === 'id' ? 'Pemain' : 'Players'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleStepPlayers(1)}
                disabled={maxPlayers >= 256}
                className="w-10 h-10 rounded-xl bg-white border border-pink-200 text-[#2F121A] hover:bg-pink-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4 text-[#FF4D6D]" />
              </button>
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 pt-0.5">
              {QUICK_PLAYER_CHIPS.map((chip) => {
                const isSelected = maxPlayers === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setMaxPlayers(chip);
                      if (chip < 3 && prizeScheme === 'podium') setPrizeScheme('winnerTakesAll');
                    }}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-comfortaa font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF4D6D] text-white shadow-xs'
                        : 'bg-white border border-pink-200 text-[#574144] hover:bg-pink-50'
                    }`}
                  >
                    {chip}P
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Nominal Biaya Masuk / Sponsor Pot */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-comfortaa font-bold text-[#2F121A]">
              {poolType === 'buyIn'
                ? (language === 'id' ? 'Biaya Masuk per Pemain' : 'Entry Fee per Player')
                : (language === 'id' ? 'Nominal Pot Sponsor' : 'Sponsor Bounty Amount')}
            </span>

            <div className="grid grid-cols-4 gap-1.5">
              {(poolType === 'buyIn' ? BUY_IN_PRESETS : SPONSOR_PRESETS).map((val) => {
                const active = (poolType === 'buyIn' ? entryFeeMon : sponsorPotMon) === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => (poolType === 'buyIn' ? setEntryFeeMon(val) : setSponsorPotMon(val))}
                    className={`py-2 rounded-xl font-comfortaa font-bold text-xs transition-all cursor-pointer ${
                      active
                        ? 'bg-[#FF4D6D] text-white shadow-xs'
                        : 'bg-white border border-pink-200 text-[#2F121A] hover:bg-pink-50'
                    }`}
                  >
                    {val} MON
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Skema Juara */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-comfortaa font-bold text-[#2F121A]">
              {language === 'id' ? 'Skema Pemenang' : 'Prize Distribution'}
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPrizeScheme('winnerTakesAll')}
                className={`py-2 px-3 rounded-xl text-xs font-comfortaa font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  prizeScheme === 'winnerTakesAll' || maxPlayers < 3
                    ? 'bg-amber-100 border border-amber-300 text-amber-900 shadow-xs'
                    : 'bg-white border border-pink-200 text-[#574144] hover:bg-pink-50'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'id' ? 'Juara 1 (95%)' : 'Winner (95%)'}</span>
              </button>

              <button
                type="button"
                disabled={maxPlayers < 3}
                onClick={() => maxPlayers >= 3 && setPrizeScheme('podium')}
                className={`py-2 px-3 rounded-xl text-xs font-comfortaa font-bold transition-all flex items-center justify-center gap-1.5 ${
                  maxPlayers < 3
                    ? 'opacity-40 cursor-not-allowed bg-zinc-100 text-zinc-400 border border-zinc-200'
                    : prizeScheme === 'podium'
                    ? 'bg-pink-100 border border-pink-300 text-[#FF4D6D] shadow-xs cursor-pointer'
                    : 'bg-white border border-pink-200 text-[#574144] hover:bg-pink-50 cursor-pointer'
                }`}
                title={maxPlayers < 3 ? 'Top 3 minimal membutuhkan 3 pemain' : undefined}
              >
                <Medal className="w-3.5 h-3.5" />
                <span>{language === 'id' ? 'Top 3 (65/20/10)' : 'Top 3 (Podium)'}</span>
              </button>
            </div>
          </div>

          {/* 5. LIVE POOL ECONOMIC CARD (Focus on the money!) */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 border border-pink-200 flex items-center justify-between text-left shadow-xs">
            <div>
              <span className="text-[10px] font-comfortaa font-bold text-[#8A6B73] uppercase tracking-wider block">
                {language === 'id' ? 'Total Pool Hadiah' : 'Total Prize Pool'}
              </span>
              <span className="font-comfortaa font-black text-xl text-[#FF4D6D] tracking-tight block">
                {totalPotFormatted} MON
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-[#574144] block">
                {poolType === 'buyIn'
                  ? `${maxPlayers} ${language === 'id' ? 'Pemain' : 'Players'} × ${entryFeeMon} MON`
                  : (language === 'id' ? 'Bounty Sponsor Gratis' : 'Free Sponsor Bounty')}
              </span>
              <span className="text-[11px] font-comfortaa font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full inline-block mt-0.5">
                🏆 Juara 1: ~{estimatedWinnerMon} MON
              </span>
            </div>
          </div>

          {/* 6. Primary Action Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-full bg-gradient-to-r from-[#FF758F] via-[#FF4D6D] to-[#E61E4F] text-white font-comfortaa font-bold text-sm tracking-wide shadow-[0_6px_20px_rgba(255,77,109,0.35)] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{language === 'id' ? 'Buat Arena & Tampilkan QR' : 'Create Arena & Show QR'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
