'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, encodeFunctionData } from 'viem';
import { TOKEN_ABI, TOKEN_BANK_ABI } from '@/constants/abis';
import { CONTRACTS, CONTRACTS_DELEGATE } from '@/constants/addresses';

const EXPLORER_URL = 'https://sepolia.etherscan.io/tx/';

type AddressType = `0x${string}`;

// Delegate ABI for batch execution
const DELEGATE_ABI = [
  {
    type: 'function',
    name: 'executeBatch',
    inputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        components: [
          { name: 'target', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'data', type: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: 'results', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
] as const;

export default function TokenBank7702() {
  const { address, isConnected } = useAccount();
  const [batchAmount, setBatchAmount] = useState('');

  // Read token balance
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: CONTRACTS.MyToken as AddressType,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read bank balance
  const { data: bankBalance, refetch: refetchBankBalance } = useReadContract({
    address: CONTRACTS.TokenBank as AddressType,
    abi: TOKEN_BANK_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read token symbol
  const { data: tokenSymbol } = useReadContract({
    address: CONTRACTS.MyToken as AddressType,
    abi: TOKEN_ABI,
    functionName: 'symbol',
    args: [],
  });

  // Read token allowance for Delegate
  const { data: delegateAllowance, refetch: refetchDelegateAllowance } = useReadContract({
    address: CONTRACTS.MyToken as AddressType,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS_DELEGATE.Delegate as AddressType] : undefined,
  });

  const hasDelegateAllowance = delegateAllowance && delegateAllowance > BigInt(0);

  // Approve Delegate contract
  const { writeContract: approveDelegate, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  // Batch transaction via Delegate
  const { writeContract: executeBatch, data: batchHash, isPending: isBatchPending } = useWriteContract();
  const { isLoading: isBatchConfirming, isSuccess: isBatchSuccess } = useWaitForTransactionReceipt({ hash: batchHash });

  // Refetch balances when transactions succeed
  useEffect(() => {
    if (isApproveSuccess) {
      refetchDelegateAllowance();
    }
  }, [isApproveSuccess, refetchDelegateAllowance]);

  useEffect(() => {
    if (isBatchSuccess) {
      refetchTokenBalance();
      refetchBankBalance();
      setBatchAmount('');
    }
  }, [isBatchSuccess, refetchTokenBalance, refetchBankBalance]);

  const handleApproveDelegate = () => {
    approveDelegate({
      address: CONTRACTS.MyToken as AddressType,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [CONTRACTS_DELEGATE.Delegate as AddressType, parseEther('1000000')], // Large approval
    });
  };

  const handleBatchDeposit = () => {
    if (!batchAmount || !address) return;

    const amount = parseEther(batchAmount);

    // Call depositToBank function which does:
    // 1. transferFrom user to Delegate
    // 2. approve TokenBank
    // 3. call depositFor to credit user's balance
    executeBatch({
      address: CONTRACTS_DELEGATE.Delegate as AddressType,
      abi: [
        {
          type: 'function',
          name: 'depositToBank',
          inputs: [
            { name: 'token', type: 'address' },
            { name: 'bank', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
      ] as const,
      functionName: 'depositToBank',
      args: [CONTRACTS.MyToken as AddressType, CONTRACTS.TokenBank as AddressType, amount],
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">TokenBank (EIP-7702)</h1>
        <p className="text-gray-600">Please connect your wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">TokenBank (EIP-7702)</h1>
        <p className="text-gray-600">Batch execution using Delegate contract</p>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Wallet Token Balance</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {tokenBalance ? formatEther(tokenBalance as bigint) : '0'} {tokenSymbol || 'MTK'}
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Bank Deposit Balance</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {bankBalance ? formatEther(bankBalance as bigint) : '0'} {tokenSymbol || 'MTK'}
          </p>
        </div>
      </div>

      {/* Setup Section - Approve Delegate if needed */}
      {!hasDelegateAllowance && (
        <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Setup Required</h3>
              <p className="text-sm text-gray-700 mb-4">
                Before using batch deposit, you need to approve the Delegate contract to spend your tokens (one-time setup).
              </p>
              <button
                onClick={handleApproveDelegate}
                disabled={isApprovePending || isApproveConfirming}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
              >
                {isApprovePending || isApproveConfirming ? 'Approving...' : 'Approve Delegate Contract'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Transaction Status */}
      {approveHash && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-sm font-semibold text-green-900 mb-2">Approval Transaction</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              Status: {isApproveConfirming ? 'Confirming...' : isApproveSuccess ? 'Success' : 'Pending'}
            </span>
            <a
              href={`${EXPLORER_URL}${approveHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 underline"
            >
              View on Etherscan
            </a>
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {batchHash && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Batch Transaction</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              Status: {isBatchConfirming ? 'Confirming...' : isBatchSuccess ? 'Success' : 'Pending'}
            </span>
            <a
              href={`${EXPLORER_URL}${batchHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View on Etherscan
            </a>
          </div>
        </div>
      )}

      {/* EIP-7702 Notice */}
      <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-300 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">About EIP-7702</h3>
            <p className="text-sm text-gray-700 mb-2">
              EIP-7702 is a proposed standard that allows EOA (Externally Owned Accounts) to temporarily delegate their code to a smart contract, enabling batch operations in a single transaction.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> EIP-7702 is not yet fully supported on Sepolia. This page demonstrates the Delegate contract pattern that would be used with EIP-7702.
            </p>
          </div>
        </div>
      </div>

      {/* Batch Deposit Section */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-300 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Batch Deposit (Approve + Deposit)</h2>
            <p className="text-sm text-gray-600 mt-1">Execute approve and deposit in one transaction using Delegate contract</p>
          </div>
          <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">EIP-7702</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              value={batchAmount}
              onChange={(e) => setBatchAmount(e.target.value)}
              placeholder="Enter amount for batch deposit"
              className="w-full px-4 py-2 bg-white border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900"
            />
          </div>
          <button
            onClick={handleBatchDeposit}
            disabled={isBatchPending || isBatchConfirming || !batchAmount || !hasDelegateAllowance}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            {isBatchPending || isBatchConfirming ? 'Processing...' : 'Batch Deposit via Delegate'}
          </button>
          <div className="text-xs text-gray-600 bg-white p-3 rounded border border-purple-200">
            <strong>How it works (All in ONE transaction!):</strong>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>Delegate transfers tokens from you to itself</li>
              <li>Delegate approves TokenBank to spend tokens</li>
              <li>Delegate calls depositFor() to credit YOUR balance</li>
            </ol>
            <p className="mt-2 font-semibold text-purple-700">Three operations executed in a single transaction - this is the power of batch execution!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
