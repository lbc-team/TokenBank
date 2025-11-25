import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, localhost } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'TokenBank DApp',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, sepolia, localhost],
  ssr: true,
});
