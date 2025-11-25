// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenBank.sol";
import "./MyTokenV2.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title TokenBankV2
 * @dev 扩展TokenBank，支持通过transferWithCallback直接存款
 */
contract TokenBankV2 is TokenBank, ITokenReceiver {
    using SafeERC20 for IERC20;

    // 事件：通过回调存款
    event DepositWithCallback(address indexed user, uint256 amount);

    /**
     * @dev 构造函数
     * @param _token 支持的ERC20代币地址（应该是MyTokenV2）
     */
    constructor(address _token) TokenBank(_token) {}

    /**
     * @dev 实现ITokenReceiver接口
     * 当用户调用transferWithCallback将代币转入时自动执行
     * @param from 代币发送者
     * @param amount 转入数量
     * @return 函数选择器
     */
    function tokensReceived(address from, uint256 amount)
        external
        override
        returns (bytes4)
    {
        // 只接受来自token合约的调用
        require(msg.sender == address(token), "Only accept token contract");
        require(amount > 0, "Amount must be greater than 0");

        // 更新余额（直接记录存款）
        balances[from] += amount;

        emit DepositWithCallback(from, amount);
        emit Deposit(from, amount);

        return ITokenReceiver.tokensReceived.selector;
    }

    /**
     * @dev 重写deposit函数，使用approve + deposit方式
     * 保持与TokenBank相同的逻辑
     */
    function deposit(uint256 amount) external override nonReentrant {
        if (amount == 0) revert ZeroAmount();

        // 使用SafeERC20安全转账
        token.safeTransferFrom(msg.sender, address(this), amount);

        // 更新余额
        balances[msg.sender] += amount;

        emit Deposit(msg.sender, amount);
    }
}
