// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";

contract HypeHaus is ERC721URIStorage, Ownable {
    /**
     * @dev Emitted when a new HYPEhaus token is minted.
     */
    event MintHypeHaus(uint256 tokenId, address receiver);

    // The minimum set price to mint a HYPEhaus token.
    uint256 internal constant PRICE = 0.05 ether;

    // The next available token ID.
    uint256 internal _nextTokenId = 0;
    // The maximum supply available for the HYPEhaus NFT.
    uint256 internal _maxSupply = 0;
    // The base URI to be prepended to the full token URI.
    string internal _baseURIString = "";

    constructor(uint256 maxSupply_, string memory baseURI_)
        ERC721("HYPEhaus", "HYPE")
    {
        _maxSupply = maxSupply_;
        _baseURIString = baseURI_;
    }

    function _doMintHypeHausToAddress(address receiver)
        internal
        returns (uint256)
    {
        require(_nextTokenId < _maxSupply, "HypeHaus: Supply exhausted");

        uint256 newTokenId = _nextTokenId;
        string memory newTokenURI = string(
            abi.encodePacked(Strings.toString(newTokenId), ".json")
        );

        _safeMint(receiver, newTokenId);
        _setTokenURI(newTokenId, newTokenURI);
        emit MintHypeHaus(newTokenId, receiver);
        _nextTokenId += 1;

        return newTokenId;
    }

    function mintHypeHaus() external payable returns (uint256) {
        require(msg.value >= PRICE, "HypeHaus: Not enough ETH");
        return _doMintHypeHausToAddress(msg.sender);
    }

    /**
     * @dev Mints a new HYPEhaus token to the `receiver`.
     * @return uint256 The ID associated with the newly minted token.
     *
     * TODO: Maybe the token URI generation should happen in the front-end
     * instead? It'll be much more easier and efficient to let JavaScript
     * generate the URI before passing it to this function.
     *
     * TODO: Do we need this function when we already have `mintHypeHaus`?
     */
    function mintHypeHausToAddress(address receiver)
        public
        payable
        onlyOwner
        returns (uint256)
    {
        return _doMintHypeHausToAddress(receiver);
    }

    /**
     * @dev Returns the maximum supply of HYPEhaus tokens available. Note that
     * this value never changes -- it DOES NOT decrease as the amount of tokens
     * minted increase. Instead, subtract `maxSupply()` with `totalMinted()` to
     * calculate how many tokens are available to be minted.
     */
    function maxSupply() external view returns (uint256) {
        return _maxSupply;
    }

    /**
     * @dev Returns the total amount of HYPEhaus tokens minted.
     */
    function totalMinted() external view returns (uint256) {
        // It is appropriate to return `_nextTokenId` since it is incremented
        // every time a new token is minted.
        return _nextTokenId;
    }

    /**
     * @dev Overrides the inherited `_baseURI` function to return the custom
     * base URI provided through the constructor.
     *
     * The function `tokenURI` will do the magic of prepending the base URI
     * returned from this function with the file name generated when minting
     * a HYPEhaus token with `mintHypeHaus`.
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseURIString;
    }
}
