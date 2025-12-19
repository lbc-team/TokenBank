#!/bin/bash

# 脚本用于创建和配置 TokenBank 各个版本的分支
# 使用方法: ./create_branches.sh

set -e

echo "🚀 开始创建 TokenBank 各版本分支..."

# 确保在 main 分支
git checkout main

echo ""
echo "📋 将创建以下分支:"
echo "  - tokenbank-v1"
echo "  - tokenbank-v2"
echo "  - tokenbank-eip712"
echo "  - tokenbank-permit2"
echo "  - tokenbank-7702"
echo ""

# ============================================
# TokenBank V1 分支
# ============================================
echo "Creating tokenbank-v1 branch..."
git checkout -b tokenbank-v1 2>/dev/null || git checkout tokenbank-v1

# 删除非 V1 合约
cd contracts/src
rm -f MyTokenV2.sol MyTokenPermit.sol IPermit2.sol Delegate.sol TokenBankV2.sol TokenBankPermit.sol TokenBankPermit2.sol TokenBankV3.sol
cd ../script
rm -f DeployV2.s.sol DeployPermit.s.sol DeployPermit2.s.sol DeployDelegate.s.sol DeployTokenBankV3.s.sol
cd ../../

# 删除非 V1 前端页面
cd frontend/src/app
rm -rf tokenbank-v2 tokenbank-eip712 tokenbank-permit2 tokenbank-7702
cd ../../../

echo "✅ tokenbank-v1 branch created"

# ============================================
# TokenBank V2 分支
# ============================================
echo "Creating tokenbank-v2 branch..."
git checkout main
git checkout -b tokenbank-v2 2>/dev/null || git checkout tokenbank-v2

# 删除非 V2 合约
cd contracts/src
rm -f MyToken.sol MyTokenPermit.sol IPermit2.sol Delegate.sol TokenBank.sol TokenBankPermit.sol TokenBankPermit2.sol TokenBankV3.sol
cd ../script
rm -f Deploy.s.sol DeployPermit.s.sol DeployPermit2.s.sol DeployDelegate.s.sol DeployTokenBankV3.s.sol
cd ../../

# 删除非 V2 前端页面
cd frontend/src/app
rm -rf tokenbank-v1 tokenbank-eip712 tokenbank-permit2 tokenbank-7702
cd ../../../

echo "✅ tokenbank-v2 branch created"

# ============================================
# TokenBank EIP-712 分支
# ============================================
echo "Creating tokenbank-eip712 branch..."
git checkout main
git checkout -b tokenbank-eip712 2>/dev/null || git checkout tokenbank-eip712

# 删除非 EIP-712 合约
cd contracts/src
rm -f MyToken.sol MyTokenV2.sol IPermit2.sol Delegate.sol TokenBank.sol TokenBankV2.sol TokenBankPermit2.sol TokenBankV3.sol
cd ../script
rm -f Deploy.s.sol DeployV2.s.sol DeployPermit2.s.sol DeployDelegate.s.sol DeployTokenBankV3.s.sol
cd ../../

# 删除非 EIP-712 前端页面
cd frontend/src/app
rm -rf tokenbank-v1 tokenbank-v2 tokenbank-permit2 tokenbank-7702
cd ../../../

echo "✅ tokenbank-eip712 branch created"

# ============================================
# TokenBank Permit2 分支
# ============================================
echo "Creating tokenbank-permit2 branch..."
git checkout main
git checkout -b tokenbank-permit2 2>/dev/null || git checkout tokenbank-permit2

# 删除非 Permit2 合约
cd contracts/src
rm -f MyTokenV2.sol MyTokenPermit.sol Delegate.sol TokenBank.sol TokenBankV2.sol TokenBankPermit.sol TokenBankV3.sol
cd ../script
rm -f Deploy.s.sol DeployV2.s.sol DeployPermit.s.sol DeployDelegate.s.sol DeployTokenBankV3.s.sol
cd ../../

# 删除非 Permit2 前端页面
cd frontend/src/app
rm -rf tokenbank-v1 tokenbank-v2 tokenbank-eip712 tokenbank-7702
cd ../../../

echo "✅ tokenbank-permit2 branch created"

# ============================================
# TokenBank 7702 分支
# ============================================
echo "Creating tokenbank-7702 branch..."
git checkout main
git checkout -b tokenbank-7702 2>/dev/null || git checkout tokenbank-7702

# 删除非 7702 合约
cd contracts/src
rm -f MyTokenV2.sol MyTokenPermit.sol IPermit2.sol TokenBankV2.sol TokenBankPermit.sol TokenBankPermit2.sol TokenBankV3.sol
cd ../script
rm -f Deploy.s.sol DeployV2.s.sol DeployPermit.s.sol DeployPermit2.s.sol DeployTokenBankV3.s.sol
cd ../../

# 删除非 7702 前端页面
cd frontend/src/app
rm -rf tokenbank-v1 tokenbank-v2 tokenbank-eip712 tokenbank-permit2
cd ../../../

echo "✅ tokenbank-7702 branch created"

# 回到 main 分支
git checkout main

echo ""
echo "✨ 所有分支创建完成!"
echo ""
echo "📌 查看所有分支:"
git branch
echo ""
echo "💡 使用以下命令切换分支:"
echo "   git checkout tokenbank-v1"
echo "   git checkout tokenbank-v2"
echo "   git checkout tokenbank-eip712"
echo "   git checkout tokenbank-permit2"
echo "   git checkout tokenbank-7702"
echo ""
echo "⚠️  注意: 每个分支的 README.md 和前端配置还需要手动更新"
