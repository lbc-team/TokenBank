import Link from 'next/link';

const features = [
  {
    title: 'TokenBank V1',
    description: 'Basic token deposit and withdrawal functionality using standard ERC20 approve/transferFrom pattern.',
    href: '/tokenbank-v1',
  },
  {
    title: 'TokenBank V2',
    description: 'Enhanced version with additional features and optimizations.',
    href: '/tokenbank-v2',
  },
  {
    title: 'TokenBank (EIP-712)',
    description: 'Token banking with EIP-712 typed data signatures for gasless approvals.',
    href: '/tokenbank-eip712',
  },
  {
    title: 'TokenBank (Permit2)',
    description: 'Integration with Uniswap Permit2 for universal token approvals.',
    href: '/tokenbank-permit2',
  },
  {
    title: 'TokenBank (7702)',
    description: 'Leveraging EIP-7702 for account abstraction capabilities.',
    href: '/tokenbank-7702',
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to TokenBank DApp</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A comprehensive Web3 application demonstrating various token banking implementations
          with different authorization patterns and security features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h2>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Connect your wallet using the button in the navigation bar</li>
          <li>Make sure you have some test tokens (MyToken - MTK)</li>
          <li>Choose a TokenBank version to explore</li>
          <li>Deposit and withdraw tokens to test the functionality</li>
        </ol>
      </div>
    </div>
  );
}
