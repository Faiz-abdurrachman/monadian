// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";

contract MonadianBitwiseTest is Test {
    uint64 private constant ROW_MASK = 0xFF;
    uint64 private constant COL_MASK = 0x0101010101010101;

    function _clearLines(uint64 board) internal pure returns (uint64 newBoard, uint8 linesCleared) {
        uint64 clearMask = 0;

        // Rows
        for (uint8 r = 0; r < 8; r++) {
            uint64 rMask = ROW_MASK << (r * 8);
            if ((board & rMask) == rMask) {
                clearMask |= rMask;
                linesCleared++;
            }
        }

        // Columns
        for (uint8 c = 0; c < 8; c++) {
            uint64 cMask = COL_MASK << c;
            if ((board & cMask) == cMask) {
                clearMask |= cMask;
                linesCleared++;
            }
        }

        newBoard = board & ~clearMask;
    }

    function test_SingleRowClear_AllRows() public pure {
        for (uint8 r = 0; r < 8; r++) {
            uint64 board = ROW_MASK << (r * 8);
            (uint64 newBoard, uint8 lines) = _clearLines(board);
            assertEq(lines, 1, "Should clear 1 line");
            assertEq(newBoard, 0, "Board should be empty after clearing single row");
        }
    }

    function test_SingleColClear_AllCols() public pure {
        for (uint8 c = 0; c < 8; c++) {
            uint64 board = COL_MASK << c;
            (uint64 newBoard, uint8 lines) = _clearLines(board);
            assertEq(lines, 1, "Should clear 1 line");
            assertEq(newBoard, 0, "Board should be empty after clearing single col");
        }
    }

    function test_DoubleRowClear() public pure {
        // Row 0 and Row 3 full
        uint64 board = (ROW_MASK << 0) | (ROW_MASK << (3 * 8));
        (uint64 newBoard, uint8 lines) = _clearLines(board);
        assertEq(lines, 2);
        assertEq(newBoard, 0);
    }

    function test_DoubleColClear() public pure {
        // Col 1 and Col 6 full
        uint64 board = (COL_MASK << 1) | (COL_MASK << 6);
        (uint64 newBoard, uint8 lines) = _clearLines(board);
        assertEq(lines, 2);
        assertEq(newBoard, 0);
    }

    function test_CrossClear_RowAndColSimultaneous() public pure {
        // Row 2 and Col 4 full
        uint64 board = (ROW_MASK << (2 * 8)) | (COL_MASK << 4);
        (uint64 newBoard, uint8 lines) = _clearLines(board);
        assertEq(lines, 2, "Cross clear should count as 2 lines");
        assertEq(newBoard, 0, "Board should be completely cleared");
    }

    function test_PartialLine_DoesNotClear() public pure {
        // Row 0 with 7 out of 8 bits (bit 7 missing: 0x7F)
        uint64 board = 0x7F;
        (uint64 newBoard, uint8 lines) = _clearLines(board);
        assertEq(lines, 0);
        assertEq(newBoard, 0x7F);
    }

    function test_ManaCalculationFormula() public pure {
        // Formula: earnedMana = baseMana * (10 + (comboStreak * 5)) / 10
        // Skenario 1: 1 line, comboStreak = 1
        // baseMana = 10, multiplier = (10 + 5)/10 = 1.5 -> 10 * 15 / 10 = 15 Mana
        uint32 base1 = 10;
        uint32 streak1 = 1;
        uint32 mana1 = (base1 * (10 + (streak1 * 5))) / 10;
        assertEq(mana1, 15);

        // Skenario 2: 2 lines (Double Clear), comboStreak = 3
        // baseMana = 25, multiplier = (10 + 15)/10 = 2.5 -> 25 * 25 / 10 = 62 Mana
        uint32 base2 = 25;
        uint32 streak2 = 3;
        uint32 mana2 = (base2 * (10 + (streak2 * 5))) / 10;
        assertEq(mana2, 62);

        // Skenario 3: 4 lines (Quad Clear), comboStreak = 4
        // baseMana = 80, multiplier = (10 + 20)/10 = 3.0 -> 80 * 30 / 10 = 240 Mana
        uint32 base3 = 80;
        uint32 streak3 = 4;
        uint32 mana3 = (base3 * (10 + (streak3 * 5))) / 10;
        assertEq(mana3, 240);
    }
}
