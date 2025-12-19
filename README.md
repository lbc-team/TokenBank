# TokenBank V1 - 基础代币银行 DApp

标准 ERC20 代币存取功能演示项目。

## 特性

- 标准 ERC20 代币 (MyToken)
- 基础存取合约 (TokenBank)
- Approve/TransferFrom 模式
- Next.js 16 前端
- 实时余额显示

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:3000
```

### 合约

```bash
cd contracts
forge build
forge test
```

## 已部署合约 (Sepolia)

- MyToken: `0xd6c393ffd2916d93f5dd842fb1ed0c6de5a2f142`
- TokenBank: `0x685ae42b1f178b6235053233182e75bd4d85e402`

## 项目结构

```
TokenBank/
├── contracts/
│   ├── src/
│   │   ├── MyToken.sol
│   │   └── TokenBank.sol
│   └── script/Deploy.s.sol
└── frontend/
    └── src/app/tokenbank-v1/
```

## 使用流程

1. 连接钱包
2. Approve TokenBank
3. Deposit 代币
4. Withdraw 代币

## 技术栈

**合约**: Solidity 0.8.20, Foundry, OpenZeppelin
**前端**: Next.js 16, TypeScript, Wagmi, RainbowKit, Tailwind CSS

## License

MIT
