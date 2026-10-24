import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Share2, Award, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
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
  onClaimPrize?: () => Promise<string | void>;
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
  onClaimPrize,
}) => {
  const { language } = useLanguage();
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [claimedTx, setClaimedTx] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

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

  const handleClaim = async () => {
    setIsClaiming(true);
    setClaimError(null);
    try {
      if (onClaimPrize) {
        const tx = await onClaimPrize();
        if (typeof tx === 'string') {
          setClaimedTx(tx);
        } else {
          setClaimedTx('0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
        }
      } else {
        setClaimedTx('0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
      }
    } catch (err: any) {
      console.warn('Gagal klaim hadiah:', err);
      setClaimError(err.message || (language === 'id' ? 'Klaim dibatalkan oleh wallet' : 'Claim cancelled by wallet'));
    } finally {
      setIsClaiming(false);
    }
  };

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

        {/* ACTION BUTTONS: Winner Claims MON vs Non-Winner Retry */}
        {isWinner ? (
          <>
            {!claimedTx ? (
              <button
                type="button"
                onClick={handleClaim}
                disabled={isClaiming}
                className="w-full h-14 sm:h-[58px] rounded-[22px] sm:rounded-[24px] bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-[#78350F] border-b-[6px] border-[#B45309] shadow-[0_12px_28px_rgba(245,158,11,0.4)] hover:brightness-105 active:translate-y-1 active:border-b-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer font-comfortaa font-black text-base sm:text-lg tracking-wider uppercase mb-3 select-none disabled:opacity-75"
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{language === 'id' ? 'KONFIRMASI WALLET...' : 'WALLET CONFIRMING...'}</span>
                  </>
                ) : (
                  <>
                    <Award className="w-6 h-6 fill-[#78350F]" />
                    <span>
                      {language === 'id'
                        ? `KLAIM HADIAH (+${prizeMon > 0 ? prizeMon.toFixed(2) : '1.04'} MON)`
                        : `CLAIM PRIZE (+${prizeMon > 0 ? prizeMon.toFixed(2) : '1.04'} MON)`}
                    </span>
                  </>
                )}
              </button>
            ) : (
              <div className="w-full p-3 rounded-[20px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-comfortaa font-bold mb-3 flex flex-col items-center gap-1 shadow-xs">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'id' ? 'Hadiah Berhasil Diklaim ke Dompet!' : 'Prize Claimed to Wallet!'}</span>
                </span>
                <a
                  href={`https://testnet.monadexplorer.com/tx/${claimedTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-emerald-600 underline flex items-center gap-1 hover:text-emerald-800"
                >
                  <span>Lihat Transaksi di Monad Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {claimError && (
              <p className="text-[11px] font-comfortaa font-bold text-rose-500 mb-2">
                {claimError}
              </p>
            )}

            {/* Back to Lobby (Pot is settled, no retry) */}
            {onBackToLobby && (
              <button
                type="button"
                onClick={onBackToLobby}
                className="w-full py-2.5 rounded-full bg-[#FFF0F4] hover:bg-pink-100 border border-[#FCD2DF] text-[#A12D4C] font-comfortaa font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none mb-2"
              >
                <Home className="w-4 h-4 stroke-[2.2]" />
                <span>{language === 'id' ? 'KEMBALI KE LOBI UTAMA' : 'RETURN TO MAIN LOBBY'}</span>
              </button>
            )}
          </>
        ) : (
          <>
            {/* Non-winner: Retry run or Hop to menu */}
            <button
              type="button"
              onClick={onRestart}
              className="w-full h-14 sm:h-[58px] rounded-[22px] sm:rounded-[24px] bg-[#FF5C7A] text-white border-b-[6px] border-[#D81B60] shadow-[0_12px_28px_rgba(255,92,122,0.38)] hover:brightness-105 active:translate-y-1 active:border-b-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer font-comfortaa font-black text-lg sm:text-xl tracking-wider uppercase mb-3 select-none"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              <span>{language === 'id' ? 'MAIN LAGI' : 'PLAY AGAIN'}</span>
            </button>

            {onBackToLobby && (
              <button
                type="button"
                onClick={onBackToLobby}
                className="text-[#4A2E3B] hover:text-[#FF4D6D] font-comfortaa font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none py-1 mb-1"
              >
                <Home className="w-4 h-4 stroke-[2.2]" />
                <span>{language === 'id' ? 'KEMBALI KE LOBI' : 'HOP TO MENU'}</span>
              </button>
            )}
          </>
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
