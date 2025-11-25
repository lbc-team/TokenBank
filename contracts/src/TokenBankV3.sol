// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenBankV3
 * @dev TokenBank with depositFor support for delegation patterns
 *
 * This version adds depositFor() function that allows approved contracts
 * to deposit tokens on behalf of users, enabling patterns like EIP-7702
 * delegation and batch operations.
 */
contract TokenBankV3 is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Token to store
    IERC20 public immutable token;

    // User balances
    mapping(address => uint256) public balances;

    // Events
    event Deposit(address indexed user, uint256 amount);
    event DepositFor(address indexed depositor, address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    // Errors
    error ZeroAmount();
    error InsufficientBalance();
    error ZeroAddress();

    constructor(address _token) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }

    /**
     * @dev Standard deposit - user deposits for themselves
     * @param amount Amount to deposit
     */
    function deposit(uint256 amount) external virtual nonReentrant {
        if (amount == 0) revert ZeroAmount();

        token.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;

        emit Deposit(msg.sender, amount);
    }

    /**
     * @dev Deposit tokens on behalf of another user
     * @param user Address to credit the deposit to
     * @param amount Amount to deposit
     *
     * This function allows contracts (like Delegate) to deposit tokens
     * and credit them to a specific user's balance.
     *
     * Requirements:
     * - Caller must have approved token allowance
     * - user address cannot be zero
     * - amount must be greater than zero
     */
    function depositFor(address user, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (user == address(0)) revert ZeroAddress();

        // Transfer from caller (could be Delegate contract)
        token.safeTransferFrom(msg.sender, address(this), amount);

        // Credit to specified user's balance
        balances[user] += amount;

        emit DepositFor(msg.sender, user, amount);
    }

    /**
     * @dev Withdraw tokens
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        balances[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount);
    }

    /**
     * @dev Get user's balance in the bank
     * @param account Address to query
     * @return User's deposited token amount
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    /**
     * @dev Get total tokens held by the bank
     * @return Total deposited tokens
     */
    function totalDeposits() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
