# TokenBank (Permit2) - Uniswap 通用授权

基于 Uniswap Permit2 的通用代币授权系统。

## 特性

- 通用授权：一次授权，所有 DApp 可用
- Permit2 签名：灵活的签名转账
- 生产级安全：Uniswap 审计

## 快速开始

```bash
cd frontend && npm install && npm run dev
cd contracts && forge build
```

## 已部署合约 (Sepolia)

- MyToken: `0x5f294752D1987050d3c50B12fad5D47972eb515D`
- TokenBankPermit2: `0x5eda0b5fb6c8bd6f19981f2f5ac67555c35e58b2`
- Permit2 (Official): `0x000000000022D473030F116dDEE9F6B43aC78BA3`

---

## 如何替换为你自己的合约

### 1. 部署合约

```bash
cd contracts
cp .env.example .env
# 编辑 .env

forge build
forge script script/DeployPermit2.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --legacy
```

### 2. 导出 ABI

```bash
cat out/MyToken.sol/MyToken.json | jq '.abi' > ../frontend/src/constants/MyToken.abi.json
cat out/TokenBankPermit2.sol/TokenBankPermit2.json | jq '.abi' > ../frontend/src/constants/TokenBankPermit2.abi.json
```

### 3. 更新前端

编辑 `frontend/src/constants/addresses.ts`:
```typescript
export const CONTRACTS = {
  MyToken: '0x你的地址',
  TokenBankPermit2: '0x你的地址',
  Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3', // 使用官方
} as const;
```

### 4. 测试

```bash
cd frontend && npm run dev
```

## 使用流程

1. 授权 Permit2 合约（一次性）
2. 签名授权特定金额
3. 调用 depositWithPermit2

## 技术栈

**合约**: Solidity 0.8.20, Uniswap Permit2  
**前端**: Next.js 16, TypeScript, Wagmi

## License

MIT
