// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenBankPermit
 * @dev Token Bank with EIP-2612 Permit support for gasless deposits
 *
 * Features:
 * - Traditional deposit/withdraw (with approve)
 * - permitDeposit: Deposit using EIP-2612 signature (no separate approve tx needed)
 * - ReentrancyGuard: Protection against reentrancy attacks
 */
contract TokenBankPermit is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Custom errors (gas-efficient)
    error ZeroAmount();
    error ZeroAddress();
    error InsufficientBalance();
    error PermitFailed();

    // State variables
    IERC20 public immutable token;
    mapping(address => uint256) public balances;

    // Events
    event Deposit(address indexed user, uint256 amount);
    event PermitDeposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    /**
     * @dev Constructor
     * @param _token Address of the ERC20 token to be used
     */
    constructor(address _token) {
        if (_token == address(0)) revert ZeroAddress();
        token = IERC20(_token);
    }

    /**
     * @dev Traditional deposit (requires prior approve)
     * @param amount Amount of tokens to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        token.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;

        emit Deposit(msg.sender, amount);
    }

    /**
     * @dev Deposit using EIP-2612 permit signature
     * @param amount Amount of tokens to deposit
     * @param deadline Timestamp until which the signature is valid
     * @param v ECDSA signature parameter
     * @param r ECDSA signature parameter
     * @param s ECDSA signature parameter
     *
     * This function allows users to deposit in a single transaction without
     * a separate approve transaction, using an off-chain signature.
     */
    function permitDeposit(
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        // Call permit on the token contract
        try IERC20Permit(address(token)).permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        ) {
            // Permit succeeded, now transfer tokens
            token.safeTransferFrom(msg.sender, address(this), amount);
            balances[msg.sender] += amount;

            emit PermitDeposit(msg.sender, amount);
        } catch {
            revert PermitFailed();
        }
    }

    /**
     * @dev Withdraw tokens from the bank
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        balances[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount);
    }

    /**
     * @dev Get the balance of a user
     * @param account Address to query
     * @return Balance of the account
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
