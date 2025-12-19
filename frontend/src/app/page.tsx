import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">TokenBank V1</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A basic Web3 token banking application demonstrating standard ERC20 deposit and withdrawal functionality
          using the approve/transferFrom pattern.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mt-12">
        <Link
          href="/tokenbank-v1"
          className="block p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Open TokenBank V1</h2>
          <p className="text-gray-700 mb-4">
            Basic token deposit and withdrawal functionality using standard ERC20 approve/transferFrom pattern.
          </p>
          <div className="text-blue-600 font-medium">
            Get Started →
          </div>
        </Link>
      </div>

      <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Standard ERC20 token deposit and withdrawal</li>
          <li>Approve and TransferFrom pattern</li>
          <li>Balance tracking for each user</li>
          <li>Real-time balance updates</li>
          <li>Transaction history on Etherscan</li>
        </ul>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Connect your wallet using the button in the navigation bar</li>
          <li>Make sure you have some test tokens (MyToken - MTK) on Sepolia</li>
          <li>Approve TokenBank to spend your tokens</li>
          <li>Deposit tokens to the bank</li>
          <li>Withdraw tokens back to your wallet anytime</li>
        </ol>
      </div>
    </div>
  );
}
