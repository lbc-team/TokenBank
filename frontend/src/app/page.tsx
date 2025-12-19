import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">TokenBank V2</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enhanced token banking with Hook callback pattern for one-step deposits
        </p>
      </div>

      <div className="max-w-2xl mx-auto mt-12">
        <Link
          href="/tokenbank-v2"
          className="block p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300 hover:border-green-500 hover:shadow-lg transition-all"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Open TokenBank V2</h2>
          <p className="text-gray-700 mb-4">
            One-step deposit using transferWithCallback - no separate approve needed!
          </p>
          <div className="text-green-600 font-medium">
            Get Started →
          </div>
        </Link>
      </div>

      <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>transferWithCallback</strong>: One-step deposit without approve</li>
          <li><strong>ITokenReceiver Hook</strong>: Smart contract callback interface</li>
          <li><strong>Backward Compatible</strong>: Still supports standard deposit</li>
          <li>Real-time balance updates</li>
          <li>Transaction history on Etherscan</li>
        </ul>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Connect your wallet</li>
          <li>Get some MyTokenV2 (MTV) on Sepolia</li>
          <li>Try <strong>One-Step Deposit</strong> - no approve needed!</li>
          <li>Or use traditional Approve + Deposit</li>
          <li>Withdraw anytime</li>
        </ol>
      </div>
    </div>
  );
}
