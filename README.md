# TokenBank V2 - Hook Callback 模式

增强版代币银行，支持一步存款操作（无需 approve）。

## 特性

- **transferWithCallback**: 一步完成存款
- **ITokenReceiver Hook**: 智能合约回调接口  
- **向后兼容**: 仍支持标准 deposit
- Next.js 16 前端
- 实时余额显示

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

### 合约

```bash
cd contracts
forge build
forge test
```

## 已部署合约 (Sepolia)

- MyTokenV2: `0x2023Bb8d3e166fcA393BB1D1229E74f5D47939e0`
- TokenBankV2: `0x2219d42014E190D0C4349A6A189f4d11bc92669B`

## 项目结构

```
TokenBank/
├── contracts/
│   ├── src/
│   │   ├── MyTokenV2.sol
│   │   └── TokenBankV2.sol
│   └── script/DeployV2.s.sol
└── frontend/
    └── src/app/tokenbank-v2/
```

## 核心改进

### V1 vs V2

**V1 (两步)**:
1. approve(bank, amount)
2. deposit(amount)

**V2 (一步)**:
```solidity
token.transferWithCallback(bank, amount, data)
```

TokenBank 自动通过 `onTokenReceived` 回调接收代币并记录余额。

## 技术栈

**合约**: Solidity 0.8.20, Foundry, OpenZeppelin  
**前端**: Next.js 16, TypeScript, Wagmi, RainbowKit

## License

MIT
