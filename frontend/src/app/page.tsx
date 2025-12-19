import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">TokenBank (EIP-7702)</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Batch execution using Delegate contract pattern
        </p>
      </div>

      <div className="max-w-2xl mx-auto mt-12">
        <Link
          href="/tokenbank-7702"
          className="block p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-300 hover:border-purple-500 hover:shadow-lg transition-all"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Open TokenBank (EIP-7702)</h2>
          <p className="text-gray-700 mb-4">
            Execute multiple operations in a single transaction
          </p>
          <div className="text-purple-600 font-medium">
            Get Started →
          </div>
        </Link>
      </div>

      <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Batch Execution</strong>: Multiple operations in one tx</li>
          <li><strong>Delegate Pattern</strong>: Smart contract delegation</li>
          <li><strong>Gas Savings</strong>: Reduced transaction costs</li>
          <li><strong>Atomic Operations</strong>: All-or-nothing execution</li>
        </ul>
      </div>
    </div>
  );
}
