// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {PlayerState, RoundConfig, RoundStatus, AttackType} from "./Structs.sol";
import {BlitzGridPieces} from "./BlitzGridPieces.sol";
import {IBlitzGridCombat} from "./interfaces/IBlitzGridCombat.sol";
import {IBlitzGridVault} from "./interfaces/IBlitzGridVault.sol";
import {IBlitzGridGame} from "./interfaces/IBlitzGridGame.sol";

/**
 * @title BlitzGridGame
 * @notice Game Core Engine untuk BlitzGrid di Monad.
 *         Menerapkan penyimpanan papan uint64, logika bitwise collision & line clears,
 *         Mempool Mana engine, dan matchmaking terisolasi.
 */
contract BlitzGridGame is IBlitzGridGame {
    uint64 private constant ROW_MASK = 0xFF;
    uint64 private constant COL_MASK = 0x0101010101010101;
    uint32 public constant AFK_TIMEOUT = 8 seconds;
    uint32 public constant GLITCH_STONE_COST = 30;

    IBlitzGridCombat public immutable COMBAT_MODULE;
    IBlitzGridVault public immutable VAULT_MODULE;

    uint256 public nextRoundId = 1;

    mapping(uint256 => RoundConfig) public roundConfigs;
    mapping(uint256 => RoundStatus) public roundStatuses;
    mapping(uint256 => bytes32) public roundSeeds;
    mapping(uint256 => uint32) public roundStartTimes;
    mapping(uint256 => address[]) public roundPlayers;
    mapping(uint256 => uint256) public activePlayersCount;

    // roundId => player => PlayerState (Storage Terisolasi 100% Monad Parallel)
    mapping(uint256 => mapping(address => PlayerState)) public playerStates;

    // Podium ranks per round
    mapping(uint256 => address) public champions;
    mapping(uint256 => address) public runnersUp;
    mapping(uint256 => address) public thirdPlaces;

    constructor(address _combatModule, address _vaultModule) {
        require(_combatModule != address(0), "Invalid combat");
        require(_vaultModule != address(0), "Invalid vault");
        COMBAT_MODULE = IBlitzGridCombat(_combatModule);
        VAULT_MODULE = IBlitzGridVault(_vaultModule);
    }

    /**
     * @notice Membuat arena ronde baru.
     */
    function createRound(RoundConfig calldata config) external override returns (uint256 roundId) {
        require(config.maxPlayers >= 2 && config.maxPlayers <= 32, "Invalid maxPlayers");
        require(config.durationSeconds >= 30, "Duration too short");

        roundId = nextRoundId++;
        roundConfigs[roundId] = config;
        roundStatuses[roundId] = RoundStatus.MATCHMAKING;

        emit RoundCreated(roundId, config.maxPlayers, config.entryFee);
    }

    /**
     * @notice Pemain bergabung ke ronde pertandingan.
     */
    function joinRound(uint256 roundId) external payable override {
        require(roundStatuses[roundId] == RoundStatus.MATCHMAKING, "Not in matchmaking");
        RoundConfig memory config = roundConfigs[roundId];
        require(msg.value == config.entryFee, "Incorrect entry fee");
        require(roundPlayers[roundId].length < config.maxPlayers, "Lobby is full");

        PlayerState storage state = playerStates[roundId][msg.sender];
        require(!state.isAlive && state.lastMoveTimestamp == 0, "Already joined");

        // Inisialisasi state pemain
        state.isAlive = true;
        state.board = 0;
        state.mana = 0;
        state.score = 0;
        state.comboStreak = 0;
        state.handCycle = 0;
        state.usedPiecesMask = 0;
        state.koBadges = 0;
        state.lastMoveTimestamp = uint32(block.timestamp);
        state.finishRank = 0;

        roundPlayers[roundId].push(msg.sender);
        activePlayersCount[roundId] += 1;

        if (msg.value > 0) {
            VAULT_MODULE.depositEntry{value: msg.value}(roundId);
        }

        emit PlayerJoined(roundId, msg.sender);

        // Jika lobi penuh, otomatis mulai ronde
        if (roundPlayers[roundId].length == config.maxPlayers) {
            _startRound(roundId);
        }
    }

    /**
     * @notice Memulai ronde pertandingan secara manual (oleh host atau jika pemain cukup).
     */
    function startRound(uint256 roundId) external override {
        require(roundStatuses[roundId] == RoundStatus.MATCHMAKING, "Not in matchmaking");
        require(roundPlayers[roundId].length >= 2, "Need at least 2 players");
        _startRound(roundId);
    }

    function _startRound(uint256 roundId) internal {
        roundStatuses[roundId] = RoundStatus.ACTIVE;
        bytes32 seed = keccak256(
            abi.encodePacked(block.prevrandao, block.timestamp, roundId)
        );
        roundSeeds[roundId] = seed;
        roundStartTimes[roundId] = uint32(block.timestamp);

        // Update lastMoveTimestamp untuk seluruh pemain terdaftar
        address[] memory players = roundPlayers[roundId];
        for (uint256 i = 0; i < players.length; i++) {
            playerStates[roundId][players[i]].lastMoveTimestamp = uint32(block.timestamp);
        }

        emit RoundStarted(roundId, seed, uint32(block.timestamp));
    }

    /**
     * @notice Mengeksekusi penempatan balok secara bitwise di atas grid 8x8.
     * @dev Fungsi ini HANYA menulis ke slot playerStates[roundId][msg.sender].
     */
    function makeMove(
        uint256 roundId,
        uint8 pieceSlot,
        uint8 x,
        uint8 y
    ) external override {
        require(roundStatuses[roundId] == RoundStatus.ACTIVE, "Round not active");
        PlayerState storage state = playerStates[roundId][msg.sender];
        require(state.isAlive, "Player eliminated");
        require(pieceSlot < 3, "Invalid pieceSlot");
        require(((state.usedPiecesMask >> pieceSlot) & 1) == 0, "Piece slot already used");

        // 1. Konsumsi sabotase yang masuk dari Combat Inbox (milik sendiri)
        uint64 incomingSabotage = COMBAT_MODULE.consumeInbox(roundId, msg.sender);
        if (incomingSabotage != 0) {
            state.board |= incomingSabotage;
        }

        // 2. Ambil ID balok deterministik dan masker bitwise pada (x, y)
        uint8 pieceId = BlitzGridPieces.getDeterministicPiece(
            roundSeeds[roundId],
            msg.sender,
            state.handCycle,
            pieceSlot
        );
        uint64 pieceMask = BlitzGridPieces.getMaskAt(pieceId, x, y);

        // 3. Validasi Tabrakan Bitwise (Hanya 1 operasi AND + ISZERO)
        require((state.board & pieceMask) == 0, "Move Invalid: Collision Detected");

        // 4. Pasang Balok (Hanya 1 operasi OR)
        uint64 currentBoard = state.board | pieceMask;

        // 5. Periksa dan Ledakkan Garis (Row & Column Clearance Simultan)
        uint8 linesCleared = 0;
        uint64 clearMask = 0;

        // Cek 8 Baris
        for (uint8 r = 0; r < 8; r++) {
            uint64 rMask = ROW_MASK << (r * 8);
            if ((currentBoard & rMask) == rMask) {
                clearMask |= rMask;
                linesCleared++;
            }
        }

        // Cek 8 Kolom
        for (uint8 c = 0; c < 8; c++) {
            uint64 cMask = COL_MASK << c;
            if ((currentBoard & cMask) == cMask) {
                clearMask |= cMask;
                linesCleared++;
            }
        }

        // Hapus seluruh baris dan kolom yang penuh secara simultan
        currentBoard &= ~clearMask;

        // 6. Perhitungan Kombo & Distribusi Mana
        if (linesCleared > 0) {
            state.comboStreak += 1;
            uint32 baseMana = linesCleared == 1 ? 10 : (linesCleared == 2 ? 25 : (linesCleared == 3 ? 50 : 80));
            uint32 earnedMana = (baseMana * (10 + (uint32(state.comboStreak) * 5))) / 10;
            state.mana += earnedMana;
            state.score += uint16(linesCleared * 10 * state.comboStreak);
            emit ComboScored(roundId, msg.sender, state.comboStreak, earnedMana);
        } else {
            state.comboStreak = 0;
            state.score += 5;
        }

        // 7. Perbarui Balok Tangan (Hand Cycle)
        state.usedPiecesMask |= uint8(uint256(1) << pieceSlot);
        if (state.usedPiecesMask == 7) {
            // Seluruh 3 balok di tangan sudah terpasang
            state.usedPiecesMask = 0;
            state.handCycle += 1;
        }

        state.board = currentBoard;
        state.lastMoveTimestamp = uint32(block.timestamp);

        emit PiecePlaced(roundId, msg.sender, currentBoard, linesCleared);
    }

    /**
     * @notice Menembakkan Glitch Stone sabotase ke pemain lawan.
     */
    function fireSabotage(
        uint256 roundId,
        address target,
        uint8 targetBitPosition
    ) external override {
        require(roundStatuses[roundId] == RoundStatus.ACTIVE, "Round not active");
        PlayerState storage attackerState = playerStates[roundId][msg.sender];
        require(attackerState.isAlive, "Attacker eliminated");
        require(attackerState.mana >= GLITCH_STONE_COST, "Insufficient mana");
        require(target != msg.sender, "Cannot attack self");

        PlayerState storage targetState = playerStates[roundId][target];
        require(targetState.isAlive, "Target already eliminated");

        attackerState.mana -= GLITCH_STONE_COST;

        COMBAT_MODULE.fireWeapon(
            roundId,
            target,
            AttackType.GLITCH_STONE,
            targetBitPosition
        );
    }

    /**
     * @notice Mengeliminasi pemain yang AFK melebihi batas waktu giliran (4s + toleransi = 8s).
     */
    function claimTimeout(uint256 roundId, address target) external override {
        require(roundStatuses[roundId] == RoundStatus.ACTIVE, "Round not active");
        PlayerState storage targetState = playerStates[roundId][target];
        require(targetState.isAlive, "Target already eliminated");
        require(block.timestamp > targetState.lastMoveTimestamp + AFK_TIMEOUT, "Target not timed out");

        _eliminatePlayer(roundId, target);
    }

    /**
     * @notice Logika internal eliminasi pemain dan pemutusan pemenang.
     */
    function _eliminatePlayer(uint256 roundId, address player) internal {
        PlayerState storage state = playerStates[roundId][player];
        state.isAlive = false;

        uint256 rank = activePlayersCount[roundId];
        // casting to 'uint8' is safe because maxPlayers <= 32
        // forge-lint: disable-next-line(unsafe-typecast)
        state.finishRank = uint8(rank);
        activePlayersCount[roundId] = rank - 1;

        if (rank == 3) {
            thirdPlaces[roundId] = player;
        } else if (rank == 2) {
            runnersUp[roundId] = player;
        }

        // forge-lint: disable-next-line(unsafe-typecast)
        emit PlayerEliminated(roundId, player, uint8(rank));

        // Jika tersisa 1 pemain hidup -> JUARA DITEMUKAN!
        if (activePlayersCount[roundId] == 1) {
            _finalizeWinner(roundId);
        }
    }

    function _finalizeWinner(uint256 roundId) internal {
        roundStatuses[roundId] = RoundStatus.COMPLETED;

        // Cari pemain yang masih hidup sebagai juara
        address champion = address(0);
        address[] memory players = roundPlayers[roundId];
        for (uint256 i = 0; i < players.length; i++) {
            if (playerStates[roundId][players[i]].isAlive) {
                champion = players[i];
                playerStates[roundId][champion].finishRank = 1;
                break;
            }
        }

        champions[roundId] = champion;
        emit RoundEnded(roundId, champion);

        // Settle pot hadiah atomik via BlitzGridVault
        VAULT_MODULE.settleRound(
            roundId,
            champion,
            runnersUp[roundId],
            thirdPlaces[roundId]
        );
    }

    // --- VIEW FUNCTIONS ---

    function getPlayerState(uint256 roundId, address player)
        external
        view
        override
        returns (PlayerState memory)
    {
        return playerStates[roundId][player];
    }

    function getHandPieces(uint256 roundId, address player)
        external
        view
        override
        returns (uint8[3] memory pieces, bool[3] memory used)
    {
        PlayerState memory state = playerStates[roundId][player];
        bytes32 seed = roundSeeds[roundId];

        for (uint8 i = 0; i < 3; i++) {
            pieces[i] = BlitzGridPieces.getDeterministicPiece(seed, player, state.handCycle, i);
            used[i] = ((state.usedPiecesMask >> i) & 1) != 0;
        }
    }

    function getRoundPlayers(uint256 roundId) external view returns (address[] memory) {
        return roundPlayers[roundId];
    }
}
