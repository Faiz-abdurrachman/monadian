import { useState, useEffect, useCallback, useRef } from 'react';
import { Board3D, Board3DHandle, getPieceThemeIndex, CANDY_THEMES } from './components/Board3D';
import { HandTray } from './components/HandTray';
import { GamePauseModal } from './components/GamePauseModal';
import { GameOverModal } from './components/GameOverModal';
import { LaserBeams, BeamInstance } from './components/LaserBeams';
import { IncomingAttackBanner } from './components/IncomingAttackBanner';
import { LobbyQRModal } from './components/LobbyQRModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { PitchDeckModal } from './components/PitchDeckModal';
import { LobbyLandingView, GuestRoomInfo } from './components/LobbyLandingView';
import { CreateArenaModal, ArenaConfig } from './components/CreateArenaModal';
import { HostArenaView } from './components/HostArenaView';
import { CameraQrScannerModal } from './components/CameraQrScannerModal';
import {
  CombatAttack,
  consumePlayerInbox,
  evaluateBotCombat,
  OpponentState,
  WeaponType,
} from './engine/combatEngine';
import {
  PIECES,
  isBitSet,
  getMaskAt,
  placePiece,
  clearLines,
  calculateMana,
  canPlaceAnyPiece,
  canPlaceSinglePiece,
  findBestPlacement,
} from './engine/bitwise';
import { sounds } from './engine/audio';
import { sessionEngine } from './engine/sessionKey';
import { Pause, Music } from 'lucide-react';
import { useLanguage } from './locales/LanguageContext';

const INITIAL_OPPONENTS: OpponentState[] = Array.from({ length: 15 }, (_, i) => ({
  id: `bot-${i + 1}`,
  name: `Pemain_${i + 2}`,
  isAlive: true,
  boardFillPercent: Math.floor(Math.random() * 25) + 20,
  sabotaged: false,
  mana: Math.floor(Math.random() * 25),
  lastAttackTime: Date.now(),
}));

export function App() {
  const { language } = useLanguage();

  // View State (Lobby Landing vs Host Screen vs Battle Arena)
  const [currentView, setCurrentView] = useState<'lobby' | 'host' | 'game'>('lobby');
  const [playerName, setPlayerName] = useState<string>('Pemain_1');

  // Tournament Arena State (Mode 1: P2P Buy-in vs Mode 2: Sponsored Bounty)
  const [isCreateArenaOpen, setIsCreateArenaOpen] = useState<boolean>(false);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState<boolean>(false);
  const [activeArenaConfig, setActiveArenaConfig] = useState<ArenaConfig | null>(null);
  const [joinedPlayers, setJoinedPlayers] = useState<string[]>([]);
  const [guestRoomInfo, setGuestRoomInfo] = useState<GuestRoomInfo | null>(null);

  // Game State
  const [board, setBoard] = useState<bigint>(0n);
  const [sabotageMask, setSabotageMask] = useState<bigint>(0n);
  const [cellColors, setCellColors] = useState<(number | null)[]>(() => Array(64).fill(null));
  const [score, setScore] = useState<number>(0);
  const [mana, setMana] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [sabotageSentCount, setSabotageSentCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [rank, setRank] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isAttackedFlash, setIsAttackedFlash] = useState<boolean>(false);

  // Combat Inbox & Visual FX State
  const [pendingAttacks, setPendingAttacks] = useState<CombatAttack[]>([]);
  const [activeBeams, setActiveBeams] = useState<BeamInstance[]>([]);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);

  // Hand pieces (3 pieces per cycle)
  const [pieces, setPieces] = useState<number[]>([1, 9, 3]); // Line H2, Sqr 2x2, Line H3
  const [used, setUsed] = useState<boolean[]>([false, false, false]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(0);

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragCoords, setDragCoords] = useState<{ x: number; y: number } | null>(null);
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null);
  const [boardCellSize, setBoardCellSize] = useState<number>(38);

  // Ghost Indicator & Explosive Clear Spectacle
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [clearingCols, setClearingCols] = useState<number[]>([]);
  const [clearBanner, setClearBanner] = useState<{ text: string; subtext?: string } | null>(null);
  const [comboNotification, setComboNotification] = useState<{ streak: number; bonus: number } | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // 3D Board Ref for Raycasting & Layout Measurement
  const board3DRef = useRef<Board3DHandle>(null);
  const mainBoardContainerRef = useRef<HTMLDivElement>(null);
  const [boardBoxSize, setBoardBoxSize] = useState<number>(300);

  // Dynamic Responsive Board Sizing: Always fits exact available space without overflowing
  useEffect(() => {
    if (currentView !== 'game') return;

    let rafId: number;

    const measureAndSetSize = () => {
      if (!mainBoardContainerRef.current) return;
      const rect = mainBoardContainerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width > 0 && height > 0) {
        // Reserve 40px vertical clearance for bunny ears & padding, and 16px horizontal
        const optimal = Math.floor(Math.min(width - 16, height - 40, 420));
        if (optimal > 60) {
          setBoardBoxSize((prev) => (Math.abs(prev - optimal) > 2 ? optimal : prev));
          const measuredCell = board3DRef.current?.getCellSizePx();
          if (measuredCell && measuredCell > 12) {
            setBoardCellSize(measuredCell);
          }
        }
      }
    };

    // Immediate initial measurement on entering game view
    measureAndSetSize();
    rafId = requestAnimationFrame(measureAndSetSize);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          const optimal = Math.floor(Math.min(width - 16, height - 40, 420));
          if (optimal > 60) {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
              setBoardBoxSize((prev) => (Math.abs(prev - optimal) > 2 ? optimal : prev));
              const measuredCell = board3DRef.current?.getCellSizePx();
              if (measuredCell && measuredCell > 12) {
                setBoardCellSize(measuredCell);
              }
            });
          }
        }
      }
    });

    if (mainBoardContainerRef.current) {
      observer.observe(mainBoardContainerRef.current);
    }
    window.addEventListener('resize', measureAndSetSize);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', measureAndSetSize);
    };
  }, [currentView]);

  // Opponents & Target
  const [opponents, setOpponents] = useState<OpponentState[]>(INITIAL_OPPONENTS);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('bot-1');

  // Network Demo Mode Toggle, Wallet Connection & Session Key
  const [isLiveTestnet, setIsLiveTestnet] = useState<boolean>(() => !!sessionEngine.getUserAddress());
  const [sessionAddress, setSessionAddress] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(() => sessionEngine.getUserAddress());
  const [isConnectingWallet, setIsConnectingWallet] = useState<boolean>(false);
  const [txNotice, setTxNotice] = useState<string | null>(null);

  // Join Arena via Camera QR Scan (Works on Mobile Camera & MetaMask in-app browser)
  const handleScanQrSuccess = useCallback((scannedData: string) => {
    let roomCode = '371';
    let poolType: 'buyIn' | 'sponsored' = 'buyIn';
    let potMon = '0.80';
    let maxPlayers = 16;

    try {
      if (scannedData.includes('?') || scannedData.includes('room=')) {
        const queryString = scannedData.includes('?')
          ? scannedData.substring(scannedData.indexOf('?'))
          : `?${scannedData}`;
        const params = new URLSearchParams(queryString);
        if (params.get('room')) roomCode = params.get('room')!;
        if (params.get('mode') === 'sponsored') poolType = 'sponsored';
        if (params.get('pot')) potMon = params.get('pot')!;
        if (params.get('players')) maxPlayers = parseInt(params.get('players')!, 10) || 16;
      } else if (scannedData.trim()) {
        roomCode = scannedData.trim().replace(/^#/, '');
      }
    } catch (e) {
      console.warn('Gagal membaca data QR:', e);
    }

    const scannedConfig: ArenaConfig = {
      roomName: `Monad Blitz Arena #${roomCode}`,
      roomCode,
      poolType,
      entryFeeMon: poolType === 'sponsored' ? '0' : (parseFloat(potMon) / maxPlayers).toFixed(2),
      sponsorPotMon: poolType === 'sponsored' ? potMon : '0',
      prizeScheme: 'podium',
      maxPlayers,
      hostName: 'Host.mon',
    };

    setActiveArenaConfig(scannedConfig);

    const myName = playerName.trim() || (userAddress ? `${userAddress.slice(0, 6)}...` : 'Pemain_1');
    setJoinedPlayers(['Host.mon', myName, 'Bunny_Rival']);
    setCurrentView('host');
    sounds.playPickup();

    setTxNotice(
      language === 'id'
        ? `🎉 Berhasil bergabung ke Arena #${roomCode}! Peserta: Host.mon, ${myName}, Bunny_Rival`
        : `🎉 Joined Arena #${roomCode}! Contenders: Host.mon, ${myName}, Bunny_Rival`
    );
    setTimeout(() => setTxNotice(null), 4000);
  }, [language, playerName, userAddress]);

  // Inisialisasi EIP-7702 Ephemeral Session Key saat startup
  useEffect(() => {
    const s = sessionEngine.loadOrCreateSessionKey();
    setSessionAddress(s.address);
    const existingUser = sessionEngine.getUserAddress();
    if (existingUser) setUserAddress(existingUser);

    // Cek parameter undangan room (?room=101&mode=sponsored&pot=1.5) dari scan kamera HP
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const room = params.get('room');
      const mode = params.get('mode') as 'buyIn' | 'sponsored' | null;
      const pot = params.get('pot');
      if (room) {
        setGuestRoomInfo({
          roomCode: room,
          mode: mode === 'buyIn' ? 'buyIn' : 'sponsored',
          pot: pot || (mode === 'buyIn' ? '0.1' : '1.5'),
        });
        handleScanQrSuccess(window.location.search);
      }
    }
  }, [handleScanQrSuccess]);

  // Mulai BGM arcade prosedural saat interaksi pertama user
  useEffect(() => {
    const handleFirstGesture = () => {
      sounds.startBGM();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      const account = await sessionEngine.connectWallet();
      setUserAddress(account);
      setIsLiveTestnet(true);
      sounds.playPickup();
      setTxNotice(
        language === 'id'
          ? `Terhubung: ${account.slice(0, 6)}...${account.slice(-4)} (Monad 10143)`
          : `Connected: ${account.slice(0, 6)}...${account.slice(-4)} (Monad 10143)`
      );
      setTimeout(() => setTxNotice(null), 3500);
    } catch (e: any) {
      console.warn('Wallet connection error / fallback:', e);
      setTxNotice(
        language === 'id'
          ? (e.message?.includes('tidak terdeteksi')
              ? '🦊 Pasang MetaMask / Rabby untuk mode on-chain'
              : 'Koneksi wallet dibatalkan')
          : (e.message || 'Wallet connection cancelled')
      );
      setTimeout(() => setTxNotice(null), 3000);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleDisconnectWallet = () => {
    sessionEngine.disconnect();
    setUserAddress(null);
    setIsLiveTestnet(false);
    sounds.playDrop();
    setTxNotice(language === 'id' ? 'Wallet terputus (Stage Demo)' : 'Wallet disconnected (Stage Demo)');
    setTimeout(() => setTxNotice(null), 2000);
  };

  const handleToggleNetwork = async () => {
    if (!isLiveTestnet) {
      if (!userAddress) {
        await handleConnectWallet();
      } else {
        try {
          await sessionEngine.switchOrAddMonadChain();
        } catch (e) {
          console.warn('Gagal switch atau add Monad chain:', e);
        }
        setIsLiveTestnet(true);
        setTxNotice(language === 'id' ? 'Monad Testnet Aktif (Chain 10143)' : 'Monad Testnet Active (Chain 10143)');
        setTimeout(() => setTxNotice(null), 2500);
      }
    } else {
      setIsLiveTestnet(false);
      setTxNotice(language === 'id' ? 'Kembali ke Mode Panggung (Offline Safe)' : 'Switched to Stage Demo Mode (Offline Safe)');
      setTimeout(() => setTxNotice(null), 2500);
    }
  };

  // Generate 3 random pieces for a new hand cycle
  const generateNewHand = useCallback(() => {
    const newP = [
      Math.floor(Math.random() * PIECES.length),
      Math.floor(Math.random() * PIECES.length),
      Math.floor(Math.random() * PIECES.length),
    ];
    setPieces(newP);
    setUsed([false, false, false]);
    setSelectedSlot(0);
  }, []);

  // 60-Second Round Countdown (Only active in arena game view)
  useEffect(() => {
    // Only countdown round timer in PVP Tournament Arena mode
    if (currentView !== 'game' || isGameOver || isPaused || !activeArenaConfig) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentView, isGameOver, isPaused, activeArenaConfig]);

  // Simulated Battle Royale Opponent Activity & Asynchronous Combat Inbox Loop (PVP only)
  useEffect(() => {
    if (currentView !== 'game' || isGameOver || isPaused || !activeArenaConfig) return;
    const interval = setInterval(() => {
      setOpponents((prev) => {
        // 1. Natural board fill fluctuation
        const updated = prev.map((opp) => {
          if (!opp.isAlive) return opp;
          const delta = Math.floor(Math.random() * 8) - 2;
          let newFill = opp.boardFillPercent + delta;
          if (newFill >= 95) {
            return { ...opp, isAlive: false, boardFillPercent: 100 };
          }
          newFill = Math.max(10, Math.min(94, newFill));
          return { ...opp, boardFillPercent: newFill, sabotaged: false };
        });

        // 2. Evaluasi AI Bot Attack (Bot ke Pemain & Bot ke Bot)
        return evaluateBotCombat(
          updated,
          timeLeft,
          (attack) => {
            // Bot melancarkan serangan ke Combat Inbox pemain!
            setPendingAttacks((p) => [...p, attack]);
            sounds.playSabotage();
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 450);
            setIsAttackedFlash(true);
            setTimeout(() => setIsAttackedFlash(false), 500);
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([60, 50, 60]);
            }
          },
          (attack) => {
            // Bot menyerang bot lain: tambah fill target bot
            setOpponents((curr) =>
              curr.map((b) =>
                b.id === attack.targetId
                  ? {
                      ...b,
                      boardFillPercent: Math.min(94, b.boardFillPercent + 14),
                      sabotaged: true,
                    }
                  : b
              )
            );
          }
        );
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [currentView, isGameOver, timeLeft]);

  // Cek ketersediaan ruang untuk setiap bidak di tangan pemain
  const piecesCanFit = pieces.map((pieceId, idx) => {
    if (used[idx]) return false;
    return canPlaceSinglePiece(board, pieceId);
  });

  // Jika semua bidak tersisa di tangan tidak ada yang bisa ditaruh di papan -> Game Over!
  useEffect(() => {
    if (currentView !== 'game' || isGameOver) return;
    const remainingSlots = [0, 1, 2].filter((i) => !used[i]);
    if (remainingSlots.length > 0) {
      const anyCanFit = remainingSlots.some((slot) => piecesCanFit[slot]);
      if (!anyCanFit) {
        handleGameOver(false);
      }
    }
  }, [currentView, piecesCanFit, used, isGameOver]);

  // Compute active slot for ghost calculation
  const activeSlot = draggedSlot !== null ? draggedSlot : selectedSlot;

  // Compute ghost piece mask with smart fitting
  let ghostMask: bigint | null = null;
  let isGhostValid = false;

  if (activeSlot !== null && !used[activeSlot] && hoverCoords) {
    const pieceId = pieces[activeSlot];
    const placement = findBestPlacement(board, pieceId, hoverCoords.x, hoverCoords.y);
    if (placement) {
      ghostMask = placement.mask;
      isGhostValid = true;
    } else {
      // Show centered ghost in red to indicate collision / invalid fit
      const piece = PIECES[pieceId];
      if (piece) {
        const cx = Math.max(0, Math.min(8 - piece.width, hoverCoords.x - Math.floor((piece.width - 1) / 2)));
        const cy = Math.max(0, Math.min(8 - piece.height, hoverCoords.y - Math.floor((piece.height - 1) / 2)));
        ghostMask = getMaskAt(pieceId, cx, cy);
      }
      isGhostValid = false;
    }
  }

  // Handle piece placement EXCLUSIVELY via Drag and Drop (No accidental tap placements)
  const handleDropPiece = (x: number, y: number, slot: number) => {
    if (isGameOver || used[slot]) return;

    // 0. Konsumsi Inbox Serangan Masuk (Asynchronous Combat Inbox Pattern)
    let currentBoard = board;
    let currentSabotage = sabotageMask;

    if (pendingAttacks.length > 0) {
      const inboxResult = consumePlayerInbox(pendingAttacks, currentBoard, currentSabotage);
      currentBoard = inboxResult.newBoard;
      currentSabotage = inboxResult.newSabotageMask;
      setSabotageMask(currentSabotage);

      if (inboxResult.timePenaltySeconds > 0) {
        setTimeLeft((t) => Math.max(1, t - inboxResult.timePenaltySeconds));
      }

      if (inboxResult.hasToxicCurse) {
        // Kutukan Toxic: gantikan 1 balok tersisa di tangan dengan Square 3x3 raksasa
        setPieces((prev) => {
          const next = [...prev];
          const unusedIdx = used.findIndex((u, idx) => !u && idx !== slot);
          if (unusedIdx !== -1) {
            next[unusedIdx] = 11; // 11 adalah Square 3x3
          }
          return next;
        });
      }

      setPendingAttacks([]);
    }

    const pieceId = pieces[slot];
    const placement = findBestPlacement(currentBoard, pieceId, x, y);

    if (!placement) {
      // Jika penempatan batal karena baru tertutup batu sabotase, simpan state batu
      setBoard(currentBoard);
      return;
    }

    const { mask, x: placedX, y: placedY } = placement;

    // 1. Place piece
    const placedBoard = placePiece(currentBoard, mask);
    sounds.playDrop();

    // Assign solid piece color to all placed bits of this block (1 Bidak = 1 Warna Solid)
    const themeIdx = getPieceThemeIndex(pieceId, slot);
    const nextCellColors = [...cellColors];
    for (let i = 0; i < 64; i++) {
      if (isBitSet(mask, i)) {
        nextCellColors[i] = themeIdx;
      }
    }

    // 2. Check line clears
    const { newBoard, linesCleared, clearedRowIndices, clearedColIndices } = clearLines(placedBoard);

    if (linesCleared > 0) {
      const nextStreak = comboStreak + 1;
      setComboStreak(nextStreak);
      setMaxCombo((prev) => Math.max(prev, nextStreak));

      const earnedMana = calculateMana(linesCleared, nextStreak);
      setMana((m) => Math.min(100, m + earnedMana));
      const scoreGain = linesCleared * 100 * nextStreak;
      setScore((s) => s + scoreGain);

      sounds.playLineClear(linesCleared);
      sounds.playCombo(nextStreak);

      // Arcade Explosion Banner & Haptic Juice
      let bannerTitle = language === 'id' ? 'GARIS BERSIH! 🌸' : 'LINE BLAST! 🌸';
      if (linesCleared === 2) {
        bannerTitle = language === 'id' ? 'DOUBLE MELEDAK! ⚡' : 'DOUBLE BLAST! ⚡';
      } else if (linesCleared === 3) {
        bannerTitle = language === 'id' ? 'TRIPLE MELEDAK! 💥' : 'TRIPLE BLAST! 💥';
      } else if (linesCleared >= 4) {
        bannerTitle = language === 'id' ? 'BLITZ ROYALE! 👑' : 'BLITZ ROYALE! 👑';
      }

      const comboText = nextStreak > 1 ? `COMBO x${nextStreak} 🔥 (+${scoreGain})` : `+${scoreGain} PTS`;
      setClearBanner({ text: bannerTitle, subtext: comboText });
      setComboNotification({ streak: nextStreak, bonus: scoreGain });
      setTimeout(() => setComboNotification(null), 2200);
      if (linesCleared >= 2) setIsShaking(true);

      // CRUCIAL: Keep placedBoard active during the 420ms explosion spectacle!
      setBoard(placedBoard);
      setCellColors(nextCellColors);
      setClearingRows(clearedRowIndices);
      setClearingCols(clearedColIndices);

      // After 420ms explosion finishes, officially clear the blocks and update board state
      setTimeout(() => {
        setBoard(newBoard);
        setSabotageMask(currentSabotage & newBoard);

        const postExplosionColors = [...nextCellColors];
        for (const r of clearedRowIndices) {
          for (let c = 0; c < 8; c++) {
            postExplosionColors[r * 8 + c] = null;
          }
        }
        for (const c of clearedColIndices) {
          for (let r = 0; r < 8; r++) {
            postExplosionColors[r * 8 + c] = null;
          }
        }
        setCellColors(postExplosionColors);

        setClearingRows([]);
        setClearingCols([]);
        setIsShaking(false);
      }, 420);

      setTimeout(() => {
        setClearBanner(null);
      }, 1100);
    } else {
      setComboStreak(0);
      setScore((s) => s + 25);
      setMana((m) => Math.min(100, m + 10));
      setBoard(placedBoard);
      setCellColors(nextCellColors);
      setSabotageMask(currentSabotage & placedBoard);
    }

    // 3. Mark piece as used
    const newUsed = [...used];
    newUsed[slot] = true;
    setUsed(newUsed);

    // 4. Auto select next unused piece or draw new hand
    const nextSlot = newUsed.findIndex((u) => !u);
    if (nextSlot === -1) {
      generateNewHand();
    } else {
      setSelectedSlot(nextSlot);
      // Check if player has valid moves remaining
      const availablePieceIds = pieces.filter((_, idx) => !newUsed[idx]);
      if (!canPlaceAnyPiece(newBoard, availablePieceIds)) {
        handleGameOver(false);
      }
    }

    // 5. Broadcast to Monad Testnet via Session Key (Async 0-Popup)
    if (isLiveTestnet) {
      sessionEngine.makeMove(1n, slot, placedX, placedY).catch((err) => {
        console.info('On-Chain makeMove broadcast:', err.message);
      });
    }
  };

  // Tap-to-Place alternative to Drag & Drop
  const handleCellClick = (x: number, y: number) => {
    if (selectedSlot !== null && !used[selectedSlot] && !isGameOver) {
      const pieceId = pieces[selectedSlot];
      if (canPlaceSinglePiece(board, pieceId)) {
        const mask = getMaskAt(pieceId, x, y);
        if (mask !== null && (board & mask) === 0n) {
          handleDropPiece(x, y, selectedSlot);
        }
      }
    }
  };

  // Drag and Drop Handler from HandTray
  const handleDragStart = (slot: number, clientX: number, clientY: number) => {
    if (used[slot] || isGameOver || !piecesCanFit[slot]) return;

    // Measure exact socket cell size in pixels for 1:1 tactile dragging
    const detectedCellSize = board3DRef.current?.getCellSizePx();
    if (detectedCellSize && detectedCellSize > 20) {
      setBoardCellSize(detectedCellSize);
    }

    setSelectedSlot(slot);
    setDraggedSlot(slot);
    setIsDragging(true);
    setDragCoords({ x: clientX, y: clientY });

    // Initial raycast with thumb offset (85px on mobile touch)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const dragOffsetY = isTouch ? 85 : 45;
    const targetY = clientY - dragOffsetY;
    const coords = board3DRef.current?.getGridCoordsAt(clientX, targetY);
    setHoverCoords(coords || null);
  };

  // Global Pointer Listeners for Seamless Dragging
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragCoords({ x: e.clientX, y: e.clientY });
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const dragOffsetY = isTouch ? 85 : 45;
      const targetY = e.clientY - dragOffsetY;
      const coords = board3DRef.current?.getGridCoordsAt(e.clientX, targetY);
      setHoverCoords(coords || null);
    };

    const handlePointerUp = () => {
      if (draggedSlot !== null && hoverCoords && isGhostValid) {
        handleDropPiece(hoverCoords.x, hoverCoords.y, draggedSlot);
      }
      setIsDragging(false);
      setDraggedSlot(null);
      setDragCoords(null);
      setHoverCoords(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, draggedSlot, hoverCoords, isGhostValid, board, pieces, used]);

  // Helper to calculate player's board fill %
  const getPlayerFillPercent = (b: bigint): number => {
    let count = 0;
    for (let i = 0; i < 64; i++) {
      if ((b & (1n << BigInt(i))) !== 0n) count++;
    }
    return Math.min(100, Math.round((count / 64) * 100));
  };

  // Visual Projectile Laser Beam Trigger
  const triggerLaserBeam = (type: WeaponType, targetId: string) => {
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight - 100;
    let endX = window.innerWidth / 2;
    let endY = 80;

    const dockEl =
      document.querySelector('[data-single-attack-btn]') ||
      document.querySelector(`[data-weapon-type="${type}"]`);
    const targetEl = document.querySelector(`[data-opponent-id="${targetId}"]`);

    if (dockEl) {
      const rect = dockEl.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top;
    }
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      endX = rect.left + rect.width / 2;
      endY = rect.bottom;
    }

    const newBeam: BeamInstance = {
      id: `beam-${Date.now()}-${Math.random()}`,
      startX,
      startY,
      endX,
      endY,
      type,
      color: type === 'blossom' ? '#FF3366' : type === 'toxic' ? '#10b981' : type === 'frost' ? '#67e8f9' : '#38bdf8',
    };

    setActiveBeams((prev) => [...prev, newBeam]);
  };

  // 1-SKILL UNIFIED COMBAT: BLOSSOM STRIKE (30 Mana)
  const handleSingleAttack = () => {
    if (mana < 30) return;

    // Resolve target: selected or first alive opponent
    let target = opponents.find((o) => o.id === selectedTargetId && o.isAlive);
    if (!target) {
      target = opponents.find((o) => o.isAlive);
      if (target) setSelectedTargetId(target.id);
    }
    if (!target) return;

    setMana((m) => Math.max(0, m - 30));
    sounds.playSabotage();
    triggerLaserBeam('blossom', target.id);
    setSabotageSentCount((c) => c + 1);

    const targetId = target.id;
    const targetName = target.name || 'Opponent';

    setOpponents((prev) =>
      prev.map((opp) => {
        if (opp.id === targetId) {
          const newFill = Math.min(100, opp.boardFillPercent + 16);
          const isAlive = newFill < 95;
          return {
            ...opp,
            boardFillPercent: newFill,
            isAlive,
            sabotaged: true,
          };
        }
        return opp;
      })
    );

    // Dynamic Monad feedback toast
    setTxNotice(
      language === 'id'
        ? `🌸 BLOSSOM STRIKE dikirim ke ${targetName}! (+16% beban board) • 0.4s Finality`
        : `🌸 BLOSSOM STRIKE fired to ${targetName}! (+16% pressure) • 0.4s Finality`
    );
    setTimeout(() => setTxNotice(null), 3200);
  };

  // End Game Lifecycle
  const handleGameOver = (won: boolean) => {
    setIsGameOver(true);
    setIsWinner(won);
    const alive = opponents.filter((o) => o.isAlive).length;
    setRank(won ? 1 : alive + 1);
    won ? sounds.playVictory() : sounds.playDefeat();
  };

  // Restart Game
  const handleRestart = () => {
    setBoard(0n);
    setSabotageMask(0n);
    setCellColors(Array(64).fill(null));
    setScore(0);
    setMana(0);
    setComboStreak(0);
    setMaxCombo(1);
    setSabotageSentCount(0);
    setPendingAttacks([]);
    setActiveBeams([]);
    setTimeLeft(60);
    setIsGameOver(false);
    setIsWinner(false);
    setOpponents(INITIAL_OPPONENTS);
    generateNewHand();
  };

  // Tournament Arena Creation & Match Flow
  const handleCreateArena = (config: ArenaConfig) => {
    setActiveArenaConfig(config);
    const host = playerName.trim() || config.hostName || 'Host.mon';
    setJoinedPlayers([host]);
    setCurrentView('host');
    setIsCreateArenaOpen(false);

    // Live Stage Interactivity: Simulate guests scanning QR & joining
    setTimeout(() => {
      setJoinedPlayers((prev) => {
        if (prev.length === 1) return [...prev, 'Bunny_Rival'];
        return prev;
      });
    }, 2200);

    setTimeout(() => {
      setJoinedPlayers((prev) => {
        if (prev.length === 2) return [...prev, 'Audience_Phone'];
        return prev;
      });
    }, 4800);
  };

  const handleStartGameFromHost = () => {
    sounds.playPickup();

    // Construct hybrid battle royale roster: Joined Humans + Auto-fill AI Bots
    const humanGuests = joinedPlayers.slice(1);
    const maxPlayers = activeArenaConfig?.maxPlayers || 16;
    const totalSlots = Math.max(1, maxPlayers - 1);
    const opponentsList: OpponentState[] = [];

    humanGuests.forEach((name, idx) => {
      opponentsList.push({
        id: `guest-${idx + 1}`,
        name: name,
        isAlive: true,
        boardFillPercent: Math.floor(Math.random() * 20) + 15,
        sabotaged: false,
        mana: Math.floor(Math.random() * 20),
        lastAttackTime: Date.now(),
      });
    });

    const remaining = Math.max(0, totalSlots - humanGuests.length);
    for (let i = 0; i < remaining; i++) {
      const botNum = humanGuests.length + i + 2;
      opponentsList.push({
        id: `bot-${i + 1}`,
        name: `Bot_${botNum}`,
        isAlive: true,
        boardFillPercent: Math.floor(Math.random() * 25) + 20,
        sabotaged: false,
        mana: Math.floor(Math.random() * 25),
        lastAttackTime: Date.now(),
      });
    }

    setBoard(0n);
    setSabotageMask(0n);
    setCellColors(Array(64).fill(null));
    setScore(0);
    setMana(0);
    setComboStreak(0);
    setMaxCombo(1);
    setSabotageSentCount(0);
    setPendingAttacks([]);
    setActiveBeams([]);
    setTimeLeft(60);
    setIsGameOver(false);
    setIsWinner(false);
    setOpponents(opponentsList);
    generateNewHand();
    setCurrentView('game');
  };

  // Switch between Lobby and Arena
  const handleEnterArena = () => {
    sounds.playPickup();
    handleRestart();
    setCurrentView('game');
  };

  const handleBackToLobby = () => {
    handleRestart();
    setCurrentView('lobby');
  };

  // Expose developer & demo automation tools on window
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const api = {
        setMana: (m: number) => setMana(m),
        simulateAttack: (type: WeaponType, senderName: string) => {
          setPendingAttacks((p) => [
            ...p,
            {
              id: `att-${Date.now()}-${Math.random()}`,
              senderId: 'bot-1',
              senderName,
              targetId: 'player',
              type,
              timestamp: Date.now(),
            },
          ]);
        },
        dropPiece: (x: number, y: number, slot: number) => handleDropPiece(x, y, slot),
      };
      (window as any).__monadian = api;
      (window as any).__blitzgrid = api;
    }
  }, [board, sabotageMask, pendingAttacks, used, pieces]);

  // Escrow Pot & Prize calculation based on active arena or default mode
  const currentMaxPlayers = activeArenaConfig?.maxPlayers || 16;
  const displayPot = activeArenaConfig
    ? activeArenaConfig.poolType === 'sponsored'
      ? Number(activeArenaConfig.sponsorPotMon)
      : currentMaxPlayers * Number(activeArenaConfig.entryFeeMon)
    : 1.60;

  const firstPlaceCut =
    activeArenaConfig?.prizeScheme === 'winnerTakesAll' || currentMaxPlayers === 2 ? 0.95 : 0.65;
  const calculatedPrize = isWinner ? Number((displayPot * firstPlaceCut).toFixed(2)) : 0;

  const draggedPiece = draggedSlot !== null ? PIECES[pieces[draggedSlot]] : null;
  const draggedThemeIdx = draggedSlot !== null ? getPieceThemeIndex(pieces[draggedSlot], draggedSlot) : 0;
  const draggedTheme = CANDY_THEMES[draggedThemeIdx % CANDY_THEMES.length];

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-gradient-to-br from-[#FFF8F7] via-[#FFE4E8] to-[#FFF0F3] text-[#2F121A] flex items-center justify-center p-0 sm:p-4 lg:p-6 select-none font-quicksand relative overflow-hidden">
      {/* Ambient Blossom & Strawberry Lighting Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-300/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-8 left-8 text-pink-300/50 text-2xl pointer-events-none select-none">🌸</div>
      <div className="absolute bottom-8 right-8 text-pink-300/50 text-2xl pointer-events-none select-none">✨</div>

      {/* Floating Drag Proxy Follower (1:1 Board Socket Scale, Zero Finger Obstruction) */}
      {isDragging && draggedPiece && dragCoords && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${dragCoords.x}px`,
            top: `${dragCoords.y - (window.matchMedia('(pointer: coarse)').matches ? 85 : 45)}px`,
          }}
        >
          <div
            className="grid gap-1 filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.7)]"
            style={{
              gridTemplateColumns: `repeat(${draggedPiece.width}, minmax(0, 1fr))`,
            }}
          >
            {draggedPiece.layout.map((row, rIdx) =>
              row.map((val, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  style={{
                    width: `${boardCellSize}px`,
                    height: `${boardCellSize}px`,
                    boxShadow: val === 1 ? `0 0 16px ${draggedPiece.glowColor}` : undefined,
                  }}
                  className={`rounded-full transition-all relative flex items-center justify-center ${
                    val === 1
                      ? `${draggedTheme.bg} ${draggedTheme.glow} border-b-2 ${draggedTheme.borderBottom}`
                      : 'opacity-0'
                  }`}
                >
                  {val === 1 && (
                    <div className="w-2 h-2 rounded-full bg-white/90 absolute top-1 right-1 shadow-xs" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* App Main View Container (Clean Centered Mobile Canvas, Zero Side Clutter) */}
      <div className="w-full h-full min-h-[100dvh] flex items-center justify-center z-10 p-0 sm:py-3">
        {/* CENTER COLUMN: Clean mobile canvas (Rounded bento on desktop, edge-to-edge on mobile) */}
        <div className={`relative w-full h-[100dvh] max-h-[100dvh] sm:h-[min(860px,96dvh)] sm:max-h-[880px] bg-[#FFF8F7] text-[#2F121A] font-quicksand rounded-none sm:rounded-[44px] border-0 sm:border-4 border-[#FBCFE8] shadow-none sm:shadow-[0_20px_60px_rgba(255,175,190,0.35)] flex flex-col justify-between items-center overflow-hidden flex-shrink-0 transition-all duration-300 ${
          currentView === 'lobby' ? 'p-0' : 'px-2 pt-1 pb-1.5 sm:px-3 sm:py-2'
        } ${
          currentView === 'host' ? 'sm:w-[500px]' : 'sm:w-[410px]'
        }`}>

          {currentView === 'lobby' ? (
            <LobbyLandingView
              playerName={playerName}
              onPlayerNameChange={setPlayerName}
              onEnterArena={handleEnterArena}
              onOpenCreateArena={() => setIsCreateArenaOpen(true)}
              isLiveTestnet={isLiveTestnet}
              onToggleNetwork={handleToggleNetwork}
              onOpenGuide={() => setIsHelpModalOpen(true)}
              onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
              onOpenQr={() => setIsQrModalOpen(true)}
              onOpenQrScanner={() => setIsCameraScannerOpen(true)}
              onJoinRoom={handleScanQrSuccess}
              sessionAddress={sessionAddress}
              guestRoomInfo={guestRoomInfo}
              userAddress={userAddress}
              isConnectingWallet={isConnectingWallet}
              onConnectWallet={handleConnectWallet}
              onDisconnectWallet={handleDisconnectWallet}
            />
          ) : currentView === 'host' && activeArenaConfig ? (
            <HostArenaView
              config={activeArenaConfig}
              joinedPlayers={joinedPlayers}
              onStartGame={handleStartGameFromHost}
              onBackToLobby={handleBackToLobby}
            />
          ) : (
            <>
              {/* ============================================================ */}
              {/* 1. TOP BAR (Figma Exact: Pause, Best Trophy Pill, Music)     */}
              {/* ============================================================ */}
              <div className="flex-shrink-0 w-full flex items-center justify-between px-1 pt-1 pb-0.5">
                {/* Left: Pause Button */}
                <button
                  type="button"
                  onClick={() => setIsPaused(true)}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-[20px] bg-white border-2 border-[#FFD8E3] shadow-xs flex items-center justify-center text-[#9B1D3D] hover:bg-pink-50/60 active:scale-95 transition-all cursor-pointer"
                  title={language === 'id' ? 'Jeda Game' : 'Pause Game'}
                >
                  <Pause className="w-5 h-5 fill-[#9B1D3D]" />
                </button>

                {/* Center: Best Score Trophy Pill */}
                <div className="h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-white border border-[#FFD8E3] shadow-xs flex items-center gap-1.5 select-none">
                  <span className="text-sm sm:text-base">🏆</span>
                  <span className="font-comfortaa font-bold text-xs uppercase tracking-wider text-[#FF5C7A]">
                    BEST
                  </span>
                  <span className="font-comfortaa font-bold text-sm sm:text-base text-[#E11D48] tracking-tight">
                    {Math.max(score, 14850).toLocaleString()}
                  </span>
                </div>

                {/* Right: Sound / Music Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMuted(sounds.toggleMute())}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-[20px] bg-white border-2 border-[#FFD8E3] shadow-xs flex items-center justify-center text-[#FF3366] hover:bg-pink-50/60 active:scale-95 transition-all cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  <Music className="w-5 h-5" />
                </button>
              </div>

              {/* ============================================================ */}
              {/* 2. BIG SCORE DISPLAY (Figma Exact)                           */}
              {/* ============================================================ */}
              <div className="flex-shrink-0 w-full text-center mt-1 mb-1 sm:mt-1.5 sm:mb-1.5 select-none">
                <span className="font-comfortaa font-bold text-[38px] sm:text-[44px] text-[#421727] tracking-tight leading-none block">
                  {score.toLocaleString()}
                </span>
              </div>

              {/* ============================================================ */}
              {/* 3. SUB-HEADER: BLOSSOM COMBO PILL (Solo) or PLAYER CHIPS (PVP) */}
              {/* ============================================================ */}
              {!activeArenaConfig ? (
                /* SOLO MODE: Dynamic Blossom Combo Toast (Only pops up on active line blast / combo) */
                <div className="flex-shrink-0 w-full h-9 sm:h-10 flex items-center justify-center mb-1 select-none">
                  {comboNotification ? (
                    <div className="h-9 sm:h-10 px-4 rounded-full bg-gradient-to-r from-[#FF5C7A] via-[#FF758F] to-[#FBBF24] shadow-[0_4px_16px_rgba(255,92,122,0.35)] flex items-center justify-between gap-3 text-white animate-bounce">
                      <span className="font-comfortaa font-black text-xs sm:text-sm tracking-wide flex items-center gap-1.5 drop-shadow-xs">
                        <span>🌸</span>
                        <span>
                          {comboNotification.streak > 1
                            ? `BLOSSOM COMBO X${comboNotification.streak}!`
                            : 'BLOSSOM BLAST!'}
                        </span>
                      </span>
                      <span className="bg-[#FEF08A] text-[#854D0E] font-comfortaa font-bold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                        +{comboNotification.bonus} ✨
                      </span>
                    </div>
                  ) : (
                    /* Subtle minimal spacer keeping the board layout stable without clutter */
                    <div className="h-1.5 w-12 rounded-full bg-[#FFD8E3]/40" />
                  )}
                </div>
              ) : (
                /* PVP BATTLE MODE: Horizontal Player Chips (Figma Node 1225-995: P1, P2 [Active], P3, P4...) + 1-Skill Attack */
                <div className="flex-shrink-0 w-full flex flex-col items-center mb-1 sm:mb-1.5">
                  {/* Player Chips Carousel with Live Progress % */}
                  <div className="w-full overflow-x-auto scrollbar-none py-1 px-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 w-max mx-auto px-1">
                      {/* P1 (Me / Host) */}
                      <div
                        className="min-w-[44px] px-2 py-1 rounded-[16px] flex flex-col items-center justify-center font-comfortaa flex-shrink-0 bg-white border-2 border-[#FFAEC0] text-[#E11D48] shadow-xs select-none"
                        title={playerName || 'Pemain_1 (Anda)'}
                      >
                        <span className="font-bold text-[11px] sm:text-xs leading-none">P1</span>
                        <span className="text-[9px] font-extrabold text-emerald-600 leading-none mt-0.5">
                          {getPlayerFillPercent(board)}%
                        </span>
                      </div>

                      {/* Opponents P2, P3, P4... */}
                      {opponents.slice(0, currentMaxPlayers - 1).map((opp, idx) => {
                        const isSelected = selectedTargetId === opp.id;
                        const isAlive = opp.isAlive;
                        return (
                          <button
                            key={opp.id}
                            data-opponent-id={opp.id}
                            type="button"
                            onClick={() => {
                              setSelectedTargetId(opp.id);
                              sounds.playPickup();
                            }}
                            className={`min-w-[44px] px-2 py-1 rounded-[16px] flex flex-col items-center justify-center font-comfortaa flex-shrink-0 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-pink-50 border-2 border-[#FF3366] ring-2 ring-[#FF3366] text-[#FF3366] font-extrabold scale-105 shadow-sm'
                                : 'bg-white border-2 border-[#FFAEC0] text-[#E11D48] shadow-xs hover:border-[#FF5C7A]'
                            } ${!isAlive ? 'opacity-35 line-through bg-gray-50' : ''}`}
                            title={`${opp.name || `P${idx + 2}`} (${opp.boardFillPercent}% isi)`}
                          >
                            <span className="font-bold text-[11px] sm:text-xs leading-none">
                              P{idx + 2}
                            </span>
                            <span
                              className={`text-[9px] font-extrabold leading-none mt-0.5 ${
                                !isAlive
                                  ? 'text-gray-400'
                                  : opp.boardFillPercent >= 80
                                  ? 'text-rose-600 animate-pulse font-black'
                                  : 'text-[#795B6B]'
                              }`}
                            >
                              {isAlive ? `${opp.boardFillPercent}%` : '💀 KO'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 1-Skill Attack Action Button / Mana Energy Bar */}
                  <div className="w-full px-2 mt-0.5 flex items-center justify-center">
                    {mana >= 30 ? (
                      <button
                        data-single-attack-btn
                        type="button"
                        onClick={handleSingleAttack}
                        className="w-full max-w-[340px] h-10 sm:h-11 rounded-[20px] bg-gradient-to-r from-[#FF5C7A] via-[#FF3366] to-[#E11D48] text-white border-b-[5px] border-[#9F1239] shadow-[0_6px_22px_rgba(255,51,102,0.45)] hover:brightness-105 active:translate-y-1 active:border-b-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer font-comfortaa font-black text-xs sm:text-sm tracking-wider uppercase select-none animate-bounce"
                      >
                        <span className="text-base">🌸</span>
                        <span>
                          {language === 'id'
                            ? `TEMBAK [${opponents.find((o) => o.id === selectedTargetId)?.name || 'P2'}] ⚡ (KLIK UNTUK SERANG)`
                            : `STRIKE [${opponents.find((o) => o.id === selectedTargetId)?.name || 'P2'}] ⚡ (CLICK TO FIRE)`}
                        </span>
                      </button>
                    ) : (
                      <div className="w-full max-w-[340px] h-9 sm:h-10 rounded-[18px] bg-[#FFF0F4] border-2 border-[#FFD8E3] shadow-xs px-3.5 flex items-center justify-between relative overflow-hidden select-none">
                        {/* Background Energy Fill Bar with subtle shimmer */}
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#FF8DA1]/40 via-[#FF5C7A]/50 to-[#FF3366]/60 transition-all duration-300"
                          style={{ width: `${Math.min(100, (mana / 30) * 100)}%` }}
                        />
                        <div className="relative z-10 flex items-center gap-1.5 font-comfortaa font-bold text-[11px] sm:text-xs text-[#241022]">
                          <span className="text-[#E11D48]">⚡</span>
                          <span className="font-extrabold text-[#E11D48]">
                            MANA: {mana} / 30
                          </span>
                        </div>
                        <div className="relative z-10 flex items-center gap-1 font-comfortaa font-bold text-[10px] text-[#795B6B]">
                          <span>
                            {mana < 10
                              ? (language === 'id' ? '⚪⚪⚪ Pasang 3 balok' : '⚪⚪⚪ Place 3 blocks')
                              : mana < 20
                              ? (language === 'id' ? '🌸⚪⚪ Pasang 2 balok' : '🌸⚪⚪ Place 2 blocks')
                              : (language === 'id' ? '🌸🌸⚪ Pasang 1 balok!' : '🌸🌸⚪ 1 more block!')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Notice (if any) */}
              {txNotice && (
                <div className="flex-shrink-0 w-full text-center py-1 px-3 bg-pink-100 border border-pink-300 rounded-full mb-1 text-[9.5px] font-comfortaa font-bold text-[#FF4D6D] shadow-xs animate-pulse">
                  {txNotice}
                </div>
              )}

              {/* ============================================================ */}
              {/* 4. MAIN 8x8 BOARD (Calendar/Pop-it Notepad Style)             */}
              {/* ============================================================ */}
              <main
                ref={mainBoardContainerRef}
                className="flex-1 min-h-0 w-full flex items-center justify-center my-0.5 relative pt-3 pb-1"
              >
                {/* HUD Peringatan Serangan Masuk dari Combat Inbox */}
                <IncomingAttackBanner pendingAttacks={pendingAttacks} />

                <div
                  style={{
                    width: `${boardBoxSize}px`,
                    height: `${boardBoxSize}px`,
                    maxWidth: '100%',
                    maxHeight: 'calc(100% - 20px)',
                  }}
                  className="relative aspect-square flex items-center justify-center mt-1"
                >
                  <Board3D
                    ref={board3DRef}
                    board={board}
                    sabotageMask={sabotageMask}
                    ghostMask={ghostMask}
                    isGhostValid={isGhostValid}
                    clearingRows={clearingRows}
                    clearingCols={clearingCols}
                    cellColors={cellColors}
                    clearBanner={clearBanner}
                    isShaking={isShaking}
                    onCellClick={handleCellClick}
                  />
                </div>
              </main>

              {/* ============================================================ */}
              {/* 5. HAND TRAY (3 Piece Slots Spawner Dock)                     */}
              {/* ============================================================ */}
              <footer className="flex-shrink-0 w-full pb-1 flex flex-col items-center">
                <HandTray
                  pieces={pieces}
                  used={used}
                  canFit={piecesCanFit}
                  selectedSlot={selectedSlot}
                  draggedSlot={isDragging ? draggedSlot : null}
                  onSelectSlot={(slot) => setSelectedSlot(slot)}
                  onDragStart={handleDragStart}
                />
              </footer>
            </>
          )}

          {/* Game Pause Modal */}
          <GamePauseModal
            isOpen={isPaused}
            score={score}
            isMuted={isMuted}
            onResume={() => setIsPaused(false)}
            onRestart={() => {
              setIsPaused(false);
              handleRestart();
            }}
            onBackToLobby={() => {
              setIsPaused(false);
              handleBackToLobby();
            }}
            onToggleMute={() => setIsMuted(sounds.toggleMute())}
          />

          {/* Game Over Modal */}
          {isGameOver && (
            <GameOverModal
              isWinner={isWinner}
              rank={rank}
              score={score}
              prizeMon={calculatedPrize}
              maxCombo={maxCombo}
              sabotageCount={sabotageSentCount}
              playerName={playerName}
              maxPlayers={currentMaxPlayers}
              onRestart={handleRestart}
              onBackToLobby={handleBackToLobby}
            />
          )}
        </div>
      </div>

      {/* Visual Projectile Laser Beams (Sabotage VFX) */}
      <LaserBeams
        beams={activeBeams}
        onBeamComplete={(id) => setActiveBeams((prev) => prev.filter((b) => b.id !== id))}
      />

      {/* Screen Red Flash Vignette on Incoming Sabotage Hit */}
      {isAttackedFlash && (
        <div className="fixed inset-0 pointer-events-none z-50 border-[8px] border-rose-500/70 bg-rose-500/15 animate-ping transition-all" />
      )}

      {/* Stage Presentation QR Code Modal */}
      <LobbyQRModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      {/* 15-Second Quick Guide Modal for Judges */}
      <HowToPlayModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onOpenQr={() => setIsQrModalOpen(true)}
      />

      {/* 10-Slide Interactive Stage Pitch Deck Modal */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

      {/* Host Tournament Arena Creation Modal (P2P Buy-in vs Sponsored Bounty) */}
      <CreateArenaModal
        isOpen={isCreateArenaOpen}
        onClose={() => setIsCreateArenaOpen(false)}
        hostName={playerName}
        onCreateArena={handleCreateArena}
      />

      {/* Live Camera QR Scanner Modal (Mobile / MetaMask in-app / Desktop) */}
      <CameraQrScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScanSuccess={handleScanQrSuccess}
      />
    </div>
  );
}

export default App;
