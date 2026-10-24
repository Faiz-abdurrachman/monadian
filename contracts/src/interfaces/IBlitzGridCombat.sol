// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {AttackType} from "../Structs.sol";

interface IBlitzGridCombat {
    event AttackDispatched(
        uint256 indexed roundId,
        address indexed attacker,
        address indexed target,
        AttackType weapon,
        uint8 stoneCount
    );

    function fireWeapon(
        uint256 roundId,
        address target,
        AttackType weapon,
        uint8 targetBitPosition
    ) external;

    function consumeInbox(uint256 roundId, address player) external returns (uint64 stones);

    function getPendingInbox(uint256 roundId, address target) external view returns (uint64);
}
