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
    └── src/app/page.tsx
```

---

## 如何替换为你自己的合约

### 步骤 1: 修改并部署合约

#### 1.1 修改合约代码（可选）

编辑 `contracts/src/MyToken.sol`:
```solidity
// 修改代币名称和符号
constructor(uint256 initialSupply) ERC20("YourToken", "YTK") {
    _mint(msg.sender, initialSupply);
}
```

#### 1.2 配置环境变量

```bash
cd contracts
cp .env.example .env
```

编辑 `.env` 文件：
```
SEPOLIA_RPC_URL=你的Sepolia RPC URL
```

#### 1.3 编译并部署

```bash
forge build
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --legacy
```

**记录输出的合约地址**：
```
MyToken deployed to: 0x你的MyToken地址
TokenBank deployed to: 0x你的TokenBank地址
```

---

### 步骤 2: 导出合约 ABI

```bash
# 在 contracts 目录下
cat out/MyToken.sol/MyToken.json | jq '.abi' > ../frontend/src/constants/MyToken.abi.json
cat out/TokenBank.sol/TokenBank.json | jq '.abi' > ../frontend/src/constants/TokenBank.abi.json
```

---

### 步骤 3: 更新前端配置

#### 3.1 更新合约地址

编辑 `frontend/src/constants/addresses.ts`:

```typescript
export const CONTRACTS = {
  MyToken: '0x你的MyToken地址',
  TokenBank: '0x你的TokenBank地址',
} as const;
```

#### 3.2 更新 ABI

编辑 `frontend/src/constants/abis.ts`，导入新的 ABI 文件。

---

### 步骤 4: 测试

```bash
cd frontend
npm run dev
```

1. 访问 http://localhost:3000
2. 连接钱包测试功能

---

## 替换检查清单

- [ ] 修改合约代码（如需要）
- [ ] 配置 .env 文件
- [ ] 编译并部署合约
- [ ] 记录合约地址
- [ ] 导出 ABI
- [ ] 更新 addresses.ts
- [ ] 更新 abis.ts
- [ ] 测试功能

---

## 技术栈

**合约**: Solidity 0.8.20, Foundry, OpenZeppelin  
**前端**: Next.js 16, TypeScript, Wagmi, RainbowKit

## License

MIT
