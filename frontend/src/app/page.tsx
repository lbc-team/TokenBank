import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">TokenBank (Permit2)</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Universal token approvals using Uniswap Permit2
        </p>
      </div>

      <div className="max-w-2xl mx-auto mt-12">
        <Link
          href="/tokenbank-permit2"
          className="block p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 hover:shadow-lg transition-all"
        >
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Open TokenBank (Permit2)</h2>
          <p className="text-gray-700 mb-4">
            One approval for all DApps - powered by Uniswap Permit2
          </p>
          <div className="text-indigo-600 font-medium">
            Get Started →
          </div>
        </Link>
      </div>

      <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Universal Approval</strong>: Approve once for all DApps</li>
          <li><strong>Permit2 Signatures</strong>: Flexible signature-based transfers</li>
          <li><strong>Bitmap Nonce</strong>: Advanced nonce management</li>
          <li>Production-grade security (Uniswap audited)</li>
          <li>Multi-chain compatible</li>
        </ul>
      </div>
    </div>
  );
}
