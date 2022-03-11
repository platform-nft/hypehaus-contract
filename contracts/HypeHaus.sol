// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

abstract contract HypeHausBase is ERC721URIStorage, Ownable {
    /**
     * @dev Emitted when a new HYPEhaus token is awarded to an address.
     */
    event AwardToken(uint256 tokenId, address awardee);

    uint256 internal _tokenIds;

    /**
     * @dev Mints a new HYPEhaus token and awards it to the `awardee`.
     * @return uint256 The new ID associated with the newly minted token.
     *
     * TODO: Maybe the token URI generation should happen in the front-end
     * instead? It'll be much more easier and efficient to let JavaScript
     * generate the URI before passing it to this function, but can we restrict
     * it so that only the contract's owner can do that?
     */
    function awardToken(address awardee)
        external
        payable
        onlyOwner
        returns (uint256)
    {
        require(_tokenIds < maxSupply(), "Supply exhausted");

        uint256 newTokenId = _tokenIds;
        _safeMint(awardee, newTokenId);
        _setTokenURI(
            newTokenId,
            string(abi.encodePacked(Strings.toString(newTokenId), ".json"))
        );
        emit AwardToken(newTokenId, awardee);

        _tokenIds += 1;
        return newTokenId;
    }

    /**
     * @dev The maximum supply available for the NFT.
     */
    function maxSupply() public pure virtual returns (uint256);

    /**
     * @dev Returns the total amount of HYPEhaus tokens minted.
     */
    function totalSupply() external view returns (uint256) {
        // Since this function expects a 1-indexed value, we can just return
        // `_tokenIDs` since it is incremented every time a new token is minted.
        return _tokenIds;
    }
}

contract HypeHaus is HypeHausBase {
    constructor() ERC721("HypeHaus", "HYPE") {}

    function maxSupply() public pure override returns (uint256) {
        return 555;
    }
}

contract TestHypeHaus is HypeHausBase {
    constructor() ERC721("TestHypeHaus", "Test_HYPE") {}

    function _baseURI() internal pure override returns (string memory) {
        return "test://abc123/";
    }

    function maxSupply() public pure override returns (uint256) {
        return 10;
    }
}
