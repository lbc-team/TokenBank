# TokenBank (EIP-712) - Permit 签名存款

使用 EIP-2612 Permit 标准实现 gasless approve。

## 特性

- EIP-2612 Permit 离线签名授权
- permitDeposit 签名后一次性完成授权+存款
- 节省 gas（无需单独 approve 交易）

## 快速开始

```bash
cd frontend && npm install && npm run dev
cd contracts && forge build
```

## 已部署合约 (Sepolia)

- MyTokenPermit: `0xC0b46a60dAFc4C3218b7e733F74e96e18f0A11ea`
- TokenBankPermit: `0x3952b5ab3e341650c6321b510e5555711e25edc1`

---

## 如何替换为你自己的合约

### 1. 部署合约

```bash
cd contracts
cp .env.example .env
# 编辑 .env

forge build
forge script script/DeployPermit.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --legacy
```

### 2. 导出 ABI

```bash
cat out/MyTokenPermit.sol/MyTokenPermit.json | jq '.abi' > ../frontend/src/constants/MyTokenPermit.abi.json
cat out/TokenBankPermit.sol/TokenBankPermit.json | jq '.abi' > ../frontend/src/constants/TokenBankPermit.abi.json
```

### 3. 更新前端

编辑 `frontend/src/constants/addresses.ts`:
```typescript
export const CONTRACTS = {
  MyTokenPermit: '0x你的地址',
  TokenBankPermit: '0x你的地址',
} as const;
```

### 4. 测试

```bash
cd frontend && npm run dev
```

## 技术栈

**合约**: Solidity 0.8.20, OpenZeppelin ERC20Permit  
**前端**: Next.js 16, TypeScript, Wagmi useSignTypedData

## License

MIT
