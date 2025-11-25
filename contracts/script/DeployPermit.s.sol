// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyTokenPermit.sol";
import "../src/TokenBankPermit.sol";

contract DeployPermit is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy MyTokenPermit with 1,000,000 initial supply
        MyTokenPermit token = new MyTokenPermit(1_000_000);
        console.log("MyTokenPermit deployed to:", address(token));

        // Deploy TokenBankPermit
        TokenBankPermit bank = new TokenBankPermit(address(token));
        console.log("TokenBankPermit deployed to:", address(bank));

        vm.stopBroadcast();
    }
}
