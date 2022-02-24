// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IHausCoin.sol";

contract HausCoin is IHausCoin, ERC20 {
    constructor(uint256 initialSupply) ERC20("Haus", "$HAUS") {
        _mint(msg.sender, initialSupply);
    }
}
