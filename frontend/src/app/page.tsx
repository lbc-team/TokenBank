'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { TOKEN_V2_ABI, TOKEN_BANK_V2_ABI } from '@/constants/abis';
import { CONTRACTS_V2 } from '@/constants/addresses';

const EXPLORER_URL = 'https://sepolia.etherscan.io/tx/';

type AddressType = `0x${string}`;

export default function TokenBankV2() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [directDepositAmount, setDirectDepositAmount] = useState('');

  // Read token balance
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: CONTRACTS_V2.MyTokenV2 as AddressType,
    abi: TOKEN_V2_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read bank balance
  const { data: bankBalance, refetch: refetchBankBalance } = useReadContract({
    address: CONTRACTS_V2.TokenBankV2 as AddressType,
    abi: TOKEN_BANK_V2_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS_V2.MyTokenV2 as AddressType,
    abi: TOKEN_V2_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS_V2.TokenBankV2 as AddressType] : undefined,
  });

  // Read token symbol
  const { data: tokenSymbol } = useReadContract({
    address: CONTRACTS_V2.MyTokenV2 as AddressType,
    abi: TOKEN_V2_ABI,
    functionName: 'symbol',
    args: [],
  });

  // Approve transaction
  const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  // Deposit transaction (traditional way)
  const { writeContract: deposit, data: depositHash, isPending: isDepositing } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({ hash: depositHash });

  // Direct deposit via transferWithCallback
  const { writeContract: directDeposit, data: directDepositHash, isPending: isDirectDepositing } = useWriteContract();
  const { isLoading: isDirectDepositConfirming, isSuccess: isDirectDepositSuccess } = useWaitForTransactionReceipt({ hash: directDepositHash });

  // Withdraw transaction
  const { writeContract: withdraw, data: withdrawHash, isPending: isWithdrawing } = useWriteContract();
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

  // Refetch balances when transactions succeed
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  useEffect(() => {
    if (isDepositSuccess || isDirectDepositSuccess) {
      refetchTokenBalance();
      refetchBankBalance();
      refetchAllowance();
      setDepositAmount('');
      setDirectDepositAmount('');
    }
  }, [isDepositSuccess, isDirectDepositSuccess, refetchTokenBalance, refetchBankBalance, refetchAllowance]);

  useEffect(() => {
    if (isWithdrawSuccess) {
      refetchTokenBalance();
      refetchBankBalance();
      setWithdrawAmount('');
    }
  }, [isWithdrawSuccess, refetchTokenBalance, refetchBankBalance]);

  const handleApprove = () => {
    if (!depositAmount) return;
    approve({
      address: CONTRACTS_V2.MyTokenV2 as AddressType,
      abi: TOKEN_V2_ABI,
      functionName: 'approve',
      args: [CONTRACTS_V2.TokenBankV2 as AddressType, parseEther(depositAmount)],
    });
  };

  const handleDeposit = () => {
    if (!depositAmount) return;
    deposit({
      address: CONTRACTS_V2.TokenBankV2 as AddressType,
      abi: TOKEN_BANK_V2_ABI,
      functionName: 'deposit',
      args: [parseEther(depositAmount)],
    });
  };

  const handleDirectDeposit = () => {
    if (!directDepositAmount) return;
    directDeposit({
      address: CONTRACTS_V2.MyTokenV2 as AddressType,
      abi: TOKEN_V2_ABI,
      functionName: 'transferWithCallback',
      args: [CONTRACTS_V2.TokenBankV2 as AddressType, parseEther(directDepositAmount)],
    });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    withdraw({
      address: CONTRACTS_V2.TokenBankV2 as AddressType,
      abi: TOKEN_BANK_V2_ABI,
      functionName: 'withdraw',
      args: [parseEther(withdrawAmount)],
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">TokenBank V2</h1>
        <p className="text-gray-600">Please connect your wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">TokenBank V2</h1>
        <p className="text-gray-600">Enhanced version with transferWithCallback hook support</p>
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

      {/* Transaction Status */}
      {(approveHash || depositHash || directDepositHash || withdrawHash) && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Recent Transactions</h3>
          <div className="space-y-2">
            {approveHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Approve: {isApproveConfirming ? 'Confirming...' : isApproveSuccess ? 'Success' : 'Pending'}
                </span>
                <a
                  href={`${EXPLORER_URL}${approveHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Etherscan
                </a>
              </div>
            )}
            {depositHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Deposit: {isDepositConfirming ? 'Confirming...' : isDepositSuccess ? 'Success' : 'Pending'}
                </span>
                <a
                  href={`${EXPLORER_URL}${depositHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Etherscan
                </a>
              </div>
            )}
            {directDepositHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Direct Deposit: {isDirectDepositConfirming ? 'Confirming...' : isDirectDepositSuccess ? 'Success' : 'Pending'}
                </span>
                <a
                  href={`${EXPLORER_URL}${directDepositHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Etherscan
                </a>
              </div>
            )}
            {withdrawHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Withdraw: {isWithdrawConfirming ? 'Confirming...' : isWithdrawSuccess ? 'Success' : 'Pending'}
                </span>
                <a
                  href={`${EXPLORER_URL}${withdrawHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Etherscan
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Direct Deposit Section (New Feature in V2) */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-300 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Direct Deposit (One-Step)</h2>
            <p className="text-sm text-gray-600 mt-1">Use transferWithCallback - No approve needed!</p>
          </div>
          <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">V2 Feature</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              value={directDepositAmount}
              onChange={(e) => setDirectDepositAmount(e.target.value)}
              placeholder="Enter amount for direct deposit"
              className="w-full px-4 py-2 bg-white border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900"
            />
          </div>
          <button
            onClick={handleDirectDeposit}
            disabled={isDirectDepositing || isDirectDepositConfirming || !directDepositAmount}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            {isDirectDepositing || isDirectDepositConfirming ? 'Processing...' : 'Direct Deposit (transferWithCallback)'}
          </button>
          <div className="text-xs text-gray-600 bg-white p-3 rounded border border-purple-200">
            <strong>How it works:</strong> This uses transferWithCallback which automatically calls the TokenBank tokensReceived function, completing the deposit in a single transaction without needing separate approve!
          </div>
        </div>
      </div>

      {/* Traditional Deposit Section */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Traditional Deposit (Two-Step)</h2>
          <span className="px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full">V1 Compatible</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount to deposit"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
            />
          </div>
          <div className="text-sm text-gray-600">
            Current Allowance: {allowance ? formatEther(allowance as bigint) : '0'} {tokenSymbol || 'MTK'}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleApprove}
              disabled={isApproving || isApproveConfirming || !depositAmount}
              className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              {isApproving || isApproveConfirming ? 'Approving...' : 'Approve'}
            </button>
            <button
              onClick={handleDeposit}
              disabled={isDepositing || isDepositConfirming || !depositAmount}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              {isDepositing || isDepositConfirming ? 'Depositing...' : 'Deposit'}
            </button>
          </div>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Withdraw Tokens</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
            />
          </div>
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing || isWithdrawConfirming || !withdrawAmount}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            {isWithdrawing || isWithdrawConfirming ? 'Withdrawing...' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
}
