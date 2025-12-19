'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSignTypedData } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { TOKEN_PERMIT_ABI, TOKEN_BANK_PERMIT_ABI } from '@/constants/abis';
import { CONTRACTS_PERMIT } from '@/constants/addresses';

const EXPLORER_URL = 'https://sepolia.etherscan.io/tx/';

type AddressType = `0x${string}`;

export default function TokenBankEIP712() {
  const { address, isConnected, chain } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [permitDepositAmount, setPermitDepositAmount] = useState('');
  const [permitSignature, setPermitSignature] = useState<{
    deadline: number;
    amount: bigint;
    signature: `0x${string}`;
  } | null>(null);

  // Read token balance
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: CONTRACTS_PERMIT.MyTokenPermit as AddressType,
    abi: TOKEN_PERMIT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read bank balance
  const { data: bankBalance, refetch: refetchBankBalance } = useReadContract({
    address: CONTRACTS_PERMIT.TokenBankPermit as AddressType,
    abi: TOKEN_BANK_PERMIT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS_PERMIT.MyTokenPermit as AddressType,
    abi: TOKEN_PERMIT_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS_PERMIT.TokenBankPermit as AddressType] : undefined,
  });

  // Read nonce for permit
  const { data: nonce } = useReadContract({
    address: CONTRACTS_PERMIT.MyTokenPermit as AddressType,
    abi: TOKEN_PERMIT_ABI,
    functionName: 'nonces',
    args: address ? [address] : undefined,
  });

  // Read token symbol
  const { data: tokenSymbol } = useReadContract({
    address: CONTRACTS_PERMIT.MyTokenPermit as AddressType,
    abi: TOKEN_PERMIT_ABI,
    functionName: 'symbol',
    args: [],
  });

  // Approve transaction
  const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  // Deposit transaction (traditional way)
  const { writeContract: deposit, data: depositHash, isPending: isDepositing } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({ hash: depositHash });

  // Permit deposit transaction
  const { writeContract: permitDeposit, data: permitDepositHash, isPending: isPermitDepositing } = useWriteContract();
  const { isLoading: isPermitDepositConfirming, isSuccess: isPermitDepositSuccess } = useWaitForTransactionReceipt({ hash: permitDepositHash });

  // Withdraw transaction
  const { writeContract: withdraw, data: withdrawHash, isPending: isWithdrawing } = useWriteContract();
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

  // Sign typed data for permit
  const { signTypedData, data: signature, isPending: isSigning } = useSignTypedData();

  // Refetch balances when transactions succeed
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  useEffect(() => {
    if (isDepositSuccess || isPermitDepositSuccess) {
      refetchTokenBalance();
      refetchBankBalance();
      refetchAllowance();
      setDepositAmount('');
      setPermitDepositAmount('');
      setPermitSignature(null); // Clear signature state
    }
  }, [isDepositSuccess, isPermitDepositSuccess, refetchTokenBalance, refetchBankBalance, refetchAllowance]);

  useEffect(() => {
    if (isWithdrawSuccess) {
      refetchTokenBalance();
      refetchBankBalance();
      setWithdrawAmount('');
    }
  }, [isWithdrawSuccess, refetchTokenBalance, refetchBankBalance]);

  // When signature is received, call permitDeposit
  useEffect(() => {
    if (signature && permitSignature) {
      const { deadline, amount } = permitSignature;

      // Extract v, r, s from signature
      const sig = signature.slice(2); // Remove 0x
      const r = `0x${sig.slice(0, 64)}` as `0x${string}`;
      const s = `0x${sig.slice(64, 128)}` as `0x${string}`;
      const v = parseInt(sig.slice(128, 130), 16);

      permitDeposit({
        address: CONTRACTS_PERMIT.TokenBankPermit as AddressType,
        abi: TOKEN_BANK_PERMIT_ABI,
        functionName: 'permitDeposit',
        args: [amount, BigInt(deadline), v, r, s],
      });
    }
  }, [signature, permitSignature, permitDeposit]);

  const handleApprove = () => {
    if (!depositAmount) return;
    approve({
      address: CONTRACTS_PERMIT.MyTokenPermit as AddressType,
      abi: TOKEN_PERMIT_ABI,
      functionName: 'approve',
      args: [CONTRACTS_PERMIT.TokenBankPermit as AddressType, parseEther(depositAmount)],
    });
  };

  const handleDeposit = () => {
    if (!depositAmount) return;
    deposit({
      address: CONTRACTS_PERMIT.TokenBankPermit as AddressType,
      abi: TOKEN_BANK_PERMIT_ABI,
      functionName: 'deposit',
      args: [parseEther(depositAmount)],
    });
  };

  const handlePermitDeposit = () => {
    if (!permitDepositAmount || !address || !chain) return;

    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const amount = parseEther(permitDepositAmount);

    // Store deadline and amount for later use
    setPermitSignature({
      deadline,
      amount,
      signature: '0x' as `0x${string}`, // Will be updated when signature is received
    });

    // EIP-2612 Permit type data
    const domain = {
      name: 'MyTokenPermit',
      version: '1',
      chainId: chain.id,
      verifyingContract: CONTRACTS_PERMIT.MyTokenPermit as AddressType,
    };

    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    const message = {
      owner: address,
      spender: CONTRACTS_PERMIT.TokenBankPermit as AddressType,
      value: amount,
      nonce: nonce || BigInt(0),
      deadline: BigInt(deadline),
    };

    signTypedData({
      domain,
      types,
      primaryType: 'Permit',
      message,
    });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    withdraw({
      address: CONTRACTS_PERMIT.TokenBankPermit as AddressType,
      abi: TOKEN_BANK_PERMIT_ABI,
      functionName: 'withdraw',
      args: [parseEther(withdrawAmount)],
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">TokenBank (EIP-712)</h1>
        <p className="text-gray-600">Please connect your wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">TokenBank (EIP-712)</h1>
        <p className="text-gray-600">Gasless deposits using EIP-2612 Permit signatures</p>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Wallet Token Balance</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {tokenBalance ? formatEther(tokenBalance as bigint) : '0'} {tokenSymbol || 'MTKP'}
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm text-gray-500 mb-1">Bank Deposit Balance</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {bankBalance ? formatEther(bankBalance as bigint) : '0'} {tokenSymbol || 'MTKP'}
          </p>
        </div>
      </div>

      {/* Transaction Status */}
      {(approveHash || depositHash || permitDepositHash || withdrawHash) && (
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
            {permitDepositHash && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Permit Deposit: {isPermitDepositConfirming ? 'Confirming...' : isPermitDepositSuccess ? 'Success' : 'Pending'}
                </span>
                <a
                  href={`${EXPLORER_URL}${permitDepositHash}`}
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

      {/* Permit Deposit Section (EIP-712 Feature) */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-green-300 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gasless Deposit (EIP-2612)</h2>
            <p className="text-sm text-gray-600 mt-1">Sign once, deposit without gas for approve!</p>
          </div>
          <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">EIP-712</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              value={permitDepositAmount}
              onChange={(e) => setPermitDepositAmount(e.target.value)}
              placeholder="Enter amount for permit deposit"
              className="w-full px-4 py-2 bg-white border border-green-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900"
            />
          </div>
          <button
            onClick={handlePermitDeposit}
            disabled={isSigning || isPermitDepositing || isPermitDepositConfirming || !permitDepositAmount}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
          >
            {isSigning ? 'Signing...' : isPermitDepositing || isPermitDepositConfirming ? 'Processing...' : 'Sign & Deposit (Permit)'}
          </button>
          <div className="text-xs text-gray-600 bg-white p-3 rounded border border-green-200">
            <strong>How it works:</strong> You sign an off-chain message (EIP-712) that approves the TokenBank to spend your tokens.
            Then the contract uses this signature to call permit() and deposit in a single transaction. No separate approve transaction needed!
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
            Current Allowance: {allowance ? formatEther(allowance as bigint) : '0'} {tokenSymbol || 'MTKP'}
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
