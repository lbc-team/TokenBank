// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TokenBankV3.sol";

contract DeployTokenBankV3 is Script {
    // V1 Token address (reuse existing token)
    address constant TOKEN_ADDRESS = 0xD6c393ffD2916d93F5Dd842FB1eD0C6dE5A2F142;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TokenBankV3 with existing token
        TokenBankV3 bankV3 = new TokenBankV3(TOKEN_ADDRESS);
        console.log("TokenBankV3 deployed to:", address(bankV3));

        vm.stopBroadcast();
    }
}
