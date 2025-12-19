'use client';
import { ConnectWallet } from './ConnectWallet';
export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-purple-600 text-xl font-bold">TokenBank (EIP-712)</span>
          </div>
          <div className="flex items-center"><ConnectWallet /></div>
        </div>
      </div>
    </nav>
  );
}
