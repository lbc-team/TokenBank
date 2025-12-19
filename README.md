# TokenBank (EIP-7702) - 批量执行

使用 Delegate 合约实现批量操作的 TokenBank。

## 特性

- **批量执行**: 一个交易执行多个操作
- **Delegate 合约**: 智能合约代理模式
- **Gas 优化**: 降低交易成本
- **原子性**: 全部成功或全部失败

## 快速开始

```bash
cd frontend && npm install && npm run dev
cd contracts && forge build
```

## 已部署合约 (Sepolia)

- MyToken: `0xd6c393ffd2916d93f5dd842fb1ed0c6de5a2f142`
- TokenBank: `0x685ae42b1f178b6235053233182e75bd4d85e402`
- Delegate: `0xD842b1A2551dB2F691745984076F3b4bf87485c8`

## 核心功能

### depositToBank

一个交易完成：
1. 转账代币到 Delegate
2. Delegate 授权 TokenBank
3. 调用 depositFor 存款

**注意**: 需要部署 TokenBankV3 支持 depositFor 函数。

## 技术栈

**合约**: Solidity 0.8.20, Batch Execution  
**前端**: Next.js 16, TypeScript, Wagmi

## License

MIT
