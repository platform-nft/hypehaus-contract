// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract HypeHaus is ERC1155, Ownable {
    event CreateNewToken(uint256 id, uint256 amount);

    bytes32 public constant HAUS_COIN = keccak256("HAUS_COIN");
    bytes32 public constant HYPE_HAUS = keccak256("HYPE_HAUS");
    bytes32 public constant DAO_HAUS = keccak256("DAO_HAUS");

    mapping(bytes32 => uint256) private _tokenIds;
    uint256 private _nextId = 3;

    constructor() ERC1155("") {
        _tokenIds[HAUS_COIN] = 0;
        _tokenIds[HYPE_HAUS] = 1;
        _tokenIds[DAO_HAUS] = 2;

        _mint(msg.sender, _tokenIds[HAUS_COIN], 1e6 * 10**18, "");
        _mint(msg.sender, _tokenIds[HYPE_HAUS], 555, "");
        _mint(msg.sender, _tokenIds[DAO_HAUS], 8888, "");
    }

    function getIdForTokenKey(bytes32 tokenKey)
        external
        view
        returns (uint256)
    {
        return _tokenIds[tokenKey];
    }

    function createNewToken(string memory name, uint256 amount)
        external
        onlyOwner
    {
        bytes32 newTokenKey = keccak256(bytes(name));
        require(_tokenIds[newTokenKey] == 0, "This token ID is already taken");

        _tokenIds[newTokenKey] = _nextId;
        _mint(msg.sender, _nextId, amount, "");

        emit CreateNewToken(_nextId, amount);
        _nextId += 1;
    }

    // TODO: Add ability to add more HAUS coins

    function awardToken(
        uint256 id,
        address awardee,
        uint256 amount
    ) external payable onlyOwner {
        _safeTransferFrom(msg.sender, awardee, id, amount, "");
    }
}
