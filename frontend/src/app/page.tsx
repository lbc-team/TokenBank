'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { TOKEN_ABI, TOKEN_BANK_ABI } from '@/constants/abis';
import { CONTRACTS } from '@/constants/addresses';

const EXPLORER_URL = 'https://sepolia.etherscan.io/tx/';

export default function TokenBankV1() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Read token balance
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: CONTRACTS.MyToken as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read bank balance
  const { data: bankBalance, refetch: refetchBankBalance } = useReadContract({
    address: CONTRACTS.TokenBank as `0x${string}`,
    abi: TOKEN_BANK_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.MyToken as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.TokenBank as `0x${string}`] : undefined,
  });

  // Read token symbol
  const { data: tokenSymbol } = useReadContract({
    address: CONTRACTS.MyToken as `0x${string}`,
    abi: TOKEN_ABI,
    functionName: 'symbol',
    args: [],
  });

  // Approve transaction
  const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  // Deposit transaction
  const { writeContract: deposit, data: depositHash, isPending: isDepositing } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({ hash: depositHash });

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
    if (isDepositSuccess) {
      refetchTokenBalance();
      refetchBankBalance();
      refetchAllowance();
      setDepositAmount('');
    }
  }, [isDepositSuccess, refetchTokenBalance, refetchBankBalance, refetchAllowance]);

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
      address: CONTRACTS.MyToken as `0x${string}`,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [CONTRACTS.TokenBank as `0x${string}`, parseEther(depositAmount)],
    });
  };

  const handleDeposit = () => {
    if (!depositAmount) return;
    deposit({
      address: CONTRACTS.TokenBank as `0x${string}`,
      abi: TOKEN_BANK_ABI,
      functionName: 'deposit',
      args: [parseEther(depositAmount)],
    });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    withdraw({
      address: CONTRACTS.TokenBank as `0x${string}`,
      abi: TOKEN_BANK_ABI,
      functionName: 'withdraw',
      args: [parseEther(withdrawAmount)],
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">TokenBank V1</h1>
        <p className="text-gray-600">Please connect your wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">TokenBank V1</h1>
        <p className="text-gray-600">Basic deposit and withdrawal using approve/transferFrom</p>
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
      {(approveHash || depositHash || withdrawHash) && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Recent Transactions</h3>
          <div className="space-y-2">
            {approveHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Approve: {isApproveConfirming ? '⏳ Confirming...' : isApproveSuccess ? '✅ Success' : '📝 Pending'}
                </span>
                <a
                  href={`${EXPLORER_URL}${approveHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Etherscan →
                </a>
              </div>
            )}
            {depositHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Deposit: {isDepositConfirming ? '⏳ Confirming...' : isDepositSuccess ? '✅ Success' : '📝 Pending'}
                </span>
                <a
                  href={`${EXPLORER_URL}${depositHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Etherscan →
                </a>
              </div>
            )}
            {withdrawHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Withdraw: {isWithdrawConfirming ? '⏳ Confirming...' : isWithdrawSuccess ? '✅ Success' : '📝 Pending'}
                </span>
                <a
                  href={`${EXPLORER_URL}${withdrawHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Etherscan →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deposit Section */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Deposit Tokens</h2>
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
