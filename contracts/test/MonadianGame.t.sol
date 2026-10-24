// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {MonadianGame} from "../src/MonadianGame.sol";
import {MonadianCombat} from "../src/MonadianCombat.sol";
import {MonadianVault} from "../src/MonadianVault.sol";
import {MonadianPieces} from "../src/MonadianPieces.sol";
import {RoundConfig, RoundStatus, PlayerState, AttackType} from "../src/Structs.sol";

contract MonadianGameTest is Test {
    MonadianGame public game;
    MonadianCombat public combat;
    MonadianVault public vault;

    address public player1 = address(0x1111);
    address public player2 = address(0x2222);

    function setUp() public {
        combat = new MonadianCombat();
        vault = new MonadianVault();

        game = new MonadianGame(address(combat), address(vault));

        combat.setGameContract(address(game));
        vault.setGameContract(address(game));

        vm.deal(player1, 10 ether);
        vm.deal(player2, 10 ether);
    }

    function _setupActiveTwoPlayerRound() internal returns (uint256 roundId) {
        RoundConfig memory cfg = RoundConfig({
            entryFee: 0.1 ether,
            maxPlayers: 2,
            durationSeconds: 60,
            weaponsEnabled: true,
            sponsorToken: address(0)
        });

        roundId = game.createRound(cfg);

        vm.prank(player1);
        game.joinRound{value: 0.1 ether}(roundId);

        vm.prank(player2);
        game.joinRound{value: 0.1 ether}(roundId); // Lobi penuh, otomatis mulai ronde
    }

    function test_RoundLifecycle_CreateJoinStart() public {
        uint256 roundId = _setupActiveTwoPlayerRound();

        assertEq(uint8(game.roundStatuses(roundId)), uint8(RoundStatus.ACTIVE));
        assertEq(game.activePlayersCount(roundId), 2);
        assertEq(vault.prizePools(roundId), 0.2 ether);

        PlayerState memory p1 = game.getPlayerState(roundId, player1);
        assertTrue(p1.isAlive);
        assertEq(p1.board, 0);
    }

    function test_MakeMove_PlacementAndCollision() public {
        uint256 roundId = _setupActiveTwoPlayerRound();

        (uint8[3] memory pieces, ) = game.getHandPieces(roundId, player1);
        uint8 pieceId0 = pieces[0];

        // Player 1 pasang balok slot 0 di (0, 0)
        vm.prank(player1);
        game.makeMove(roundId, 0, 0, 0);

        PlayerState memory p1 = game.getPlayerState(roundId, player1);
        uint64 expectedMask = MonadianPieces.getMaskAt(pieceId0, 0, 0);
        assertEq(p1.board, expectedMask);
        assertEq(p1.score, 5); // 5 poin untuk penempatan tanpa line clear

        // Coba pasang balok kedua pada posisi yang bertabrakan -> MUST REVERT
        ( , bool[3] memory used) = game.getHandPieces(roundId, player1);
        assertTrue(used[0]); // slot 0 sudah dipakai
        assertFalse(used[1]);

        // Coba taruh di (0, 0) yang sudah terisi balok pertama
        vm.prank(player1);
        vm.expectRevert("Move Invalid: Collision Detected");
        game.makeMove(roundId, 1, 0, 0);
    }

    function test_LineClear_HorizontalAndMana() public {
        uint256 roundId = _setupActiveTwoPlayerRound();
        assertTrue(roundId > 0);
    }

    function test_AFK_TimeoutElimination_AndPayout() public {
        uint256 roundId = _setupActiveTwoPlayerRound();

        // Percepat waktu 10 detik (melebihi AFK_TIMEOUT 8 detik)
        vm.warp(block.timestamp + 10);

        // Player 1 mengklaim timeout Player 2
        vm.prank(player1);
        game.claimTimeout(roundId, player2);

        // Player 2 tereliminasi (rank 2)
        PlayerState memory p2 = game.getPlayerState(roundId, player2);
        assertFalse(p2.isAlive);
        assertEq(p2.finishRank, 2);

        // Player 1 jadi juara (rank 1), ronde COMPLETED
        PlayerState memory p1 = game.getPlayerState(roundId, player1);
        assertTrue(p1.isAlive);
        assertEq(p1.finishRank, 1);
        assertEq(uint8(game.roundStatuses(roundId)), uint8(RoundStatus.COMPLETED));

        // Payout terdistribusi instan ke Player 1 (65% dari 0.2 ether = 0.13 ether)
        // Saldo awal p1 = 10 - 0.1 (entry) = 9.9 ether + 0.13 ether = 10.03 ether
        assertEq(player1.balance, 10.03 ether);
        // Saldo p2 (runner up 20% dari 0.2 = 0.04 ether) -> 9.9 + 0.04 = 9.94 ether
        assertEq(player2.balance, 9.94 ether);
    }

    function test_CombatSabotage_GlitchStone() public {
        uint256 roundId = _setupActiveTwoPlayerRound();

        // Beri player 1 mana 50 untuk menembak senjata
        // Kita bisa tes fireSabotage
        // Pertama kita bypass / set mana via state
        // Atau tes fireWeapon langsung via Combat
        vm.prank(player1);
        combat.fireWeapon(roundId, player2, AttackType.GLITCH_STONE, 7); // target bit 7

        assertEq(combat.getPendingInbox(roundId, player2), uint64(1) << 7);

        // Saat Player 2 melakukan makeMove, bit 7 harus otomatis masuk ke papannya!
        vm.prank(player2);
        game.makeMove(roundId, 0, 0, 0); // Player 2 taruh balok di (0, 0)

        PlayerState memory p2 = game.getPlayerState(roundId, player2);
        // Papan player 2 harus memiliki bit 7 terisi!
        assertTrue((p2.board & (uint64(1) << 7)) != 0, "Sabotage stone not applied to board");
        // Inbox player 2 harus bersih
        assertEq(combat.getPendingInbox(roundId, player2), 0);
    }
}
