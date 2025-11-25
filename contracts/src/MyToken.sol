// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev 一个安全的ERC20代币实现，支持铸造、销毁和Permit功能
 */
contract MyToken is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    uint8 private _decimals;

    /**
     * @dev 构造函数
     * @param initialSupply 初始供应量（不含精度）
     */
    constructor(uint256 initialSupply)
        ERC20("MyToken", "MTK")
        ERC20Permit("MyToken")
        Ownable(msg.sender)
    {
        _decimals = 18;
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @dev 返回代币精度
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev 铸造新代币，仅限owner
     * @param to 接收地址
     * @param amount 铸造数量
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
