# TokenBank DApp - Web3教学项目

一个功能完整的Web3 DApp教学项目，包含智能合约和前端界面，演示代币银行存取功能。

**本项目专为Web3学习者设计，具有高度可定制性和可替换性。**

---

## 目录

- [特性](#特性)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [功能对比](#功能对比)
- [已部署合约](#已部署合约-sepolia)
- [如何定制为你自己的项目](#如何定制为你自己的项目)
- [技术栈](#技术栈)
- [开发命令](#开发命令)

---

## 特性

- **完整的合约实现** - ERC20代币 + TokenBank存取合约
- **现代化前端** - Next.js 16 + TypeScript + Tailwind CSS
- **多版本支持** - V1(基础版) + V2(Hook回调版) + EIP-712(Permit签名版) + Permit2(Uniswap签名版) + EIP-7702(批量执行版)
- **易于定制** - 模块化设计，方便替换合约和页面
- **教学友好** - 详细注释和配置指南
- **生产就绪** - 安全最佳实践和完整的错误处理

---

## 快速开始

### 环境要求

- Node.js 18+
- Foundry (forge, cast)
- Git

### 安装 Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 前端运行

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000

### 合约开发

```bash
cd contracts
forge build
forge test
```

---

## 项目结构

```
TokenBank/
├── contracts/              # Foundry智能合约
│   ├── src/
│   │   ├── MyToken.sol          # ERC20代币 (V1)
│   │   ├── MyTokenV2.sol        # 带Hook的ERC20 (V2)
│   │   ├── MyTokenPermit.sol    # 带EIP-2612 Permit的ERC20
│   │   ├── IPermit2.sol         # Uniswap Permit2接口
│   │   ├── Delegate.sol         # EIP-7702批量执行合约
│   │   ├── TokenBank.sol        # V1存取合约
│   │   ├── TokenBankV2.sol      # V2存取合约
│   │   ├── TokenBankPermit.sol  # EIP-712 Permit存取合约
│   │   └── TokenBankPermit2.sol # Uniswap Permit2存取合约
│   └── script/
│       ├── Deploy.s.sol         # V1部署脚本
│       ├── DeployV2.s.sol       # V2部署脚本
│       ├── DeployPermit.s.sol   # Permit版部署脚本
│       ├── DeployPermit2.s.sol  # Permit2版部署脚本
│       └── DeployDelegate.s.sol # Delegate部署脚本
│
└── frontend/               # Next.js前端
    ├── src/
    │   ├── app/                 # 页面路由
    │   │   ├── tokenbank-v1/    # V1页面
    │   │   ├── tokenbank-v2/    # V2页面
    │   │   ├── tokenbank-eip712/ # EIP-712页面
    │   │   ├── tokenbank-permit2/ # Permit2页面
    │   │   └── tokenbank-7702/  # EIP-7702页面
    │   ├── components/          # 组件
    │   ├── config/              # Wagmi配置
    │   └── constants/           # 合约配置 (重要!)
    │       ├── abis.ts          # ABI定义
    │       └── addresses.ts     # 合约地址
    └── package.json
```

---

## 功能对比

### TokenBank V1 (基础版)
- Approve + TransferFrom 模式
- Deposit: 存入代币
- Withdraw: 提取代币
- 查看余额和授权额度
- 交易链接展示

### TokenBank V2 (增强版)
- **所有V1功能**
- **transferWithCallback**: 一步完成存款（无需approve！）
- Hook接口 (ITokenReceiver)
- 向后兼容V1方式

### TokenBank EIP-712 (Permit签名版)
- **所有V1功能**
- **Gasless Approve**: 使用EIP-2612 Permit签名授权
- **permitDeposit**: 签名后一次性完成授权+存款
- 节省gas费用（无需单独approve交易）
- 离线签名，提升用户体验

### TokenBank Permit2 (Uniswap签名版)
- **所有V1功能**
- **批量授权**: 一次性授权Permit2合约，支持多个应用
- **depositWithPermit2**: 使用Permit2签名进行存款
- 更灵活的nonce管理（bitmap模式）
- 支持部分授权和过期时间控制
- 基于Uniswap生产级Permit2标准

### TokenBank EIP-7702 (批量执行版)
- **批量操作**: 在单个交易中执行多个操作
- **executeBatch**: 通过Delegate合约批量执行approve + deposit
- **节省时间和Gas**: 一次交易完成两个操作
- **防重入保护**: ReentrancyGuard安全机制
- **灵活调用**: 支持任意目标合约和调用数据

---

## 已部署示例合约 (Sepolia)

### V1 合约
| 合约 | 地址 |
|------|------|
| MyToken | `0xd6c393ffd2916d93f5dd842fb1ed0c6de5a2f142` |
| TokenBank | `0x685ae42b1f178b6235053233182e75bd4d85e402` |

### V2 合约
| 合约 | 地址 |
|------|------|
| MyTokenV2 | `0x2023Bb8d3e166fcA393BB1D1229E74f5D47939e0` |
| TokenBankV2 | `0x2219d42014E190D0C4349A6A189f4d11bc92669B` |

### Permit (EIP-712) 合约
| 合约 | 地址 |
|------|------|
| MyTokenPermit | `0xC0b46a60dAFc4C3218b7e733F74e96e18f0A11ea` |
| TokenBankPermit | `0x3952B5aB3e341650C6321b510e5555711E25EdC1` |

### Permit2 (Uniswap) 合约
| 合约 | 地址 |
|------|------|
| MyToken | `0x5f294752D1987050d3c50B12fad5D47972eb515D` |
| TokenBankPermit2 | `0x5EDa0B5FB6C8bD6f19981F2f5AC67555C35e58B2` |
| Permit2 (Official) | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |

### EIP-7702 (Delegate) 合约
| 合约 | 地址 |
|------|------|
| Delegate | `0xD842b1A2551dB2F691745984076F3b4bf87485c8` |

[在Etherscan上查看](https://sepolia.etherscan.io/)

---

## 如何定制为你自己的项目

本项目设计为高度可替换的教学模板，你可以轻松替换为自己的合约和前端代码。

### 第一步：部署你的合约

#### 1.1 编写或修改合约

在 `contracts/src/` 目录下创建或修改你的合约：

```solidity
// YourToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YourToken is ERC20 {
    constructor() ERC20("YourToken", "YTK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}
```

```solidity
// YourBank.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract YourBank {
    using SafeERC20 for IERC20;

    IERC20 public token;
    mapping(address => uint256) public balances;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function deposit(uint256 amount) external {
        token.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
```

#### 1.2 创建部署脚本

在 `contracts/script/` 目录下创建部署脚本：

```solidity
// DeployYours.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/YourToken.sol";
import "../src/YourBank.sol";

contract DeployYours is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        YourToken token = new YourToken();
        YourBank bank = new YourBank(address(token));

        console.log("YourToken deployed to:", address(token));
        console.log("YourBank deployed to:", address(bank));

        vm.stopBroadcast();
    }
}
```

#### 1.3 部署到测试网

```bash
cd contracts

# 设置环境变量
export PRIVATE_KEY=你的私钥
export RPC_URL=https://eth-sepolia.g.alchemy.com/v2/你的API_KEY

# 部署
forge script script/DeployYours.s.sol --rpc-url $RPC_URL --broadcast

# 记录输出的合约地址
# YourToken deployed to: 0x...
# YourBank deployed to: 0x...
```

### 第二步：更新前端配置

#### 2.1 更新合约地址

编辑 `frontend/src/constants/addresses.ts`：

```typescript
// 替换为你的合约地址
export const CONTRACTS_V1 = {
  MyToken: '0xYourTokenAddress',
  TokenBank: '0xYourBankAddress',
} as const;

// 如果有V2版本
export const CONTRACTS_V2 = {
  MyTokenV2: '0xYourTokenV2Address',
  TokenBankV2: '0xYourBankV2Address',
} as const;

// 默认使用V1
export const CONTRACTS = CONTRACTS_V1;
```

#### 2.2 更新合约ABI

**方法一：使用 Foundry 导出 ABI**

```bash
cd contracts
forge inspect YourToken abi > your-token-abi.json
forge inspect YourBank abi > your-bank-abi.json
```

**方法二：手动编写最小化 ABI**

编辑 `frontend/src/constants/abis.ts`，只需要包含前端会用到的函数：

```typescript
export const YOUR_TOKEN_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

export const YOUR_BANK_ABI = [
  {
    type: "function",
    name: "deposit",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  // 添加事件 (可选，用于监听)
  {
    type: "event",
    name: "Deposit",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
  },
] as const;
```

**重要提示**：
- 使用 `as const` 确保类型推断正确
- 只包含前端需要的函数，减少代码体积
- 事件是可选的，但有助于监听交易状态

### 第三步：创建或修改前端页面

#### 选项A：修改现有页面

直接修改 `src/app/tokenbank-v1/page.tsx`，更新导入的ABI和地址：

```typescript
import { YOUR_TOKEN_ABI, YOUR_BANK_ABI } from '@/constants/abis';
import { YOUR_CONTRACTS } from '@/constants/addresses';
```

#### 选项B：创建新页面

```bash
# 复制模板
cp -r frontend/src/app/tokenbank-v1 frontend/src/app/your-bank
```

然后编辑 `frontend/src/app/your-bank/page.tsx`：

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { YOUR_TOKEN_ABI, YOUR_BANK_ABI } from '@/constants/abis';
import { YOUR_CONTRACTS } from '@/constants/addresses';

type AddressType = `0x${string}`;

export default function YourBankPage() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');

  // 读取余额
  const { data: balance, refetch } = useReadContract({
    address: YOUR_CONTRACTS.YourToken as AddressType,
    abi: YOUR_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // 写入合约
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  const handleDeposit = () => {
    writeContract({
      address: YOUR_CONTRACTS.YourBank as AddressType,
      abi: YOUR_BANK_ABI,
      functionName: 'deposit',
      args: [parseEther(amount)],
    });
  };

  if (!isConnected) {
    return <div>Please connect wallet</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Your Token Bank</h1>
      <p>Balance: {balance ? formatEther(balance as bigint) : '0'} YTK</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />
      <button
        onClick={handleDeposit}
        disabled={isPending}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isPending ? 'Processing...' : 'Deposit'}
      </button>
    </div>
  );
}
```

### 第四步：添加导航

修改 `frontend/src/components/Navbar.tsx`：

```typescript
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tokenbank-v1', label: 'TokenBank V1' },
  { href: '/tokenbank-v2', label: 'TokenBank V2' },
  { href: '/your-bank', label: 'Your Bank' },  // 添加这行
];
```

### 第五步：测试

```bash
cd frontend
npm run dev
```

访问 http://localhost:3000/your-bank

---

## TokenBank EIP-712 版本开发指南

EIP-712 版本使用 EIP-2612 Permit 标准，允许用户通过离线签名授权代币，无需单独的 approve 交易。

### EIP-712 合约开发

#### 1. Token合约（带Permit）

```solidity
// MyTokenPermit.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyTokenPermit is ERC20, ERC20Permit, Ownable {
    constructor(uint256 initialSupply)
        ERC20("MyTokenPermit", "MTKP")
        ERC20Permit("MyTokenPermit")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

**关键点**：
- 继承 `ERC20Permit` 获得 EIP-2612 支持
- `permit()` 函数允许使用签名进行授权
- `nonces()` 跟踪每个地址的签名计数

#### 2. TokenBank合约（支持Permit）

```solidity
// TokenBankPermit.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TokenBankPermit is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    mapping(address => uint256) public balances;

    event PermitDeposit(address indexed user, uint256 amount);

    constructor(address _token) {
        token = IERC20(_token);
    }

    // 传统存款方式
    function deposit(uint256 amount) external nonReentrant {
        token.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
    }

    // Permit存款 - 一次性完成签名授权和存款
    function permitDeposit(
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        // 使用permit签名进行授权
        IERC20Permit(address(token)).permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );

        // 转账和记录
        token.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;

        emit PermitDeposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
```

**关键点**：
- `permitDeposit()` 接收 EIP-712 签名参数 (v, r, s)
- 先调用 token 的 `permit()` 进行授权
- 然后立即执行 `transferFrom` 和余额更新
- 全部在一个交易中完成，节省gas

#### 3. 部署脚本

```solidity
// DeployPermit.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyTokenPermit.sol";
import "../src/TokenBankPermit.sol";

contract DeployPermit is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MyTokenPermit token = new MyTokenPermit(1_000_000);
        console.log("MyTokenPermit deployed to:", address(token));

        TokenBankPermit bank = new TokenBankPermit(address(token));
        console.log("TokenBankPermit deployed to:", address(bank));

        vm.stopBroadcast();
    }
}
```

### EIP-712 前端开发

#### 1. 更新配置文件

**addresses.ts**:
```typescript
export const CONTRACTS_PERMIT = {
  MyTokenPermit: '0xYourTokenPermitAddress',
  TokenBankPermit: '0xYourBankPermitAddress',
} as const;
```

**abis.ts**:
```typescript
export const TOKEN_PERMIT_ABI = [
  ...TOKEN_ABI,  // 包含基础ERC20函数
  {
    type: "function",
    name: "permit",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "nonces",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "DOMAIN_SEPARATOR",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
] as const;

export const TOKEN_BANK_PERMIT_ABI = [
  ...TOKEN_BANK_ABI,
  {
    type: "function",
    name: "permitDeposit",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
```

#### 2. 实现签名存款功能

核心代码示例：

```typescript
import { useSignTypedData } from 'wagmi';

// 读取nonce
const { data: nonce } = useReadContract({
  address: CONTRACTS_PERMIT.MyTokenPermit,
  abi: TOKEN_PERMIT_ABI,
  functionName: 'nonces',
  args: [address],
});

// 签名Hook
const { signTypedData, data: signature } = useSignTypedData();

// 处理Permit存款
const handlePermitDeposit = () => {
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1小时有效期
  const amount = parseEther(permitDepositAmount);

  // EIP-712 类型化数据
  const domain = {
    name: 'MyTokenPermit',
    version: '1',
    chainId: chain.id,
    verifyingContract: CONTRACTS_PERMIT.MyTokenPermit,
  };

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };

  const message = {
    owner: address,
    spender: CONTRACTS_PERMIT.TokenBankPermit,
    value: amount,
    nonce: nonce || BigInt(0),
    deadline: BigInt(deadline),
  };

  // 请求用户签名
  signTypedData({
    domain,
    types,
    primaryType: 'Permit',
    message,
  });
};

// 签名成功后调用permitDeposit
useEffect(() => {
  if (signature) {
    // 解析签名
    const sig = signature.slice(2);
    const r = `0x${sig.slice(0, 64)}`;
    const s = `0x${sig.slice(64, 128)}`;
    const v = parseInt(sig.slice(128, 130), 16);

    // 调用合约
    permitDeposit({
      address: CONTRACTS_PERMIT.TokenBankPermit,
      abi: TOKEN_BANK_PERMIT_ABI,
      functionName: 'permitDeposit',
      args: [amount, BigInt(deadline), v, r, s],
    });
  }
}, [signature]);
```

### EIP-712 的优势

1. **节省Gas**: 用户无需单独发送approve交易
2. **更好的UX**: 只需一次签名，所有操作在一个交易中完成
3. **离线签名**: 签名可以在离线状态下进行
4. **安全性**: 使用标准化的EIP-712结构化数据签名

### 注意事项

1. **Domain配置**: `name`和`version`必须与合约中ERC20Permit的构造函数参数一致
2. **Nonce管理**: 每次签名都会消耗一个nonce，确保读取最新的nonce值
3. **Deadline**: 签名有时效性，过期后无效
4. **ChainId**: 签名绑定到特定链，防止重放攻击

---

## TokenBank Permit2 版本开发指南

Permit2 是 Uniswap 开发的通用签名授权系统，允许用户一次性授权给 Permit2 合约，然后通过签名授权任意 DApp 使用代币，无需为每个 DApp 单独 approve。

### Permit2 合约开发

#### 1. Permit2 接口定义

首先创建 Permit2 接口（基于 Uniswap 标准）：

```solidity
// IPermit2.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPermit2 {
    struct TokenPermissions {
        address token;
        uint256 amount;
    }

    struct PermitTransferFrom {
        TokenPermissions permitted;
        uint256 nonce;
        uint256 deadline;
    }

    struct SignatureTransferDetails {
        address to;
        uint256 requestedAmount;
    }

    function permitTransferFrom(
        PermitTransferFrom memory permit,
        SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external;

    function nonceBitmap(address owner, uint256 wordPos)
        external view returns (uint256);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
}
```

**关键点**：
- `TokenPermissions`: 指定代币地址和授权金额
- `PermitTransferFrom`: 完整的许可结构（包含nonce和deadline）
- `SignatureTransferDetails`: 转账目标和金额
- `nonceBitmap`: Permit2使用bitmap管理nonce，更灵活高效

#### 2. TokenBankPermit2 合约

```solidity
// TokenBankPermit2.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./IPermit2.sol";

contract TokenBankPermit2 is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    IPermit2 public immutable permit2;
    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Permit2Deposit(address indexed user, uint256 amount);

    error ZeroAmount();
    error InsufficientBalance();

    constructor(address _token, address _permit2) {
        token = IERC20(_token);
        permit2 = IPermit2(_permit2);
    }

    // 传统存款方式 (需要先approve本合约)
    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        token.safeTransferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;

        emit Deposit(msg.sender, amount);
    }

    // Permit2存款 - 使用Permit2签名进行存款
    function depositWithPermit2(
        IPermit2.PermitTransferFrom calldata permitTransfer,
        address owner,
        bytes calldata signature
    ) external nonReentrant {
        if (permitTransfer.permitted.amount == 0) revert ZeroAmount();

        // 构造转账详情
        IPermit2.SignatureTransferDetails memory transferDetails =
            IPermit2.SignatureTransferDetails({
                to: address(this),
                requestedAmount: permitTransfer.permitted.amount
            });

        // 使用Permit2进行签名转账
        permit2.permitTransferFrom(
            permitTransfer,
            transferDetails,
            owner,
            signature
        );

        // 更新余额
        balances[owner] += permitTransfer.permitted.amount;

        emit Permit2Deposit(owner, permitTransfer.permitted.amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();

        balances[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
```

**关键点**：
- 存储 Permit2 合约地址作为 immutable 变量
- `depositWithPermit2()` 调用 Permit2 的 `permitTransferFrom`
- Permit2 会验证签名并直接执行 token 转账
- 支持传统 deposit 方法作为备选方案

#### 3. 部署脚本

```solidity
// DeployPermit2.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyToken.sol";
import "../src/TokenBankPermit2.sol";

contract DeployPermit2 is Script {
    // Uniswap Permit2 在 Sepolia 的官方地址
    address constant PERMIT2 = 0x000000000022D473030F116dDEE9F6B43aC78BA3;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 部署新的Token (标准ERC20即可)
        MyToken token = new MyToken(1_000_000 * 10**18);
        console.log("MyToken deployed to:", address(token));

        // 部署 TokenBankPermit2，传入 Permit2 地址
        TokenBankPermit2 bank = new TokenBankPermit2(
            address(token),
            PERMIT2
        );
        console.log("TokenBankPermit2 deployed to:", address(bank));

        vm.stopBroadcast();
    }
}
```

**关键点**：
- **不需要部署 Permit2**：直接使用 Uniswap 在各链上的官方部署
- Sepolia Permit2 地址: `0x000000000022D473030F116dDEE9F6B43aC78BA3`
- Mainnet 也有相同地址的 Permit2 合约

### Permit2 前端开发

#### 1. 更新配置文件

**addresses.ts**:
```typescript
export const CONTRACTS_PERMIT2 = {
  MyToken: '0xYourTokenAddress',
  TokenBankPermit2: '0xYourBankPermit2Address',
  Permit2: '0x000000000022D473030F116dDEE9F6B43aC78BA3', // Uniswap官方Permit2
} as const;
```

**abis.ts**:
```typescript
// Permit2 ABI (只需要用到的函数)
export const PERMIT2_ABI = [
  {
    type: "function",
    name: "permitTransferFrom",
    inputs: [
      {
        name: "permit",
        type: "tuple",
        components: [
          {
            name: "permitted",
            type: "tuple",
            components: [
              { name: "token", type: "address" },
              { name: "amount", type: "uint256" },
            ],
          },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      {
        name: "transferDetails",
        type: "tuple",
        components: [
          { name: "to", type: "address" },
          { name: "requestedAmount", type: "uint256" },
        ],
      },
      { name: "owner", type: "address" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "DOMAIN_SEPARATOR",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
] as const;

// TokenBankPermit2 ABI
export const TOKEN_BANK_PERMIT2_ABI = [
  ...TOKEN_BANK_ABI,  // 包含基础函数
  {
    type: "function",
    name: "depositWithPermit2",
    inputs: [
      {
        name: "permitTransfer",
        type: "tuple",
        components: [
          {
            name: "permitted",
            type: "tuple",
            components: [
              { name: "token", type: "address" },
              { name: "amount", type: "uint256" },
            ],
          },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      { name: "owner", type: "address" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Permit2Deposit",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
  },
] as const;
```

#### 2. 实现 Permit2 签名存款功能

**核心实现流程**：

```typescript
import { useSignTypedData, useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

export default function TokenBankPermit2Page() {
  const { address, chain } = useAccount();
  const [permit2DepositAmount, setPermit2DepositAmount] = useState('');

  // 检查用户是否已授权 Permit2
  const { data: permit2Allowance } = useReadContract({
    address: CONTRACTS_PERMIT2.MyToken,
    abi: TOKEN_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS_PERMIT2.Permit2] : undefined,
  });

  const hasPermit2Allowance = permit2Allowance && permit2Allowance > BigInt(0);

  // 签名Hook
  const { signTypedData, data: signature } = useSignTypedData();

  // 写入合约Hook
  const { writeContract: permit2Deposit } = useWriteContract();

  // 第一步：授权 Permit2 (一次性操作)
  const handleApprovePermit2 = () => {
    approve({
      address: CONTRACTS_PERMIT2.MyToken,
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [
        CONTRACTS_PERMIT2.Permit2,
        parseEther('1000000') // 大额授权，后续无需重复
      ],
    });
  };

  // 第二步：创建 Permit2 签名
  const handlePermit2Deposit = () => {
    const amount = parseEther(permit2DepositAmount);
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1小时
    const nonce = Date.now(); // 使用时间戳作为nonce

    // Permit2 的 domain
    const domain = {
      name: 'Permit2',
      chainId: chain.id,
      verifyingContract: CONTRACTS_PERMIT2.Permit2,
    };

    // Permit2 的类型定义
    const types = {
      PermitTransferFrom: [
        { name: 'permitted', type: 'TokenPermissions' },
        { name: 'spender', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
      TokenPermissions: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
    };

    // 消息内容
    const message = {
      permitted: {
        token: CONTRACTS_PERMIT2.MyToken,
        amount: amount,
      },
      spender: CONTRACTS_PERMIT2.TokenBankPermit2,
      nonce: BigInt(nonce),
      deadline: BigInt(deadline),
    };

    // 请求签名
    signTypedData({
      domain,
      types,
      primaryType: 'PermitTransferFrom',
      message,
    });
  };

  // 第三步：签名成功后调用合约
  useEffect(() => {
    if (signature && permit2DepositAmount && address) {
      const amount = parseEther(permit2DepositAmount);
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const nonce = Date.now();

      const permitTransfer = {
        permitted: {
          token: CONTRACTS_PERMIT2.MyToken,
          amount: amount,
        },
        nonce: BigInt(nonce),
        deadline: BigInt(deadline),
      };

      permit2Deposit({
        address: CONTRACTS_PERMIT2.TokenBankPermit2,
        abi: TOKEN_BANK_PERMIT2_ABI,
        functionName: 'depositWithPermit2',
        args: [permitTransfer, address, signature],
      });
    }
  }, [signature]);

  return (
    <div className="space-y-8">
      {/* 如果未授权Permit2，显示授权按钮 */}
      {!hasPermit2Allowance && (
        <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300">
          <h2 className="text-lg font-semibold mb-2">Setup Required</h2>
          <p className="text-sm mb-4">
            You need to approve Permit2 contract first (one-time setup)
          </p>
          <button onClick={handleApprovePermit2}>
            Approve Permit2 Contract
          </button>
        </div>
      )}

      {/* Permit2 存款界面 */}
      {hasPermit2Allowance && (
        <div className="p-6 bg-indigo-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Gasless Deposit (Permit2)
          </h2>
          <input
            type="number"
            value={permit2DepositAmount}
            onChange={(e) => setPermit2DepositAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <button onClick={handlePermit2Deposit}>
            Sign & Deposit (Permit2)
          </button>
        </div>
      )}
    </div>
  );
}
```

### Permit2 vs EIP-712 对比

| 特性 | EIP-712 (ERC20Permit) | Permit2 (Uniswap) |
|------|----------------------|-------------------|
| **授权方式** | 每个DApp单独签名授权 | 一次授权Permit2，多个DApp签名使用 |
| **Nonce管理** | 顺序递增 | Bitmap模式，更灵活 |
| **Token要求** | 必须实现EIP-2612 | 任何ERC20代币 |
| **Gas成本** | 签名免gas，但每个DApp需签名 | 一次approve后，所有DApp签名免gas |
| **适用场景** | 新代币项目 | 多DApp生态，聚合器 |
| **标准化** | EIP-2612标准 | Uniswap实际标准 |

### Permit2 的优势

1. **一次授权，处处使用**：
   - 用户只需approve一次Permit2
   - 之后所有支持Permit2的DApp都可以通过签名使用
   - 避免了多次approve的gas消耗

2. **更好的用户体验**：
   - 无需为每个DApp单独approve
   - 签名体验一致
   - 支持部分授权和有效期控制

3. **更灵活的Nonce管理**：
   - 使用bitmap管理nonce
   - 支持并发签名
   - 可以撤销特定签名

4. **生产级安全**：
   - Uniswap审计和维护
   - 多链部署，地址统一
   - 广泛采用，经过实战检验

### 注意事项

1. **Permit2 Domain**: Domain name必须是 `'Permit2'`（无version字段）
2. **Nonce管理**: Permit2使用bitmap nonce，可以使用任意值（如时间戳）
3. **一次性授权**: 用户只需授权Permit2一次，之后所有支持的DApp都能使用
4. **官方地址**: 使用Uniswap官方部署的Permit2，无需自己部署
5. **ChainId**: 签名绑定到特定链，Permit2在多链有统一地址

---

## TokenBank EIP-7702 版本开发指南

EIP-7702 是一个提案标准，允许 EOA（外部拥有账户）临时委托其代码给智能合约，从而在单个交易中执行批量操作。本项目使用 Delegate 合约模式演示批量执行功能。

### EIP-7702 合约开发

#### 1. Delegate 合约（批量执行）

```solidity
// Delegate.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Delegate is ReentrancyGuard {
    // Custom errors
    error BatchExecutionFailed(uint256 index, bytes reason);
    error EmptyBatch();

    // Events
    event BatchExecuted(address indexed sender, uint256 callCount);
    event CallExecuted(address indexed target, uint256 value, bytes data);

    struct Call {
        address target;    // 目标合约地址
        uint256 value;     // 发送的ETH数量
        bytes data;        // 调用数据
    }

    /**
     * @dev 在单个交易中执行多个调用
     */
    function executeBatch(Call[] calldata calls)
        external
        payable
        nonReentrant
        returns (bytes[] memory results)
    {
        if (calls.length == 0) revert EmptyBatch();

        results = new bytes[](calls.length);

        for (uint256 i = 0; i < calls.length; i++) {
            Call calldata call = calls[i];

            (bool success, bytes memory result) = call.target.call{value: call.value}(call.data);

            if (!success) {
                revert BatchExecutionFailed(i, result);
            }

            results[i] = result;
            emit CallExecuted(call.target, call.value, call.data);
        }

        emit BatchExecuted(msg.sender, calls.length);
        return results;
    }

    receive() external payable {}
}
```

**关键点**：
- `executeBatch()`: 接收 Call 数组，顺序执行所有调用
- **防重入**: 使用 ReentrancyGuard 防止重入攻击
- **失败回滚**: 任何调用失败都会回滚整个交易
- **事件记录**: 记录每个调用和批量执行事件

#### 2. 部署脚本

```solidity
// DeployDelegate.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Delegate.sol";

contract DeployDelegate is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Delegate delegate = new Delegate();
        console.log("Delegate deployed to:", address(delegate));

        vm.stopBroadcast();
    }
}
```

**部署命令**：
```bash
cd contracts
source .env
forge script script/DeployDelegate.s.sol --rpc-url $RPC_URL --broadcast
```

### EIP-7702 前端开发

#### 1. 更新配置文件

**addresses.ts**:
```typescript
// Delegate Contract (EIP-7702)
export const CONTRACTS_DELEGATE = {
  Delegate: '0xYourDelegateAddress',
} as const;
```

**abis.ts**:
```typescript
// Delegate ABI for batch execution
export const DELEGATE_ABI = [
  {
    type: 'function',
    name: 'executeBatch',
    inputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        components: [
          { name: 'target', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'data', type: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: 'results', type: 'bytes[]' }],
    stateMutability: 'payable',
  },
] as const;
```

#### 2. 实现批量存款功能

核心代码示例：

```typescript
import { useWriteContract } from 'wagmi';
import { parseEther, encodeFunctionData } from 'viem';

export default function TokenBank7702Page() {
  const [batchAmount, setBatchAmount] = useState('');
  const { writeContract: executeBatch, data: batchHash, isPending } = useWriteContract();

  const handleBatchDeposit = () => {
    if (!batchAmount || !address) return;

    const amount = parseEther(batchAmount);

    // 编码 approve 调用
    const approveData = encodeFunctionData({
      abi: TOKEN_ABI,
      functionName: 'approve',
      args: [CONTRACTS.TokenBank, amount],
    });

    // 编码 deposit 调用
    const depositData = encodeFunctionData({
      abi: TOKEN_BANK_ABI,
      functionName: 'deposit',
      args: [amount],
    });

    // 创建批量调用
    const calls = [
      {
        target: CONTRACTS.MyToken,
        value: BigInt(0),
        data: approveData,
      },
      {
        target: CONTRACTS.TokenBank,
        value: BigInt(0),
        data: depositData,
      },
    ];

    // 执行批量操作
    executeBatch({
      address: CONTRACTS_DELEGATE.Delegate,
      abi: DELEGATE_ABI,
      functionName: 'executeBatch',
      args: [calls],
    });
  };

  return (
    <div className="space-y-8">
      {/* EIP-7702 Notice */}
      <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-300">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">About EIP-7702</h3>
        <p className="text-sm text-gray-700 mb-2">
          EIP-7702 allows EOA to temporarily delegate their code to a smart contract,
          enabling batch operations in a single transaction.
        </p>
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> EIP-7702 is not yet fully supported on Sepolia.
          This page demonstrates the Delegate contract pattern.
        </p>
      </div>

      {/* Batch Deposit Section */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Batch Deposit (Approve + Deposit)
        </h2>
        <input
          type="number"
          value={batchAmount}
          onChange={(e) => setBatchAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
        <button
          onClick={handleBatchDeposit}
          disabled={isPending || !batchAmount}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          {isPending ? 'Processing...' : 'Batch Approve & Deposit'}
        </button>

        <div className="text-xs text-gray-600 bg-white p-3 rounded border mt-4">
          <strong>How it works:</strong> The Delegate contract executes:
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Approve TokenBank to spend your tokens</li>
            <li>Deposit tokens into TokenBank</li>
          </ol>
          <p className="mt-2">Both operations complete in one transaction!</p>
        </div>
      </div>
    </div>
  );
}
```

### EIP-7702 的优势

1. **节省时间**：
   - 多个操作在一个交易中完成
   - 无需等待多个交易确认
   - 提升用户体验

2. **节省 Gas**：
   - 减少交易数量
   - 共享交易基础成本
   - 整体 gas 费用更低

3. **原子性**：
   - 所有操作要么全部成功，要么全部失败
   - 避免中间状态问题
   - 更安全的操作流程

4. **灵活性**：
   - 支持任意合约调用组合
   - 可扩展到更多操作
   - 适用于复杂的 DeFi 交互

### 常见用例

1. **批量授权和存款**：approve + deposit
2. **批量交易**：swap + stake
3. **批量转账**：多个 transfer 操作
4. **复杂 DeFi 操作**：跨协议组合操作

### 注意事项

1. **Gas 限制**：批量操作可能消耗大量 gas，注意 gas limit
2. **调用顺序**：操作按顺序执行，确保逻辑正确
3. **错误处理**：任何调用失败都会回滚整个交易
4. **安全性**：确保 Delegate 合约有防重入保护

---

## 配置检查清单

开始自己的项目时，确保完成以下步骤：

- [ ] 部署你的智能合约到测试网
- [ ] 复制合约地址到 `addresses.ts`
- [ ] 导出并添加ABI到 `abis.ts`
- [ ] 修改页面组件使用你的合约
- [ ] 更新导航链接（如需要）
- [ ] 测试所有功能
- [ ] 更新本README文档

---

## 技术栈

### 智能合约
- **Solidity** ^0.8.20
- **Foundry** (Forge, Cast)
- **OpenZeppelin** Contracts
- **安全特性**: ReentrancyGuard, SafeERC20, Custom Errors

### 前端
- **Next.js** 16 (App Router)
- **TypeScript**
- **Tailwind CSS** 4
- **Wagmi** v2 + **Viem** v2
- **RainbowKit** (钱包连接)
- **React Query** (状态管理)

---

## 开发命令

### 合约
```bash
forge build          # 编译
forge test           # 测试
forge script         # 部署
forge verify-contract # 验证
```

### 前端
```bash
npm run dev          # 开发模式
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

---

## 安全特性

- ReentrancyGuard 防重入攻击
- SafeERC20 安全转账
- Checks-Effects-Interactions 模式
- Custom Errors 节省gas
- 完整的事件日志
- 输入验证

---

## 常见问题

### Q: 如何知道需要哪些ABI函数？
A: 查看你的页面组件，看它调用了哪些合约函数。只需要包含这些函数的ABI。

### Q: 可以混用V1和V2的合约吗？
A: 可以！只需在不同页面导入不同的配置。

### Q: 如何添加新的网络支持？
A: 修改 `src/config/wagmi.ts`，添加新的链配置。

### Q: 合约调用失败怎么办？
A: 检查ABI是否正确、确认合约地址正确、查看MetaMask的错误信息。

---

## License

MIT License - 自由使用和修改

---
