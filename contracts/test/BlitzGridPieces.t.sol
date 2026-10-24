// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {BlitzGridPieces} from "../src/BlitzGridPieces.sol";

contract BlitzGridPiecesTest is Test {
    function getMaskAtWrapper(uint8 pieceId, uint8 x, uint8 y) external pure returns (uint64) {
        return BlitzGridPieces.getMaskAt(pieceId, x, y);
    }
    function test_AllPiecesCatalogValid() public pure {
        for (uint8 i = 0; i < BlitzGridPieces.TOTAL_PIECES; i++) {
            (uint8 w, uint8 h, uint64 baseMask) = BlitzGridPieces.getPieceData(i);
            assertTrue(w >= 1 && w <= 8, "Invalid width");
            assertTrue(h >= 1 && h <= 8, "Invalid height");
            assertTrue(baseMask > 0, "Empty baseMask");
        }
    }

    function test_BoundaryGuard_RevertOnOverflowX() public {
        // Line 5 (Horizontal): width = 5. At x = 4, x + w = 9 > 8 -> MUST REVERT
        vm.expectRevert("Piece out of X boundary");
        this.getMaskAtWrapper(BlitzGridPieces.LINE_H5, 4, 0);
    }

    function test_BoundaryGuard_RevertOnOverflowY() public {
        // Line 5 (Vertical): height = 5. At y = 4, y + h = 9 > 8 -> MUST REVERT
        vm.expectRevert("Piece out of Y boundary");
        this.getMaskAtWrapper(BlitzGridPieces.LINE_V5, 0, 4);
    }

    function test_BoundaryGuard_EdgePlacementSuccess() public pure {
        // Line 5 at edge x = 3, y = 0 -> fits exactly (3 + 5 = 8)
        uint64 maskH = BlitzGridPieces.getMaskAt(BlitzGridPieces.LINE_H5, 3, 0);
        assertTrue(maskH > 0);

        // Line 5 (V) at edge x = 0, y = 3 -> fits exactly (3 + 5 = 8)
        uint64 maskV = BlitzGridPieces.getMaskAt(BlitzGridPieces.LINE_V5, 0, 3);
        assertTrue(maskV > 0);
    }

    function test_Square3x3_Boundary() public {
        // 3x3 square at (5, 5) -> 5 + 3 = 8 -> VALID
        uint64 validMask = BlitzGridPieces.getMaskAt(BlitzGridPieces.SQR_3X3, 5, 5);
        assertTrue(validMask > 0);

        // 3x3 square at (6, 0) -> 6 + 3 = 9 -> MUST REVERT
        vm.expectRevert("Piece out of X boundary");
        this.getMaskAtWrapper(BlitzGridPieces.SQR_3X3, 6, 0);

        // 3x3 square at (0, 6) -> 6 + 3 = 9 -> MUST REVERT
        vm.expectRevert("Piece out of Y boundary");
        this.getMaskAtWrapper(BlitzGridPieces.SQR_3X3, 0, 6);
    }

    function test_DeterministicPieceGeneration() public pure {
        bytes32 seed = keccak256("MONAD_BLITZ_2026");
        address player = address(0xFA12);

        for (uint8 cycle = 0; cycle < 5; cycle++) {
            for (uint8 slot = 0; slot < 3; slot++) {
                uint8 pieceId = BlitzGridPieces.getDeterministicPiece(seed, player, cycle, slot);
                assertTrue(pieceId < BlitzGridPieces.TOTAL_PIECES);
            }
        }
    }
}
