// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract HypeHaus is ERC721URIStorage, Ownable {
    /**
     * @dev Emitted when a new HYPEhaus token is awarded to an address.
     */
    event AwardToken(uint256 tokenId, address awardee);

    // The next available token ID
    uint256 internal _nextTokenId = 0;
    // The maximum supply available for the HYPEhaus NFT.
    uint256 internal _maxSupply = 0;
    // The base URI to be prepended to the full token URI.
    string internal _baseURIString = "";

    constructor(uint256 maxSupply_, string memory baseURI_)
        ERC721("HypeHaus", "HYPE")
    {
        _maxSupply = maxSupply_;
        _baseURIString = baseURI_;
    }

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
        require(_nextTokenId < _maxSupply, "HypeHaus: Supply exhausted");

        uint256 newTokenId = _nextTokenId;
        _safeMint(awardee, newTokenId);

        // This function will prepend `_baseURIString` for us.
        string memory newTokenURI = string(
            abi.encodePacked(Strings.toString(newTokenId), ".json")
        );
        _setTokenURI(newTokenId, newTokenURI);

        emit AwardToken(newTokenId, awardee);
        _nextTokenId += 1;

        return newTokenId;
    }

    /**
     * @dev Returns the maximum supply of HYPEhaus tokens available. Note that
     * this value never changes -- it DOES NOT decrease as the amount of tokens
     * minted increase. Use `totalMinted` instead to calculate how many tokens
     * are available to be minted.
     */
    function maxSupply() external view returns (uint256) {
        return _maxSupply;
    }

    /**
     * @dev Returns the total amount of HYPEhaus tokens minted.
     */
    function totalMinted() external view returns (uint256) {
        // Since this function expects a 1-indexed value, we can just return
        // `_nextTokenId` since it is incremented every time a new token is
        // minted.
        return _nextTokenId;
    }

    /**
     * @dev Overrides the default `baseURI` function to return the custom base
     * URI provided through the constructor.
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseURIString;
    }
}
