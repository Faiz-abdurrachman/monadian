// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {BlitzGridCombat} from "../src/BlitzGridCombat.sol";
import {BlitzGridVault} from "../src/BlitzGridVault.sol";
import {BlitzGridGame} from "../src/BlitzGridGame.sol";

contract DeployBlitzGrid is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80) // default anvil key
        );

        vm.startBroadcast(deployerPrivateKey);

        BlitzGridCombat combat = new BlitzGridCombat();
        BlitzGridVault vault = new BlitzGridVault();
        BlitzGridGame game = new BlitzGridGame(address(combat), address(vault));

        combat.setGameContract(address(game));
        vault.setGameContract(address(game));

        vm.stopBroadcast();

        console.log("=== BlitzGrid Deployment Info ===");
        console.log("BlitzGridCombat deployed to:", address(combat));
        console.log("BlitzGridVault deployed to: ", address(vault));
        console.log("BlitzGridGame deployed to:  ", address(game));
    }
}
