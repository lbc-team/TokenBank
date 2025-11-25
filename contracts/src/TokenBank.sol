// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenBank
 * @dev 一个安全的代币存取合约
 * 用户可以存入指定的ERC20代币，并在之后取出
 */
contract TokenBank is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // 存储的代币地址
    IERC20 public immutable token;

    // 记录每个地址的存入数量
    mapping(address => uint256) public balances;

    // 事件
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    // 错误
    error ZeroAmount();
    error InsufficientBalance();

    /**
     * @dev 构造函数
     * @param _token 支持的ERC20代币地址
     */
    constructor(address _token) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }

    /**
     * @dev 存入代币
     * @param amount 存入数量
     *
     * 要求:
     * - amount必须大于0
     * - 调用者必须已经approve足够的代币给此合约
     */
    function deposit(uint256 amount) external virtual nonReentrant {
        if (amount == 0) revert ZeroAmount();

        // 使用SafeERC20安全转账
        token.safeTransferFrom(msg.sender, address(this), amount);

        // 更新余额
        balances[msg.sender] += amount;

        emit Deposit(msg.sender, amount);
    }

    /**
     * @dev 提取代币
     * @param amount 提取数量
     *
     * 要求:
     * - amount必须大于0
     * - 调用者的存入余额必须足够
     */
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        // 先更新状态（防止重入攻击）
        balances[msg.sender] -= amount;

        // 再进行转账
        token.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount);
    }

    /**
     * @dev 查询用户在Bank中的余额
     * @param account 查询地址
     * @return 用户存入的代币数量
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    /**
     * @dev 查询Bank合约持有的总代币数量
     * @return Bank合约的代币余额
     */
    function totalDeposits() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
