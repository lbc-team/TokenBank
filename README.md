# TokenBank (EIP-712) - Permit 签名存款

使用 EIP-2612 Permit 标准实现 gasless approve。

## 特性

- **EIP-2612 Permit**: 离线签名授权
- **permitDeposit**: 签名后一次性完成授权+存款
- 节省 gas（无需单独 approve 交易）
- 改进的用户体验

## 快速开始

```bash
cd frontend && npm install && npm run dev
cd contracts && forge build
```

## 已部署合约 (Sepolia)

- MyTokenPermit: `0xC0b46a60dAFc4C3218b7e733F74e96e18f0A11ea`
- TokenBankPermit: `0x3952b5ab3e341650c6321b510e5555711e25edc1`

## 核心功能

### permitDeposit

用户签名授权 → 合约验证签名 → 自动 approve → 存款

```solidity
function permitDeposit(
    uint256 amount,
    uint256 deadline,
    uint8 v, bytes32 r, bytes32 s
) external
```

## 技术栈

**合约**: Solidity 0.8.20, OpenZeppelin ERC20Permit  
**前端**: Next.js 16, TypeScript, Wagmi, useSignTypedData

## License

MIT
