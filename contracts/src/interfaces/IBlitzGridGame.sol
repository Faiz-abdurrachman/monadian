// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {PlayerState, RoundConfig} from "../Structs.sol";

interface IBlitzGridGame {
    event RoundCreated(uint256 indexed roundId, uint16 maxPlayers, uint256 entryFee);
    event PlayerJoined(uint256 indexed roundId, address indexed player);
    event RoundStarted(uint256 indexed roundId, bytes32 seed, uint32 startTime);
    event PiecePlaced(uint256 indexed roundId, address indexed player, uint64 newBoard, uint8 linesCleared);
    event ComboScored(uint256 indexed roundId, address indexed player, uint8 streak, uint32 manaEarned);
    event PlayerEliminated(uint256 indexed roundId, address indexed player, uint8 rank);
    event RoundEnded(uint256 indexed roundId, address champion);

    function createRound(RoundConfig calldata config) external returns (uint256 roundId);
    function joinRound(uint256 roundId) external payable;
    function startRound(uint256 roundId) external;

    function makeMove(uint256 roundId, uint8 pieceSlot, uint8 x, uint8 y) external;
    function fireSabotage(uint256 roundId, address target, uint8 targetBitPosition) external;
    function claimTimeout(uint256 roundId, address target) external;

    function getPlayerState(uint256 roundId, address player) external view returns (PlayerState memory);
    function getHandPieces(uint256 roundId, address player) external view returns (uint8[3] memory pieces, bool[3] memory used);
}
