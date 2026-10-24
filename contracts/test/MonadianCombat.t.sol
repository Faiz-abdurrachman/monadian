// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {MonadianCombat} from "../src/MonadianCombat.sol";
import {AttackType} from "../src/Structs.sol";

contract MonadianCombatTest is Test {
    MonadianCombat public combat;
    address public gameContract = address(0x9999);
    address public playerA = address(0xAAAA);
    address public playerB = address(0xBBBB);

    function setUp() public {
        combat = new MonadianCombat();
        combat.setGameContract(gameContract);
    }

    function test_FireWeapon_InboxIsolation() public {
        uint256 roundId = 1;
        uint8 bitPos = 12; // Koordinat petak (4, 1) -> 1 * 8 + 4 = 12

        // Player A menembak Player B
        vm.prank(playerA);
        combat.fireWeapon(roundId, playerB, AttackType.GLITCH_STONE, bitPos);

        // Inbox Player B harus berisi bit ke-12
        uint64 expectedMask = uint64(1) << bitPos;
        assertEq(combat.getPendingInbox(roundId, playerB), expectedMask);

        // Inbox Player A harus tetap 0 (tidak tersentuh!)
        assertEq(combat.getPendingInbox(roundId, playerA), 0);
    }

    function test_ConsumeInbox_ByGameContract() public {
        uint256 roundId = 1;
        uint8 bitPos1 = 5;
        uint8 bitPos2 = 18;

        // Player A dan C serang Player B
        vm.prank(playerA);
        combat.fireWeapon(roundId, playerB, AttackType.GLITCH_STONE, bitPos1);
        vm.prank(address(0xCCCC));
        combat.fireWeapon(roundId, playerB, AttackType.GLITCH_STONE, bitPos2);

        uint64 expected = (uint64(1) << bitPos1) | (uint64(1) << bitPos2);
        assertEq(combat.getPendingInbox(roundId, playerB), expected);

        // Game contract memanggil consumeInbox untuk Player B
        vm.prank(gameContract);
        uint64 consumed = combat.consumeInbox(roundId, playerB);

        assertEq(consumed, expected);
        // Inbox Player B sekarang kosong
        assertEq(combat.getPendingInbox(roundId, playerB), 0);
    }

    function test_RevertIfSelfAttack() public {
        uint256 roundId = 1;
        vm.prank(playerA);
        vm.expectRevert("Cannot attack self");
        combat.fireWeapon(roundId, playerA, AttackType.GLITCH_STONE, 0);
    }

    function test_RevertIfConsumeInboxNotGame() public {
        uint256 roundId = 1;
        vm.prank(playerA);
        vm.expectRevert("Only game contract");
        combat.consumeInbox(roundId, playerB);
    }
}
