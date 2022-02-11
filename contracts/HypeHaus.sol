// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "hardhat/console.sol";

contract HypeHaus is ERC1155, Ownable {
    event CreateNewToken(uint256 id, uint256 amount);

    bytes32 public constant HAUS_COIN = keccak256("HAUS_COIN");
    bytes32 public constant HYPE_HAUS = keccak256("HYPE_HAUS");
    bytes32 public constant DAO_HAUS = keccak256("DAO_HAUS");

    mapping(bytes32 => uint256) private tokenIds;
    uint256 private highestId = 2;

    constructor() ERC1155("") {
        tokenIds[HAUS_COIN] = 0;
        tokenIds[HYPE_HAUS] = 1;
        tokenIds[DAO_HAUS] = 2;

        _mint(msg.sender, tokenIds[HAUS_COIN], 1e6 * 10**18, "");
        _mint(msg.sender, tokenIds[HYPE_HAUS], 555, "");
        _mint(msg.sender, tokenIds[DAO_HAUS], 8888, "");
    }

    function getIdForTokenKey(bytes32 tokenKey) public view returns (uint256) {
        return tokenIds[tokenKey];
    }

    function createNewToken(string memory name, uint256 amount)
        public
        onlyOwner
    {
        highestId += 1;
        bytes32 newTokenKey = keccak256(bytes(name));
        require(tokenIds[newTokenKey] == 0, "This ID is already taken");

        tokenIds[newTokenKey] = highestId;
        _mint(msg.sender, highestId, amount, "");

        emit CreateNewToken(highestId, amount);
    }

    function awardToken(
        uint256 id,
        address awardee,
        uint256 amount
    ) public payable onlyOwner {
        _mint(awardee, id, amount, "");
    }
}
