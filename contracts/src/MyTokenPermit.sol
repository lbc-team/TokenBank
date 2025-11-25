// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyTokenPermit
 * @dev ERC20 Token with EIP-2612 Permit support for gasless approvals
 *
 * Features:
 * - ERC20 standard token
 * - EIP-2612 Permit: Off-chain approval signatures
 * - Burnable: Tokens can be burned
 * - Ownable: Only owner can mint
 */
contract MyTokenPermit is ERC20, ERC20Permit, ERC20Burnable, Ownable {
    uint8 private _decimals;

    /**
     * @dev Constructor that gives msg.sender all of initial supply
     * @param initialSupply Initial token supply (in whole tokens, will be multiplied by 10^18)
     */
    constructor(uint256 initialSupply)
        ERC20("MyTokenPermit", "MTKP")
        ERC20Permit("MyTokenPermit")
        Ownable(msg.sender)
    {
        _decimals = 18;
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @dev Returns the number of decimals used for token amounts
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Mint new tokens (only owner can call)
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint (in wei units)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
