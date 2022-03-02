// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract HypeHausBase is ERC721Enumerable, Ownable {
    event AwardToken(uint256 tokenId, address awardee);

    using Counters for Counters.Counter;
    Counters.Counter internal _tokenIds;

    function maxSupply() public pure virtual returns (uint256);

    function awardToken(address awardee)
        external
        payable
        onlyOwner
        returns (uint256)
    {
        require(_tokenIds.current() < maxSupply(), "Supply exhausted");

        uint256 newTokenId = _tokenIds.current();
        _safeMint(awardee, newTokenId);
        emit AwardToken(newTokenId, awardee);

        _tokenIds.increment();
        return newTokenId;
    }
}

contract HypeHaus is HypeHausBase {
    constructor() ERC721("HypeHaus", "HYP") {}

    function maxSupply() public pure override returns (uint256) {
        return 555;
    }
}

contract TestHypeHaus is HypeHausBase {
    constructor() ERC721("TestHypeHaus", "Test_HYP") {}

    function maxSupply() public pure override returns (uint256) {
        return 10;
    }
}
