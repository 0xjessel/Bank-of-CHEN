// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CHENDollas is ERC20, ERC20Burnable, Pausable, Ownable {
    uint _dripAmount;

    event Drip(address indexed to, uint amount);

    constructor() ERC20("CHEN Dollas", "CHEN") {
        _mint(msg.sender, 5000 * 10 ** decimals());
        _dripAmount = 1000 * 10 ** decimals();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function drip() public whenNotPaused {
      _mint(msg.sender, _dripAmount);
      emit Drip(msg.sender, _dripAmount);
    }
}
