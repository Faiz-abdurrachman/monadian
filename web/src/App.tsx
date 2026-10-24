import { useState, useEffect, useCallback, useRef } from 'react';
import { Board3D, Board3DHandle, getPieceThemeIndex, CANDY_THEMES } from './components/Board3D';
import { HandTray } from './components/HandTray';
import { HUD } from './components/HUD';
import { WeaponsDock } from './components/WeaponsDock';
import { MiniRadars } from './components/MiniRadars';
import { GameOverModal } from './components/GameOverModal';
import { LaserBeams, BeamInstance } from './components/LaserBeams';
import { IncomingAttackBanner } from './components/IncomingAttackBanner';
import { LobbyQRModal } from './components/LobbyQRModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { PitchDeckModal } from './components/PitchDeckModal';
import { LobbyLandingView, GuestRoomInfo } from './components/LobbyLandingView';
import { CreateArenaModal, ArenaConfig } from './components/CreateArenaModal';
import { HostArenaView } from './components/HostArenaView';
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
import { Trophy, HelpCircle, Home } from 'lucide-react';
import { useLanguage } from './locales/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';

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
  const { t, language } = useLanguage();

  // View State (Lobby Landing vs Host Screen vs Battle Arena)
  const [currentView, setCurrentView] = useState<'lobby' | 'host' | 'game'>('lobby');
  const [playerName, setPlayerName] = useState<string>('Pemain_1');

  // Tournament Arena State (Mode 1: P2P Buy-in vs Mode 2: Sponsored Bounty)
  const [isCreateArenaOpen, setIsCreateArenaOpen] = useState<boolean>(false);
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

  // Inisialisasi EIP-7702 Ephemeral Session Key saat startup
  useEffect(() => {
    const s = sessionEngine.loadOrCreateSessionKey();
    setSessionAddress(s.address);
    const existingUser = sessionEngine.getUserAddress();
    if (existingUser) setUserAddress(existingUser);

    // Cek parameter undangan room (?room=101&mode=sponsored&pot=1.5)
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
      }
    }
  }, []);

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
    if (currentView !== 'game' || isGameOver) return;
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
  }, [currentView, isGameOver]);

  // Simulated Battle Royale Opponent Activity & Asynchronous Combat Inbox Loop
  useEffect(() => {
    if (currentView !== 'game' || isGameOver) return;
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
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([40, 50, 40]);
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

  // Visual Projectile Laser Beam Trigger
  const triggerLaserBeam = (type: WeaponType, targetId: string) => {
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight - 100;
    let endX = window.innerWidth / 2;
    let endY = 80;

    const dockEl = document.querySelector(`[data-weapon-type="${type}"]`);
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
      color: type === 'toxic' ? '#10b981' : type === 'frost' ? '#67e8f9' : '#38bdf8',
    };

    setActiveBeams((prev) => [...prev, newBeam]);
  };

  // Sabotage Weapon 1: Glitch Stone (30 Mana)
  const handleFireGlitchStone = () => {
    if (mana < 30 || !selectedTargetId) return;
    setMana((m) => m - 30);
    sounds.playSabotage();
    triggerLaserBeam('glitch', selectedTargetId);
    setSabotageSentCount((c) => c + 1);

    setOpponents((prev) =>
      prev.map((opp) => {
        if (opp.id === selectedTargetId) {
          const newFill = Math.min(94, opp.boardFillPercent + 15);
          return { ...opp, boardFillPercent: newFill, sabotaged: true };
        }
        return opp;
      })
    );
  };

  // Sabotage Weapon 2: Toxic Hand (60 Mana)
  const handleFireToxicHand = () => {
    if (mana < 60 || !selectedTargetId) return;
    setMana((m) => m - 60);
    sounds.playSabotage();
    triggerLaserBeam('toxic', selectedTargetId);
    setSabotageSentCount((c) => c + 1);

    setOpponents((prev) =>
      prev.map((opp) => {
        if (opp.id === selectedTargetId) {
          const newFill = Math.min(94, opp.boardFillPercent + 25);
          return { ...opp, boardFillPercent: newFill, sabotaged: true };
        }
        return opp;
      })
    );
  };

  // Sabotage Weapon 3: Frost Lock (90 Mana)
  const handleFireFrostLock = () => {
    if (mana < 90 || !selectedTargetId) return;
    setMana((m) => m - 90);
    sounds.playSabotage();
    triggerLaserBeam('frost', selectedTargetId);
    setSabotageSentCount((c) => c + 1);

    setOpponents((prev) =>
      prev.map((opp) => {
        if (opp.id === selectedTargetId) {
          return { ...opp, sabotaged: true, boardFillPercent: Math.min(94, opp.boardFillPercent + 35) };
        }
        return opp;
      })
    );
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
        if (prev.length === 1) return [...prev, 'Juri_UGM_1'];
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
      (window as any).__blitzgrid = {
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

  const alivePlayers = opponents.filter((o) => o.isAlive).length + (isGameOver ? 0 : 1);
  const targetOpponent = opponents.find((o) => o.id === selectedTargetId);
  const targetDisplayName = targetOpponent
    ? targetOpponent.id.startsWith('bot-')
      ? `${t.radars.playerPrefix}_${parseInt(targetOpponent.id.replace('bot-', '')) + 1}`
      : targetOpponent.name || 'TARGET'
    : 'TARGET';
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
                  className={`rounded-[10px] transition-all relative flex items-center justify-center ${
                    val === 1
                      ? `${draggedTheme.bg} ${draggedTheme.glow} border-2 border-white/90`
                      : 'opacity-0'
                  }`}
                >
                  {val === 1 && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-white/80 absolute top-1 right-1 shadow-xs" />
                      <div className="w-3/5 h-2/5 rounded-[4px] bg-white/40 backdrop-blur-[0.5px] border-t border-l border-white/80 mx-auto mt-0.5" />
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Presentation Stage Container (3 Columns on Large Displays) */}
      <div className="w-full max-w-7xl h-full xl:h-[min(860px,96dvh)] flex items-center justify-center gap-4 xl:gap-8 z-10 px-2 sm:px-4">

        {/* LEFT PANEL: Monad Hackathon Highlights (Ultra-Clean, Rounded Bento) */}
        {currentView !== 'host' && (
          <aside className="hidden xl:flex flex-col w-[300px] justify-center gap-4 py-2">
            <div className="bg-white/95 backdrop-blur-xl border-2 border-[#FCE7F3] rounded-[38px] p-6 shadow-[0_12px_35px_rgba(255,175,190,0.25)] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-comfortaa font-bold tracking-wider text-[#FF4D6D] uppercase bg-pink-100 border border-pink-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] animate-ping" />
                  MONAD BLITZ
                </span>
                <span className="text-[10px] font-comfortaa font-bold text-[#FF4D6D] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">GIK UGM</span>
              </div>

              <div>
                <h2 className="font-comfortaa font-bold text-2xl text-[#2F121A] tracking-tight">
                  BLITZGRID
                </h2>
                <p className="text-xs text-[#574144] mt-0.5 font-medium leading-relaxed">
                  100% On-Chain Puzzle Royale
                </p>
              </div>

              <div className="h-px bg-pink-100/80 w-full" />

              {/* 3 Simple Rounded Pills (No wall of text) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#FFF8FA] border border-pink-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <span className="font-comfortaa font-bold text-xs text-[#2F121A]">uint64 Board</span>
                  </div>
                  <span className="text-[9.5px] font-mono font-bold text-[#FF4D6D] bg-pink-100 px-2 py-0.5 rounded-full">&lt; 3.5k Gas</span>
                </div>

                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#FFF8FA] border border-pink-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚔️</span>
                    <span className="font-comfortaa font-bold text-xs text-[#2F121A]">Async Combat</span>
                  </div>
                  <span className="text-[9.5px] font-mono font-bold text-[#FF4D6D] bg-rose-100 px-2 py-0.5 rounded-full">Parallel</span>
                </div>

                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#FFF8FA] border border-pink-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔑</span>
                    <span className="font-comfortaa font-bold text-xs text-[#2F121A]">Session Keys</span>
                  </div>
                  <span className="text-[9.5px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">0 Pop-Up</span>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* CENTER COLUMN: Sleek Smartphone Frame Mockup on Desktop (Expands smoothly in Host Stage View) */}
        <div className={`relative w-full h-[100dvh] max-h-[100dvh] xl:h-[min(840px,94dvh)] xl:max-h-[860px] bg-[#FFF8F7] text-[#2F121A] font-quicksand rounded-none xl:rounded-[42px] border-0 xl:border-[6px] border-[#FBCFE8] shadow-none xl:shadow-[0_15px_60px_rgba(255,175,190,0.4)] px-2 pt-1 pb-1.5 sm:px-3 sm:py-2 flex flex-col justify-between items-center overflow-hidden flex-shrink-0 transition-all duration-300 ${
          currentView === 'host' ? 'xl:w-[500px]' : 'xl:w-[440px]'
        }`}>
          
          {/* Smartphone Dynamic Island Notch (Desktop XL Only) */}
          <div className="hidden xl:flex flex-shrink-0 w-full items-center justify-between px-4 pt-1 pb-1 text-[#574144]">
            <span className="text-[11px] font-comfortaa font-bold">09:41</span>
            <div className="w-20 h-4 bg-pink-100 rounded-full border border-pink-200 flex items-center justify-center shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-comfortaa font-bold">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

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
              {/* Clean Kawaii Top Header (In-Game: Minimal, Curved & Focused) */}
              <header className="flex-shrink-0 w-full flex items-center justify-between py-1.5 px-3 bg-white/95 backdrop-blur-md border-2 border-pink-100 shadow-xs rounded-full my-0.5">
                {/* Back to Lobby Button */}
                <button
                  onClick={handleBackToLobby}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 hover:bg-pink-200 text-[#FF4D6D] text-[10px] font-comfortaa font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  title={language === 'id' ? 'Kembali ke Lobi' : 'Back to Lobby'}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>LOBBY</span>
                </button>

                {/* Center Title & EIP-7702 Status */}
                <div className="flex items-center gap-1.5">
                  <span className="font-comfortaa font-bold text-xs tracking-wider text-[#2F121A] uppercase">
                    PUZZLE ROYALE
                  </span>
                  {isLiveTestnet && sessionAddress && (
                    <span className="text-[8px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                      EIP-7702
                    </span>
                  )}
                </div>

                {/* Right Controls: Lang & Guide */}
                <div className="flex items-center gap-1.5">
                  <LanguageToggle />
                  <button
                    onClick={() => setIsHelpModalOpen(true)}
                    className="w-7 h-7 rounded-full bg-white border border-pink-200 shadow-xs flex items-center justify-center text-[#574144] hover:text-[#FF4D6D] hover:bg-pink-50 active:scale-95 transition-all cursor-pointer"
                    title={t.header.guideBtn}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  </button>
                </div>
              </header>

              {/* Status Notice (if any) */}
              {txNotice && (
                <div className="flex-shrink-0 w-full text-center py-1 px-3 bg-pink-100 border border-pink-300 rounded-full mb-0.5 text-[9.5px] font-comfortaa font-bold text-[#FF4D6D] shadow-xs animate-pulse">
                  {txNotice}
                </div>
              )}

              {/* 15 Opponent Radars */}
              <section className="flex-shrink-0 w-full">
                <MiniRadars
                  opponents={opponents}
                  selectedTargetId={selectedTargetId}
                  onSelectTarget={setSelectedTargetId}
                />
              </section>

              {/* Heads-Up Display (HUD) */}
              <section className="flex-shrink-0 w-full my-0.5">
                <HUD
                  score={score}
                  mana={mana}
                  comboStreak={comboStreak}
                  timeLeft={timeLeft}
                  aliveCount={alivePlayers}
                  totalPlayers={currentMaxPlayers}
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted(sounds.toggleMute())}
                  incomingSabotageCount={pendingAttacks.length}
                />
              </section>

              {/* 3D Chunky Voxel Board (Dynamic Two-Way Fitting, Zero Overlap Guaranteed) */}
              <main
                ref={mainBoardContainerRef}
                className="flex-1 min-h-0 w-full flex items-center justify-center my-0.5 relative pt-4 pb-1"
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
                  className="relative aspect-square flex items-center justify-center drop-shadow-[0_12px_28px_rgba(255,175,190,0.4)] mt-2"
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
                  />
                </div>
              </main>

              {/* Sabotage Weapons Dock */}
              <section className="flex-shrink-0 w-full mb-0.5">
                <WeaponsDock
                  mana={mana}
                  onFireGlitchStone={handleFireGlitchStone}
                  onFireToxicHand={handleFireToxicHand}
                  onFireFrostLock={handleFireFrostLock}
                  targetName={targetDisplayName}
                />
              </section>

              {/* 3 Pieces Hand Tray (STRICTLY Drag & Drop Only) */}
              <footer className="flex-shrink-0 w-full pb-0.5 flex flex-col items-center">
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

          {/* Phone Bottom Home Bar (Desktop Only) */}
          <div className="hidden xl:block flex-shrink-0 w-28 h-1 bg-pink-300/60 rounded-full mx-auto my-0.5" />

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

        {/* RIGHT PANEL: Tournament Vault & Arsenal (Ultra-Clean, Rounded Bento) */}
        {currentView !== 'host' && (
          <aside className="hidden xl:flex flex-col w-[300px] justify-center gap-4 py-2">
          <div className="bg-white/95 backdrop-blur-xl border-2 border-[#FCE7F3] rounded-[38px] p-6 shadow-[0_12px_35px_rgba(255,175,190,0.25)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-comfortaa font-bold tracking-wider text-amber-800 uppercase bg-amber-100 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Trophy className="w-3 h-3 text-amber-600" />
                VAULT ESCROW
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {activeArenaConfig?.prizeScheme === 'winnerTakesAll' || currentMaxPlayers === 2 ? 'WINNER 95%' : 'PODIUM TOP-3'}
              </span>
            </div>

            <div>
              <span className="font-comfortaa font-black text-3xl text-amber-800 tracking-tight block">
                {displayPot.toFixed(2)} MON
              </span>
              <span className="text-xs text-[#574144] font-medium">
                {language === 'id' ? 'Hadiah Terkunci Turnamen' : 'Tournament Prize Pool'}
              </span>
            </div>

            {/* Dynamic Prize distribution breakdown */}
            {activeArenaConfig?.prizeScheme === 'winnerTakesAll' || currentMaxPlayers === 2 ? (
              <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-[#FFF8FA] border border-pink-100 text-[10px] font-comfortaa font-bold text-center">
                <div className="flex-1 py-1 rounded-xl bg-amber-100 text-amber-900">🏆 95% Juara 1</div>
                <div className="w-20 py-1 rounded-xl bg-rose-100 text-[#FF4D6D]">🏛️ 5% Vault</div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-1 p-1.5 rounded-2xl bg-[#FFF8FA] border border-pink-100 text-[10px] font-comfortaa font-bold text-center">
                <div className="flex-1 py-1 rounded-xl bg-amber-100/70 text-amber-900">🥇 65%</div>
                <div className="flex-1 py-1 rounded-xl bg-pink-100/70 text-[#2F121A]">🥈 20%</div>
                <div className="flex-1 py-1 rounded-xl bg-pink-100/70 text-[#2F121A]">🥉 10%</div>
                <div className="flex-1 py-1 rounded-xl bg-rose-100/70 text-[#FF4D6D]">🏛️ 5%</div>
              </div>
            )}

            <div className="h-px bg-pink-100/80 w-full" />

            {/* Sabotage Weapons Quick Dock */}
            <div>
              <span className="text-[10px] font-comfortaa font-bold uppercase tracking-wider text-[#FF4D6D] block mb-2">
                SABOTAGE ARSENAL
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#FFF8FA] border border-pink-100 text-center">
                  <span className="text-base mb-0.5">⚡</span>
                  <span className="font-comfortaa font-bold text-[10px] text-[#2F121A]">Glitch</span>
                  <span className="text-[8.5px] font-mono text-[#0369A1] font-bold">30 Mana</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#FFF8FA] border border-pink-100 text-center">
                  <span className="text-base mb-0.5">🧪</span>
                  <span className="font-comfortaa font-bold text-[10px] text-[#2F121A]">Toxic</span>
                  <span className="text-[8.5px] font-mono text-rose-600 font-bold">60 Mana</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#FFF8FA] border border-pink-100 text-center">
                  <span className="text-base mb-0.5">❄️</span>
                  <span className="font-comfortaa font-bold text-[10px] text-[#2F121A]">Frost</span>
                  <span className="text-[8.5px] font-mono text-indigo-600 font-bold">90 Mana</span>
                </div>
              </div>
            </div>
          </div>
          </aside>
        )}

      </div>

      {/* Visual Projectile Laser Beams (Sabotage VFX) */}
      <LaserBeams
        beams={activeBeams}
        onBeamComplete={(id) => setActiveBeams((prev) => prev.filter((b) => b.id !== id))}
      />

      {/* Stage Presentation QR Code Modal */}
      <LobbyQRModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      {/* 15-Second Quick Guide Modal for Judges */}
      <HowToPlayModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
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
    </div>
  );
}

export default App;
