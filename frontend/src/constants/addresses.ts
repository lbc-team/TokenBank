// Contract addresses - Sepolia Testnet only

// V1 Contracts
export const CONTRACTS_V1 = {
  MyToken: '0xd6c393ffd2916d93f5dd842fb1ed0c6de5a2f142',
  TokenBank: '0x685ae42b1f178b6235053233182e75bd4d85e402',
} as const;

// V2 Contracts
export const CONTRACTS_V2 = {
  MyTokenV2: '0x2023Bb8d3e166fcA393BB1D1229E74f5D47939e0',
  TokenBankV2: '0x2219d42014E190D0C4349A6A189f4d11bc92669B',
} as const;

// Permit (EIP-2612) Contracts
export const CONTRACTS_PERMIT = {
  MyTokenPermit: '0xC0b46a60dAFc4C3218b7e733F74e96e18f0A11ea',
  TokenBankPermit: '0x3952b5ab3e341650c6321b510e5555711e25edc1',
} as const;

// Permit2 Contracts
export const CONTRACTS_PERMIT2 = {
  MyToken: '0x5f294752D1987050d3c50B12fad5D47972eb515D',
  TokenBankPermit2: '0x5eda0b5fb6c8bd6f19981f2f5ac67555c35e58b2',
  Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3', // Official Uniswap Permit2 on Sepolia
} as const;

// Delegate Contract (EIP-7702)
export const CONTRACTS_DELEGATE = {
  Delegate: '0xD842b1A2551dB2F691745984076F3b4bf87485c8',
} as const;

// 默认导出V1（向后兼容）
export const CONTRACTS = CONTRACTS_V1;
