// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {MonadianVault} from "../src/MonadianVault.sol";

contract MonadianVaultTest is Test {
    MonadianVault public vault;
    address public gameContract = address(0x9999);
    address public champion = address(0x1111);
    address public runnerUp = address(0x2222);
    address public thirdPlace = address(0x3333);
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    function setUp() public {
        vault = new MonadianVault();
        vault.setGameContract(gameContract);
    }

    function test_DepositEntry() public {
        uint256 roundId = 1;
        vm.deal(address(this), 1 ether);

        vault.depositEntry{value: 0.1 ether}(roundId);
        assertEq(vault.prizePools(roundId), 0.1 ether);

        vault.depositEntry{value: 0.1 ether}(roundId);
        assertEq(vault.prizePools(roundId), 0.2 ether);
    }

    function test_SettleRound_PayoutDistribution() public {
        uint256 roundId = 1;
        uint256 totalPot = 1.6 ether; // 16 players x 0.1 MON
        vm.deal(address(this), totalPot);
        vault.depositEntry{value: totalPot}(roundId);

        // Hanya gameContract yang boleh memanggil settleRound
        vm.prank(gameContract);
        vault.settleRound(roundId, champion, runnerUp, thirdPlace);

        assertTrue(vault.isSettled(roundId));

        // 65% = 1.04 ether
        assertEq(champion.balance, 1.04 ether);
        // 20% = 0.32 ether
        assertEq(runnerUp.balance, 0.32 ether);
        // 10% = 0.16 ether
        assertEq(thirdPlace.balance, 0.16 ether);
        // 5% = 0.08 ether ke burn address
        assertEq(BURN_ADDRESS.balance, 0.08 ether);
    }

    function test_SettleRound_RevertIfNotGame() public {
        uint256 roundId = 1;
        vm.deal(address(this), 1 ether);
        vault.depositEntry{value: 1 ether}(roundId);

        vm.expectRevert("Only game contract");
        vault.settleRound(roundId, champion, runnerUp, thirdPlace);
    }

    function test_SettleRound_RevertIfAlreadySettled() public {
        uint256 roundId = 1;
        vm.deal(address(this), 1 ether);
        vault.depositEntry{value: 1 ether}(roundId);

        vm.startPrank(gameContract);
        vault.settleRound(roundId, champion, runnerUp, thirdPlace);

        vm.expectRevert("Already settled");
        vault.settleRound(roundId, champion, runnerUp, thirdPlace);
        vm.stopPrank();
    }

    function test_DepositSponsorBounty() public {
        uint256 roundId = 2;
        address sponsor = address(0x7777);
        vm.deal(sponsor, 2 ether);

        vm.prank(sponsor);
        vault.depositSponsorBounty{value: 1.5 ether}(roundId);

        assertEq(vault.prizePools(roundId), 1.5 ether);
    }

    function test_SettleWinnerTakesAll_PayoutDistribution() public {
        uint256 roundId = 3;
        uint256 totalPot = 1.6 ether;
        vm.deal(address(this), totalPot);
        vault.depositEntry{value: totalPot}(roundId);

        address champ = address(0x8888);

        vm.prank(gameContract);
        vault.settleWinnerTakesAll(roundId, champ);

        assertTrue(vault.isSettled(roundId));

        // 95% = 1.52 ether to champion
        assertEq(champ.balance, 1.52 ether);
        // 5% = 0.08 ether tracked in communityTreasury
        assertEq(vault.communityTreasury(), 0.08 ether);
        // 5% also delivered to dead address for token deflation
        assertEq(BURN_ADDRESS.balance, 0.08 ether);
    }
}
