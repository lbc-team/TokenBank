// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyToken.sol";

/**
 * @title ITokenReceiver
 * @dev 接收代币的合约需要实现此接口
 */
interface ITokenReceiver {
    /**
     * @dev 当代币通过transferWithCallback转入时被调用
     * @param from 代币发送者
     * @param amount 转入数量
     * @return 返回函数选择器表示成功接收
     */
    function tokensReceived(address from, uint256 amount) external returns (bytes4);
}

/**
 * @title MyTokenV2
 * @dev 扩展ERC20代币，添加hook功能的转账函数
 */
contract MyTokenV2 is MyToken {
    /**
     * @dev 构造函数
     * @param initialSupply 初始供应量（不含精度）
     */
    constructor(uint256 initialSupply) MyToken(initialSupply) {}

    /**
     * @dev 带回调的转账函数
     * 如果目标地址是合约，则调用其tokensReceived函数
     * @param to 接收地址
     * @param amount 转账数量
     * @return 是否成功
     */
    function transferWithCallback(address to, uint256 amount) public returns (bool) {
        // 先执行普通转账
        transfer(to, amount);

        // 检查目标地址是否是合约
        if (to.code.length > 0) {
            // 调用目标合约的tokensReceived函数
            try ITokenReceiver(to).tokensReceived(msg.sender, amount) returns (bytes4 selector) {
                require(
                    selector == ITokenReceiver.tokensReceived.selector,
                    "Invalid tokensReceived implementation"
                );
            } catch {
                revert("TokenReceiver call failed");
            }
        }

        return true;
    }
}
