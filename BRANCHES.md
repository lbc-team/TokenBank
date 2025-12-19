# TokenBank 项目分支说明

## 分支结构

本项目已按功能拆分为 **6 个分支**，每个分支独立完整，可单独使用和学习。

### 分支列表

| 分支名 | 说明 | 核心特性 |
|--------|------|----------|
| `main` | 主分支 | 包含所有版本的完整代码 |
| `tokenbank-v1` | 基础版 | 标准 ERC20 存取，Approve/TransferFrom 模式 |
| `tokenbank-v2` | Hook版 | transferWithCallback 一步存款 |
| `tokenbank-eip712` | Permit版 | EIP-2612 签名授权，gasless approve |
| `tokenbank-permit2` | Permit2版 | Uniswap Permit2 通用授权 |
| `tokenbank-7702` | 批量执行版 | Delegate 合约批量操作 |

---

## 分支详情

### 🔵 tokenbank-v1 (基础版)

**切换命令**: `git checkout tokenbank-v1`

**包含内容**:
- 合约: `MyToken.sol`, `TokenBank.sol`
- 部署脚本: `Deploy.s.sol`
- 前端页面: `/tokenbank-v1`

**已部署**:
- MyToken: `0xd6c393ffd2916d93f5dd842fb1ed0c6de5a2f142`
- TokenBank: `0x685ae42b1f178b6235053233182e75bd4d85e402`

**特点**: 最基础的实现，适合初学者理解 ERC20 和代币银行概念。

---

### 🟢 tokenbank-v2 (Hook版)

**切换命令**: `git checkout tokenbank-v2`

**包含内容**:
- 合约: `MyTokenV2.sol`, `TokenBankV2.sol`
- 部署脚本: `DeployV2.s.sol`
- 前端页面: `/tokenbank-v2`

**已部署**:
- MyTokenV2: `0x2023Bb8d3e166fcA393BB1D1229E74f5D47939e0`
- TokenBankV2: `0x2219d42014E190D0C4349A6A189f4d11bc92669B`

**特点**: 通过 Hook 回调实现一步存款，无需单独 approve。

---

### 🟣 tokenbank-eip712 (Permit版)

**切换命令**: `git checkout tokenbank-eip712`

**包含内容**:
- 合约: `MyTokenPermit.sol`, `TokenBankPermit.sol`
- 部署脚本: `DeployPermit.s.sol`
- 前端页面: `/tokenbank-eip712`

**已部署**:
- MyTokenPermit: `0xC0b46a60dAFc4C3218b7e733F74e96e18f0A11ea`
- TokenBankPermit: `0x3952b5ab3e341650c6321b510e5555711e25edc1`

**特点**: 使用 EIP-2612 Permit 签名，实现 gasless approve。

---

### 🔷 tokenbank-permit2 (Permit2版)

**切换命令**: `git checkout tokenbank-permit2`

**包含内容**:
- 合约: `MyToken.sol`, `IPermit2.sol`, `TokenBankPermit2.sol`
- 部署脚本: `DeployPermit2.s.sol`
- 前端页面: `/tokenbank-permit2`

**已部署**:
- MyToken: `0x5f294752D1987050d3c50B12fad5D47972eb515D`
- TokenBankPermit2: `0x5eda0b5fb6c8bd6f19981f2f5ac67555c35e58b2`
- Permit2 (Uniswap): `0x000000000022D473030F116dDEE9F6B43aC78BA3`

**特点**: 基于 Uniswap Permit2，一次授权多个 DApp 可用。

---

### 🟪 tokenbank-7702 (批量执行版)

**切换命令**: `git checkout tokenbank-7702`

**包含内容**:
- 合约: `MyToken.sol`, `TokenBank.sol`, `Delegate.sol`
- 部署脚本: `DeployDelegate.s.sol`
- 前端页面: `/tokenbank-7702`

**已部署**:
- MyToken: `0xd6c393ffd2916d93f5dd842fb1ed0c6de5a2f142`
- TokenBank: `0x685ae42b1f178b6235053233182e75bd4d85e402`
- Delegate: `0xD842b1A2551dB2F691745984076F3b4bf87485c8`

**特点**: 使用 Delegate 合约实现批量操作，一个交易完成多个步骤。

---

## 使用指南

### 1. 克隆项目

```bash
# 克隆主分支（包含所有代码）
git clone <repo-url>
cd TokenBank

# 或者直接克隆特定分支
git clone -b tokenbank-v1 <repo-url>
```

### 2. 切换分支

```bash
# 查看所有分支
git branch -a

# 切换到特定分支
git checkout tokenbank-v1      # 切换到 V1
git checkout tokenbank-v2      # 切换到 V2
git checkout tokenbank-eip712  # 切换到 EIP-712
git checkout tokenbank-permit2 # 切换到 Permit2
git checkout tokenbank-7702    # 切换到 7702
git checkout main              # 回到主分支
```

### 3. 运行项目

每个分支都是独立完整的，按照该分支的 README.md 操作即可：

```bash
# 前端
cd frontend
npm install
npm run dev

# 合约
cd contracts
forge build
forge test
```

---

## 分支对比

| 功能 | V1 | V2 | EIP-712 | Permit2 | 7702 |
|------|----|----|---------|---------|------|
| 标准 Deposit | ✅ | ✅ | ✅ | ✅ | ✅ |
| 需要 Approve | ✅ | ❌ | ❌ | ✅* | ✅ |
| 一步存款 | ❌ | ✅ | ✅ | ✅ | ✅ |
| Gasless Approve | ❌ | ❌ | ✅ | ✅ | ❌ |
| 批量操作 | ❌ | ❌ | ❌ | ❌ | ✅ |
| 学习难度 | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

*Permit2 需要先授权 Permit2 合约（一次性）

---

## 学习建议

### 初学者路线

1. **tokenbank-v1**: 理解 ERC20 基础和 approve/transferFrom 模式
2. **tokenbank-v2**: 学习 Hook 回调模式
3. **tokenbank-eip712**: 掌握签名和 Permit 标准
4. **tokenbank-permit2**: 了解 Uniswap Permit2 通用授权
5. **tokenbank-7702**: 探索批量执行和 Delegate 模式

### 进阶开发者

可以直接查看感兴趣的分支，每个分支都有完整的合约和前端实现。

---

## 注意事项

1. **分支独立**: 每个分支的代码是独立的，修改不会影响其他分支
2. **README**: 每个分支都有自己的 README.md，说明该版本的特性和使用方法
3. **合约地址**: 每个分支的 `frontend/src/constants/addresses.ts` 只包含该版本的合约地址
4. **main 分支**: 保持不变，包含所有版本的完整代码，作为参考和对比

---

## 技术栈

所有分支共用：
- **合约**: Solidity ^0.8.20, Foundry, OpenZeppelin
- **前端**: Next.js 16, TypeScript, Wagmi v2, Viem v2, RainbowKit, Tailwind CSS 4

---

## 贡献

欢迎提交 Issue 和 Pull Request！针对特定版本的改进，请切换到对应分支后提交。

---

## License

MIT

---

**Happy Learning! 🚀**
