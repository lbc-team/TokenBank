# TokenBank (EIP-7702) - 批量执行

使用 Delegate 合约实现批量操作的 TokenBank。

## 特性

- 批量执行：一个交易执行多个操作
- Delegate 合约：智能合约代理模式
- Gas 优化：降低交易成本
- 原子性：全部成功或全部失败

## 快速开始

```bash
cd frontend && npm install && npm run dev
cd contracts && forge build
```

## 已部署合约 (Sepolia)

- MyToken: `0xd6c393ffd2916d93f5dd842fb1ed0c6de5a2f142`
- TokenBank: `0x685ae42b1f178b6235053233182e75bd4d85e402`
- Delegate: `0xD842b1A2551dB2F691745984076F3b4bf87485c8`

---

## 如何替换为你自己的合约

### 1. 部署合约

```bash
cd contracts
cp .env.example .env
# 编辑 .env

# 先部署 Token 和 Bank（如果还没有）
forge build
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --legacy

# 再部署 Delegate
forge script script/DeployDelegate.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --legacy
```

### 2. 导出 ABI

```bash
cat out/MyToken.sol/MyToken.json | jq '.abi' > ../frontend/src/constants/MyToken.abi.json
cat out/TokenBank.sol/TokenBank.json | jq '.abi' > ../frontend/src/constants/TokenBank.abi.json
cat out/Delegate.sol/Delegate.json | jq '.abi' > ../frontend/src/constants/Delegate.abi.json
```

### 3. 更新前端

编辑 `frontend/src/constants/addresses.ts`:
```typescript
export const CONTRACTS = {
  MyToken: '0x你的Token地址',
  TokenBank: '0x你的Bank地址',
  Delegate: '0x你的Delegate地址',
} as const;
```

### 4. 测试

```bash
cd frontend && npm run dev
```

## 核心功能

### depositToBank

一个交易完成：
1. 转账代币到 Delegate
2. Delegate 授权 TokenBank
3. 调用 depositFor 存款

**注意**: 当前使用的是 V1 TokenBank，需要部署 TokenBankV3 支持 depositFor 函数。

## 技术栈

**合约**: Solidity 0.8.20, Batch Execution  
**前端**: Next.js 16, TypeScript, Wagmi

## License

MIT
