// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MonadianCombat} from "../src/MonadianCombat.sol";
import {MonadianVault} from "../src/MonadianVault.sol";
import {MonadianGame} from "../src/MonadianGame.sol";

contract DeployMonadian is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80) // default anvil key
        );

        vm.startBroadcast(deployerPrivateKey);

        MonadianCombat combat = new MonadianCombat();
        MonadianVault vault = new MonadianVault();
        MonadianGame game = new MonadianGame(address(combat), address(vault));

        combat.setGameContract(address(game));
        vault.setGameContract(address(game));

        vm.stopBroadcast();

        console.log("=== Monadian Deployment Info ===");
        console.log("MonadianCombat deployed to:", address(combat));
        console.log("MonadianVault deployed to: ", address(vault));
        console.log("MonadianGame deployed to:  ", address(game));
    }
}
