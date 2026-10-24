// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IMonadianVault} from "./interfaces/IMonadianVault.sol";

/**
 * @title MonadianVault
 * @notice Escrow tiket turnamen, settlement instan dalam 800ms, dan token burn 5%.
 */
contract MonadianVault is IMonadianVault, ReentrancyGuard {
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    address public gameContract;

    mapping(uint256 => uint256) public override prizePools;
    mapping(uint256 => bool) public override isSettled;

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

    uint256 public override communityTreasury;

    /**
     * @notice Menyetor biaya tiket masuk turnamen ke dalam pot hadiah ronde.
     */
    function depositEntry(uint256 roundId) external payable override {
        require(msg.value > 0, "Zero entry fee");
        prizePools[roundId] += msg.value;
    }

    /**
     * @notice Menyetor dana sponsor / hadiah bounty langsung ke dalam pot ronde.
     */
    function depositSponsorBounty(uint256 roundId) external payable override {
        require(msg.value > 0, "Zero sponsor bounty");
        prizePools[roundId] += msg.value;
        emit SponsorBountyDeposited(roundId, msg.sender, msg.value);
    }

    /**
     * @notice Mendistribusikan pot hadiah secara atomik saat ronde selesai (Mode Winner-Takes-All).
     *         Alokasi: 95% Juara 1, 5% Burn / Treasury.
     */
    function settleWinnerTakesAll(
        uint256 roundId,
        address champion
    ) external override onlyGame nonReentrant {
        require(!isSettled[roundId], "Already settled");
        require(champion != address(0), "Invalid champion");

        isSettled[roundId] = true;
        uint256 totalPot = prizePools[roundId];

        if (totalPot == 0) {
            emit PrizeDistributed(roundId, champion, 0, 0, 0, 0);
            return;
        }

        uint256 championShare = (totalPot * 95) / 100;
        uint256 burnedAmount = totalPot - championShare;
        communityTreasury += burnedAmount;

        (bool s1, ) = payable(champion).call{value: championShare}("");
        require(s1, "Champion transfer failed");

        if (burnedAmount > 0) {
            (bool s4, ) = payable(BURN_ADDRESS).call{value: burnedAmount}("");
            require(s4, "Burn transfer failed");
        }

        emit PrizeDistributed(
            roundId,
            champion,
            championShare,
            0,
            0,
            burnedAmount
        );
    }

    /**
     * @notice Mendistribusikan pot hadiah secara atomik saat ronde selesai (Mode Podium Esports).
     *         Alokasi: 65% Juara 1, 20% Juara 2, 10% Juara 3, 5% Burn / Treasury.
     */
    function settleRound(
        uint256 roundId,
        address champion,
        address runnerUp,
        address thirdPlace
    ) external override onlyGame nonReentrant {
        require(!isSettled[roundId], "Already settled");
        require(champion != address(0), "Invalid champion");

        isSettled[roundId] = true;
        uint256 totalPot = prizePools[roundId];

        if (totalPot == 0) {
            emit PrizeDistributed(roundId, champion, 0, 0, 0, 0);
            return;
        }

        uint256 championShare = (totalPot * 65) / 100;
        uint256 runnerUpShare = runnerUp != address(0) ? (totalPot * 20) / 100 : 0;
        uint256 thirdShare = thirdPlace != address(0) ? (totalPot * 10) / 100 : 0;
        uint256 burnedAmount = totalPot - (championShare + runnerUpShare + thirdShare);
        communityTreasury += burnedAmount;

        // Transfer hadiah dengan call value
        (bool s1, ) = payable(champion).call{value: championShare}("");
        require(s1, "Champion transfer failed");

        if (runnerUpShare > 0) {
            (bool s2, ) = payable(runnerUp).call{value: runnerUpShare}("");
            require(s2, "RunnerUp transfer failed");
        }

        if (thirdShare > 0) {
            (bool s3, ) = payable(thirdPlace).call{value: thirdShare}("");
            require(s3, "ThirdPlace transfer failed");
        }

        if (burnedAmount > 0) {
            (bool s4, ) = payable(BURN_ADDRESS).call{value: burnedAmount}("");
            require(s4, "Burn transfer failed");
        }

        emit PrizeDistributed(
            roundId,
            champion,
            championShare,
            runnerUpShare,
            thirdShare,
            burnedAmount
        );
    }
}
