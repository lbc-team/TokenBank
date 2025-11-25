// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./IPermit2.sol";

/**
 * @title TokenBankPermit2
 * @dev Token Bank with Permit2 support for gasless signature-based deposits
 *
 * Features:
 * - Traditional deposit/withdraw (with approve)
 * - depositWithPermit2: Deposit using Permit2 signature (no separate approve tx needed)
 * - ReentrancyGuard: Protection against reentrancy attacks
 */
contract TokenBankPermit2 is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Custom errors (gas-efficient)
    error ZeroAmount();
    error ZeroAddress();
    error InsufficientBalance();

    // State variables
    IERC20 public immutable token;
    IPermit2 public immutable permit2;
    mapping(address => uint256) public balances;

    // Events
    event Deposit(address indexed user, uint256 amount);
    event Permit2Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    /**
     * @dev Constructor
     * @param _token Address of the ERC20 token to be used
     * @param _permit2 Address of the Permit2 contract
     */
    constructor(address _token, address _permit2) {
        if (_token == address(0) || _permit2 == address(0)) revert ZeroAddress();
        token = IERC20(_token);
        permit2 = IPermit2(_permit2);
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
     * @dev Deposit using Permit2 signature
     * @param permitTransfer The permit data signed by the user
     * @param owner The owner of the tokens (signer)
     * @param signature The EIP-712 signature
     *
     * This function allows users to deposit in a single transaction without
     * a separate approve transaction, using Permit2 signature.
     */
    function depositWithPermit2(
        IPermit2.PermitTransferFrom calldata permitTransfer,
        address owner,
        bytes calldata signature
    ) external nonReentrant {
        if (permitTransfer.permitted.amount == 0) revert ZeroAmount();
        if (permitTransfer.permitted.token != address(token)) revert("Invalid token");

        // Use Permit2 to transfer tokens from owner to this contract
        IPermit2.SignatureTransferDetails memory transferDetails = IPermit2.SignatureTransferDetails({
            to: address(this),
            requestedAmount: permitTransfer.permitted.amount
        });

        permit2.permitTransferFrom(
            permitTransfer,
            transferDetails,
            owner,
            signature
        );

        // Update balance
        balances[owner] += permitTransfer.permitted.amount;

        emit Permit2Deposit(owner, permitTransfer.permitted.amount);
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
