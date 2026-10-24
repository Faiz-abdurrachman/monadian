// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface IMonadianVault {
    event PrizeDistributed(
        uint256 indexed roundId,
        address indexed champion,
        uint256 winnerPayout,
        uint256 runnerUpPayout,
        uint256 thirdPlacePayout,
        uint256 burnedAmount
    );

    event SponsorBountyDeposited(
        uint256 indexed roundId,
        address indexed sponsor,
        uint256 amount
    );

    function depositEntry(uint256 roundId) external payable;
    function depositSponsorBounty(uint256 roundId) external payable;

    function settleRound(
        uint256 roundId,
        address champion,
        address runnerUp,
        address thirdPlace
    ) external;

    function settleWinnerTakesAll(
        uint256 roundId,
        address champion
    ) external;

    function prizePools(uint256 roundId) external view returns (uint256);
    function isSettled(uint256 roundId) external view returns (bool);
    function communityTreasury() external view returns (uint256);
}
