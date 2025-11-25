// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyToken.sol";
import "../src/TokenBankPermit2.sol";

contract DeployPermit2 is Script {
    // Permit2 contract address on Sepolia (officially deployed by Uniswap)
    address constant PERMIT2_ADDRESS = 0x000000000022D473030F116dDEE9F6B43aC78BA3;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy MyToken with 1,000,000 initial supply
        MyToken token = new MyToken(1_000_000);
        console.log("MyToken deployed to:", address(token));

        // Deploy TokenBankPermit2 using the official Permit2 contract
        TokenBankPermit2 bank = new TokenBankPermit2(address(token), PERMIT2_ADDRESS);
        console.log("TokenBankPermit2 deployed to:", address(bank));
        console.log("Using Permit2 at:", PERMIT2_ADDRESS);

        vm.stopBroadcast();
    }
}
