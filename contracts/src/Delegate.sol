// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Delegate
 * @dev EIP-7702 Delegate contract for batch execution
 *
 * This contract serves as a delegate for EOA accounts using EIP-7702.
 * It allows EOAs to temporarily adopt this contract's code to execute
 * batch operations in a single transaction.
 *
 * Features:
 * - Batch execution: Execute multiple calls in one transaction
 * - Token bank deposit helper: Approve and deposit in one transaction
 * - Reentrancy protection
 * - Flexible call targets and data
 */
contract Delegate is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Custom errors
    error BatchExecutionFailed(uint256 index, bytes reason);
    error EmptyBatch();

    // Events
    event BatchExecuted(address indexed sender, uint256 callCount);
    event CallExecuted(address indexed target, uint256 value, bytes data);
    event TokenBankDeposit(address indexed user, address indexed token, address indexed bank, uint256 amount);

    /**
     * @dev Struct to represent a single call
     */
    struct Call {
        address target;    // Target contract address
        uint256 value;     // ETH value to send
        bytes data;        // Calldata to execute
    }

    /**
     * @dev Execute multiple calls in a single transaction
     * @param calls Array of Call structs to execute
     * @return results Array of return data from each call
     *
     * This function allows batch execution of multiple contract calls.
     * All calls are executed sequentially. If any call fails, the entire
     * transaction reverts with details about which call failed.
     */
    function executeBatch(Call[] calldata calls)
        external
        payable
        nonReentrant
        returns (bytes[] memory results)
    {
        if (calls.length == 0) revert EmptyBatch();

        results = new bytes[](calls.length);

        for (uint256 i = 0; i < calls.length; i++) {
            Call calldata call = calls[i];

            // Execute the call
            (bool success, bytes memory result) = call.target.call{value: call.value}(call.data);

            if (!success) {
                // Decode revert reason if available
                revert BatchExecutionFailed(i, result);
            }

            results[i] = result;
            emit CallExecuted(call.target, call.value, call.data);
        }

        emit BatchExecuted(msg.sender, calls.length);

        return results;
    }

    /**
     * @dev Approve token and deposit to bank in one transaction
     * @param token ERC20 token address
     * @param bank TokenBank contract address
     * @param amount Amount to deposit
     *
     * This function helps users deposit tokens through batch execution.
     * User must have approved this Delegate contract to spend their tokens first.
     *
     * Flow:
     * 1. Transfer tokens from user to this contract
     * 2. Approve bank to spend tokens
     * 3. Call bank.depositFor(user, amount)
     * 4. Bank credits balance to user's address
     *
     * Compatible with TokenBankV3 which has depositFor() function.
     */
    function depositToBank(
        address token,
        address bank,
        uint256 amount
    ) external nonReentrant {
        // Transfer tokens from user to this contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Approve bank to spend our tokens
        IERC20(token).forceApprove(bank, amount);

        // Call bank's depositFor function to credit user's balance
        (bool success, ) = bank.call(
            abi.encodeWithSignature("depositFor(address,uint256)", msg.sender, amount)
        );

        require(success, "Bank deposit failed");

        emit TokenBankDeposit(msg.sender, token, bank, amount);
    }

    /**
     * @dev Execute a single call (convenience function)
     * @param target Target contract address
     * @param value ETH value to send
     * @param data Calldata to execute
     * @return result Return data from the call
     */
    function execute(
        address target,
        uint256 value,
        bytes calldata data
    ) external payable nonReentrant returns (bytes memory result) {
        (bool success, bytes memory returnData) = target.call{value: value}(data);

        if (!success) {
            revert BatchExecutionFailed(0, returnData);
        }

        emit CallExecuted(target, value, data);
        return returnData;
    }

    /**
     * @dev Allow contract to receive ETH
     */
    receive() external payable {}
}
