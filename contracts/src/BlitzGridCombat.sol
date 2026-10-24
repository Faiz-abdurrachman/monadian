// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {AttackType} from "./Structs.sol";
import {IBlitzGridCombat} from "./interfaces/IBlitzGridCombat.sol";

/**
 * @title BlitzGridCombat
 * @notice Pola Asynchronous Combat Inbox: Memisahkan penulisan serangan dari state target
 *         sehingga validator Monad dapat mengeksekusi semua transaksi pemain secara murni paralel.
 */
contract BlitzGridCombat is IBlitzGridCombat {
    address public gameContract;

    // roundId => target => pendingStonesMask (uint64)
    mapping(uint256 => mapping(address => uint64)) public targetInboxes;

    modifier onlyGame() {
        _onlyGame();
        _;
    }

    function _onlyGame() internal view {
        require(msg.sender == gameContract, "Only game contract");
    }

    constructor() {}

    function setGameContract(address _gameContract) external {
        require(gameContract == address(0), "Game contract already set");
        require(_gameContract != address(0), "Invalid address");
        gameContract = _gameContract;
    }

    /**
     * @notice Menembakkan senjata sabotase ke inbox pemain target.
     * @dev HANYA menulis ke slot targetInboxes (tidak menyentuh board atau slot memori lain).
     */
    function fireWeapon(
        uint256 roundId,
        address target,
        AttackType weapon,
        uint8 targetBitPosition
    ) external override {
        require(msg.sender == gameContract || msg.sender != target, "Cannot attack self");
        require(targetBitPosition < 64, "Invalid target bit");

        uint64 stoneBit = uint64(1) << targetBitPosition;
        targetInboxes[roundId][target] |= stoneBit;

        emit AttackDispatched(roundId, msg.sender, target, weapon, 1);
    }

    /**
     * @notice Mengonsumsi seluruh serangan masuk yang terkumpul di inbox pemain.
     * @dev Hanya dapat dipanggil oleh BlitzGridGame saat pemain target mengeksekusi gilirannya.
     */
    function consumeInbox(uint256 roundId, address player)
        external
        override
        onlyGame
        returns (uint64 stones)
    {
        stones = targetInboxes[roundId][player];
        if (stones != 0) {
            targetInboxes[roundId][player] = 0;
        }
    }

    /**
     * @notice Melihat status serangan tertunda di inbox target.
     */
    function getPendingInbox(uint256 roundId, address target)
        external
        view
        override
        returns (uint64)
    {
        return targetInboxes[roundId][target];
    }
}
