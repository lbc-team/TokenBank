# TokenBank 分支快速切换指南

## 🚀 快速开始

### 查看所有分支
```bash
git branch -a
```

### 切换到不同版本

```bash
# V1 - 基础版（Approve + TransferFrom）
git checkout tokenbank-v1

# V2 - Hook回调版（一步存款）
git checkout tokenbank-v2

# EIP-712 - Permit签名版（Gasless approve）
git checkout tokenbank-eip712

# Permit2 - Uniswap通用授权版
git checkout tokenbank-permit2

# 7702 - 批量执行版（Delegate模式）
git checkout tokenbank-7702

# 回到主分支（包含所有代码）
git checkout main
```

## 📦 运行项目

切换到任意分支后：

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

## 📊 分支内容对比

| 分支 | 合约 | 脚本 | 页面 |
|------|------|------|------|
| `tokenbank-v1` | MyToken, TokenBank | Deploy.s.sol | /tokenbank-v1 |
| `tokenbank-v2` | MyTokenV2, TokenBankV2 | DeployV2.s.sol | /tokenbank-v2 |
| `tokenbank-eip712` | MyTokenPermit, TokenBankPermit | DeployPermit.s.sol | /tokenbank-eip712 |
| `tokenbank-permit2` | MyToken, IPermit2, TokenBankPermit2 | DeployPermit2.s.sol | /tokenbank-permit2 |
| `tokenbank-7702` | MyToken, TokenBank, Delegate | DeployDelegate.s.sol | /tokenbank-7702 |

## 💡 使用场景

- **学习 ERC20 基础** → `tokenbank-v1`
- **学习 Hook 模式** → `tokenbank-v2`
- **学习签名授权** → `tokenbank-eip712`
- **学习 Permit2** → `tokenbank-permit2`
- **学习批量执行** → `tokenbank-7702`

## 📚 更多信息

详细文档请查看: [BRANCHES.md](./BRANCHES.md)
