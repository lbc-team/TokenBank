'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSignTypedData } from 'wagmi';
import { parseEther, formatEther, keccak256, encodeAbiParameters } from 'viem';
import { TOKEN_ABI, TOKEN_BANK_PERMIT2_ABI, PERMIT2_ABI } from '@/constants/abis';
import { CONTRACTS_PERMIT2 } from '@/constants/addresses';

const EXPLORER_URL = 'https://sepolia.etherscan.io/tx/';

type AddressType = `0x${string}`;

// Permit2 domain
const PERMIT2_DOMAIN_NAME = 'Permit2';

export default function TokenBankPermit2() {
  const { address, isConnected, chain } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [permit2DepositAmount, setPermit2DepositAmount] = useState('');
  const [permit2Signature, setPermit2Signature] = useState<{
    deadline: number;
    nonce: number;
    amount: bigint;
    signature: `0x${string}`;
  } | null>(null);

  // Read token balance
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: CONTRACTS_PERMIT2.MyToken as AddressType,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read bank balance
  const { data: bankBalance, refetch: refetchBankBalance } = useReadContract({
    address: CONTRACTS_PERMIT2.TokenBankPermit2 as AddressType,
    abi: TOKEN_BANK_PERMIT2_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS_PERMIT2.MyToken as AddressType,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS_PERMIT2.TokenBankPermit2 as AddressType] : undefined,
  });

  // Read Permit2 allowance
  const { data: permit2Allowance } = useReadContract({
    address: CONTRACTS_PERMIT2.MyToken as AddressType,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS_PERMIT2.Permit2 as AddressType] : undefined,
  });

  // Read token symbol
  const { data: tokenSymbol } = useReadContract({
    address: CONTRACTS_PERMIT2.MyToken as AddressType,
    abi: TOKEN_ABI,
    functionName: 'symbol',
    args: [],
  });

  // Approve Permit2
  const { writeContract: approvePermit2, data: approvePermit2Hash, isPending: isApprovingPermit2 } = useWriteContract();
  const { isLoading: isApprovePermit2Confirming, isSuccess: isApprovePermit2Success } = useWaitForTransactionReceipt({ hash: approvePermit2Hash });

  // Approve transaction
  const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  // Deposit transaction
  const { writeContract: deposit, data: depositHash, isPending: isDepositing } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({ hash: depositHash });

  // Permit2 deposit transaction
  const { writeContract: permit2Deposit, data: permit2DepositHash, isPending: isPermit2Depositing } = useWriteContract();
  const { isLoading: isPermit2DepositConfirming, isSuccess: isPermit2DepositSuccess } = useWaitForTransactionReceipt({ hash: permit2DepositHash });

  // Withdraw transaction
  const { writeContract: withdraw, data: withdrawHash, isPending: isWithdrawing } = useWriteContract();
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

  // Sign typed data for Permit2
  const { signTypedData, data: signature, isPending: isSigning } = useSignTypedData();

  // Refetch balances when transactions succeed
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  useEffect(() => {
    if (isDepositSuccess || isPermit2DepositSuccess) {
      refetchTokenBalance();
      refetchBankBalance();
      refetchAllowance();
      setDepositAmount('');
      setPermit2DepositAmount('');
      setPermit2Signature(null); // Clear signature state
    }
  }, [isDepositSuccess, isPermit2DepositSuccess, refetchTokenBalance, refetchBankBalance, refetchAllowance]);

  useEffect(() => {
    if (isWithdrawSuccess) {
      refetchTokenBalance();
      refetchBankBalance();
      setWithdrawAmount('');
    }
  }, [isWithdrawSuccess, refetchTokenBalance, refetchBankBalance]);

  // When signature is received, call depositWithPermit2
  useEffect(() => {
    if (signature && permit2Signature && address) {
      const { deadline, nonce, amount } = permit2Signature;

      const permitTransfer = {
        permitted: {
          token: CONTRACTS_PERMIT2.MyToken,
          amount: amount,
        },
        nonce: BigInt(nonce),
        deadline: BigInt(deadline),
      };

      permit2Deposit({
        address: CONTRACTS_PERMIT2.TokenBankPermit2 as AddressType,
        abi: TOKEN_BANK_PERMIT2_ABI,
        functionName: 'depositWithPermit2',
        args: [permitTransfer, address, signature],
      });
    }
  }, [signature, permit2Signature, address, permit2Deposit]);

  const handleApprovePermit2 = () => {
    approve({
      address: CONTRACTS_PERMIT2.MyToken as AddressType,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [CONTRACTS_PERMIT2.Permit2 as AddressType, parseEther('1000000')], // Approve large amount
    });
  };

  const handleApprove = () => {
    if (!depositAmount) return;
    approve({
      address: CONTRACTS_PERMIT2.MyToken as AddressType,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [CONTRACTS_PERMIT2.TokenBankPermit2 as AddressType, parseEther(depositAmount)],
    });
  };

  const handleDeposit = () => {
    if (!depositAmount) return;
    deposit({
      address: CONTRACTS_PERMIT2.TokenBankPermit2 as AddressType,
      abi: TOKEN_BANK_PERMIT2_ABI,
      functionName: 'deposit',
      args: [parseEther(depositAmount)],
    });
  };

  const handlePermit2Deposit = () => {
    if (!permit2DepositAmount || !address || !chain) return;

    const amount = parseEther(permit2DepositAmount);
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const nonce = Date.now();

    // Store parameters for later use
    setPermit2Signature({
      deadline,
      nonce,
      amount,
      signature: '0x' as `0x${string}`, // Will be updated when signature is received
    });

    // Permit2 domain
    const domain = {
      name: PERMIT2_DOMAIN_NAME,
      chainId: chain.id,
      verifyingContract: CONTRACTS_PERMIT2.Permit2 as AddressType,
    };

    // Permit2 types
    const types = {
      PermitTransferFrom: [
        { name: 'permitted', type: 'TokenPermissions' },
        { name: 'spender', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
      TokenPermissions: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
    };

    const message = {
      permitted: {
        token: CONTRACTS_PERMIT2.MyToken,
        amount: amount,
      },
      spender: CONTRACTS_PERMIT2.TokenBankPermit2,
      nonce: BigInt(nonce),
      deadline: BigInt(deadline),
    };

    signTypedData({
      domain,
      types,
      primaryType: 'PermitTransferFrom',
      message,
    });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    withdraw({
      address: CONTRACTS_PERMIT2.TokenBankPermit2 as AddressType,
      abi: TOKEN_BANK_PERMIT2_ABI,
      functionName: 'withdraw',
      args: [parseEther(withdrawAmount)],
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">TokenBank (Permit2)</h1>
        <p className="text-gray-600">Please connect your wallet to continue.</p>
      </div>
    );
  }

  const hasPermit2Allowance = permit2Allowance && permit2Allowance > BigInt(0);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">TokenBank (Permit2)</h1>
        <p className="text-gray-600">Gasless deposits using Uniswap Permit2 signatures</p>
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
      {(approvePermit2Hash || approveHash || depositHash || permit2DepositHash || withdrawHash) && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Recent Transactions</h3>
          <div className="space-y-2">
            {approvePermit2Hash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Approve Permit2: {isApprovePermit2Confirming ? 'Confirming...' : isApprovePermit2Success ? 'Success' : 'Pending'}
                </span>
                <a
                  href={`${EXPLORER_URL}${approvePermit2Hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View on Etherscan
                </a>
              </div>
            )}
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
            {permit2DepositHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Permit2 Deposit: {isPermit2DepositConfirming ? 'Confirming...' : isPermit2DepositSuccess ? 'Success' : 'Pending'}
                </span>
                <a
                  href={`${EXPLORER_URL}${permit2DepositHash}`}
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

      {/* Permit2 Setup */}
      {!hasPermit2Allowance && (
        <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Setup Required</h2>
          <p className="text-sm text-gray-600 mb-4">
            You need to approve Permit2 contract first (one-time setup)
          </p>
          <button
            onClick={handleApprovePermit2}
            disabled={isApprovingPermit2 || isApprovePermit2Confirming}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            {isApprovingPermit2 || isApprovePermit2Confirming ? 'Approving...' : 'Approve Permit2 Contract'}
          </button>
        </div>
      )}

      {/* Permit2 Deposit Section */}
      {hasPermit2Allowance && (
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-300 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gasless Deposit (Permit2)</h2>
              <p className="text-sm text-gray-600 mt-1">Sign once, deposit without approve for each transaction!</p>
            </div>
            <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-semibold rounded-full">Permit2</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                value={permit2DepositAmount}
                onChange={(e) => setPermit2DepositAmount(e.target.value)}
                placeholder="Enter amount for permit2 deposit"
                className="w-full px-4 py-2 bg-white border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-900"
              />
            </div>
            <button
              onClick={handlePermit2Deposit}
              disabled={isSigning || isPermit2Depositing || isPermit2DepositConfirming || !permit2DepositAmount}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              {isSigning ? 'Signing...' : isPermit2Depositing || isPermit2DepositConfirming ? 'Processing...' : 'Sign & Deposit (Permit2)'}
            </button>
            <div className="text-xs text-gray-600 bg-white p-3 rounded border border-indigo-200">
              <strong>How it works:</strong> Permit2 allows batch approvals and signature-based transfers.
              You sign an off-chain message, then the contract uses your signature to transfer tokens in a single transaction!
            </div>
          </div>
        </div>
      )}

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
