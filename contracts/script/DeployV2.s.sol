// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyTokenV2.sol";
import "../src/TokenBankV2.sol";

contract DeployV2 is Script {
    function run() external {
        // 读取私钥
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // 开始广播交易
        vm.startBroadcast(deployerPrivateKey);

        // 部署 MyTokenV2，初始供应量为 1,000,000 MTK
        MyTokenV2 tokenV2 = new MyTokenV2(1000000);
        console.log("MyTokenV2 deployed at:", address(tokenV2));

        // 部署 TokenBankV2
        TokenBankV2 bankV2 = new TokenBankV2(address(tokenV2));
        console.log("TokenBankV2 deployed at:", address(bankV2));

        vm.stopBroadcast();

        // 输出部署信息
        console.log("\n=== V2 Deployment Summary ===");
        console.log("MyTokenV2:", address(tokenV2));
        console.log("TokenBankV2:", address(bankV2));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
    }
}
