// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Delegate.sol";

contract DeployDelegate is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Delegate contract
        Delegate delegate = new Delegate();

        console.log("Delegate deployed to:", address(delegate));

        vm.stopBroadcast();
    }
}
