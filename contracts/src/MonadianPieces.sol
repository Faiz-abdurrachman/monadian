// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/**
 * @title MonadianPieces
 * @notice Katalog 19 balok polyomino Block Blast dalam representasi bitwise uint64
 *         lengkap dengan Boundary Guard untuk mencegah bit-wrapping antar-baris.
 */
library MonadianPieces {
    uint8 public constant TOTAL_PIECES = 19;

    // Piece IDs
    uint8 public constant DOT_1X1    = 0;
    uint8 public constant LINE_H2   = 1;
    uint8 public constant LINE_V2   = 2;
    uint8 public constant LINE_H3   = 3;
    uint8 public constant LINE_V3   = 4;
    uint8 public constant LINE_H4   = 5;
    uint8 public constant LINE_V4   = 6;
    uint8 public constant LINE_H5   = 7;
    uint8 public constant LINE_V5   = 8;
    uint8 public constant SQR_2X2   = 9;
    uint8 public constant SQR_3X3   = 10;
    uint8 public constant CORNER_TL = 11;
    uint8 public constant CORNER_TR = 12;
    uint8 public constant CORNER_BL = 13;
    uint8 public constant CORNER_BR = 14;
    uint8 public constant T_UP      = 15;
    uint8 public constant T_DOWN    = 16;
    uint8 public constant T_LEFT    = 17;
    uint8 public constant T_RIGHT   = 18;

    /**
     * @notice Mengambil data balok asal (lebar, tinggi, baseMask pada (0,0)).
     */
    function getPieceData(uint8 pieceId)
        internal
        pure
        returns (uint8 width, uint8 height, uint64 baseMask)
    {
        require(pieceId < TOTAL_PIECES, "Invalid pieceId");

        if (pieceId == DOT_1X1)    return (1, 1, 0x1);
        if (pieceId == LINE_H2)   return (2, 1, 0x3);
        if (pieceId == LINE_V2)   return (1, 2, 0x0101);
        if (pieceId == LINE_H3)   return (3, 1, 0x7);
        if (pieceId == LINE_V3)   return (1, 3, 0x010101);
        if (pieceId == LINE_H4)   return (4, 1, 0xF);
        if (pieceId == LINE_V4)   return (1, 4, 0x01010101);
        if (pieceId == LINE_H5)   return (5, 1, 0x1F);
        if (pieceId == LINE_V5)   return (1, 5, 0x0101010101);
        if (pieceId == SQR_2X2)   return (2, 2, 0x0303);
        if (pieceId == SQR_3X3)   return (3, 3, 0x070707);
        if (pieceId == CORNER_TL) return (2, 2, 0x0103);
        if (pieceId == CORNER_TR) return (2, 2, 0x0203);
        if (pieceId == CORNER_BL) return (2, 2, 0x0301);
        if (pieceId == CORNER_BR) return (2, 2, 0x0302);
        if (pieceId == T_UP)      return (3, 2, 0x0702);
        if (pieceId == T_DOWN)    return (3, 2, 0x0207);
        if (pieceId == T_LEFT)    return (2, 3, 0x020302);
        if (pieceId == T_RIGHT)   return (2, 3, 0x010301);

        revert("Invalid pieceId");
    }

    /**
     * @notice Menghitung bitmask uint64 balok pada koordinat target (x, y)
     *         dengan proteksi batas grid (Boundary Guard).
     */
    function getMaskAt(uint8 pieceId, uint8 x, uint8 y)
        internal
        pure
        returns (uint64)
    {
        (uint8 w, uint8 h, uint64 baseMask) = getPieceData(pieceId);
        require(x + w <= 8, "Piece out of X boundary");
        require(y + h <= 8, "Piece out of Y boundary");

        return baseMask << (uint64(y) * 8 + uint64(x));
    }

    /**
     * @notice Menghasilkan ID balok deterministik berdasarkan roundSeed, player, cycle, dan slot.
     */
    function getDeterministicPiece(
        bytes32 roundSeed,
        address player,
        uint8 handCycle,
        uint8 slotIndex
    ) internal pure returns (uint8) {
        bytes32 hash = keccak256(
            abi.encodePacked(roundSeed, player, handCycle, slotIndex)
        );
        return uint8(uint256(hash) % TOTAL_PIECES);
    }
}
