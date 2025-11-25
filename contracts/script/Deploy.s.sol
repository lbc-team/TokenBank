// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyToken.sol";
import "../src/TokenBank.sol";

contract DeployScript is Script {
    function run() external {
        // 读取私钥
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // 开始广播交易
        vm.startBroadcast(deployerPrivateKey);

        // 部署 MyToken，初始供应量为 1,000,000 MTK
        MyToken token = new MyToken(1000000);
        console.log("MyToken deployed at:", address(token));

        // 部署 TokenBank
        TokenBank bank = new TokenBank(address(token));
        console.log("TokenBank deployed at:", address(bank));

        vm.stopBroadcast();

        // 输出部署信息
        console.log("\n=== Deployment Summary ===");
        console.log("MyToken:", address(token));
        console.log("TokenBank:", address(bank));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
    }
}
