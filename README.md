# TokenBank V2 - Hook Callback 模式

增强版代币银行，支持一步存款操作（无需 approve）。

## 特性

- **transferWithCallback**: 一步完成存款
- **ITokenReceiver Hook**: 智能合约回调接口  
- **向后兼容**: 仍支持标准 deposit
- Next.js 16 前端
- 实时余额显示

## 快速开始

```bash
# 前端
cd frontend && npm install && npm run dev

# 合约
cd contracts && forge build
```

## 已部署合约 (Sepolia)

- MyTokenV2: `0x2023Bb8d3e166fcA393BB1D1229E74f5D47939e0`
- TokenBankV2: `0x2219d42014E190D0C4349A6A189f4d11bc92669B`

---

## 如何替换为你自己的合约

### 步骤 1: 部署合约

```bash
cd contracts
cp .env.example .env
# 编辑 .env 填入 PRIVATE_KEY 和 SEPOLIA_RPC_URL

forge build
forge script script/DeployV2.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --legacy
```

记录输出的合约地址。

### 步骤 2: 导出 ABI

```bash
cat out/MyTokenV2.sol/MyTokenV2.json | jq '.abi' > ../frontend/src/constants/MyTokenV2.abi.json
cat out/TokenBankV2.sol/TokenBankV2.json | jq '.abi' > ../frontend/src/constants/TokenBankV2.abi.json
```

### 步骤 3: 更新前端

编辑 `frontend/src/constants/addresses.ts`:
```typescript
export const CONTRACTS = {
  MyTokenV2: '0x你的地址',
  TokenBankV2: '0x你的地址',
} as const;
```

编辑 `frontend/src/constants/abis.ts` 导入新的 ABI。

### 步骤 4: 测试

```bash
cd frontend && npm run dev
```

访问 http://localhost:3000 测试功能。

---

## 核心改进

**V1 (两步)**:
1. approve(bank, amount)
2. deposit(amount)

**V2 (一步)**:
```solidity
token.transferWithCallback(bank, amount, data)
```

TokenBank 通过 `onTokenReceived` 回调自动记录余额。

---

## 技术栈

**合约**: Solidity 0.8.20, Foundry, OpenZeppelin  
**前端**: Next.js 16, TypeScript, Wagmi, RainbowKit

## License

MIT
