// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract HypeHaus is ERC721URIStorage, Ownable {
    /**
     * @dev Emitted when a new HYPEhaus token is minted.
     */
    event MintHypeHaus(uint256 tokenId, address receiver);

    uint8 internal constant MAX_TOKENS_PER_OG_WALLET = 5;
    uint8 internal constant MAX_TOKENS_PER_COMMUNITY_WALLET = 3;
    uint8 internal constant MAX_TOKENS_PER_PUBLIC_WALLET = 3;

    uint256 internal constant COMMUNITY_SALE_PRICE = 0.05 ether;
    uint256 internal constant PUBLIC_SALE_PRICE = 0.08 ether;

    // The maximum supply available for the HYPEhaus NFT.
    uint256 internal immutable _maxSupply;
    // The base URI to be prepended to the full token URI.
    string internal _baseURIString;

    // The next available token ID.
    // TODO: Consider using OpenZeppelin's `Counter` utility and renaming this
    // to `tokenCount`.
    uint256 internal _nextTokenId = 0;

    constructor(uint256 maxSupply_, string memory baseURI_)
        ERC721("HYPEhaus", "HYPE")
    {
        _maxSupply = maxSupply_;
        _baseURIString = baseURI_;
    }

    function _salePrice() internal pure returns (uint256) {
        // TODO: Add logic to determine if a community sale or public sale is on
        // at the moment.
        return PUBLIC_SALE_PRICE;
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
        require(msg.value >= _salePrice(), "HypeHaus: Not enough ETH");
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
     * @dev Returns the maximum supply of HYPEhaus tokens available.
     *
     * @notice this value never changes -- it DOES NOT decrease as the amount of
     * tokens minted increase. Instead, subtract `maxSupply()` with
     * `totalMinted()` to calculate how many tokens are available to be minted.
     *
     * TODO: Should we instead inherit from `IERC721Enumerable` to replace this
     * with `totalSupply()`?
     */
    function maxSupply() external view returns (uint256) {
        return _maxSupply;
    }

    /**
     * @dev Returns the total amount of HYPEhaus tokens minted.
     */
    function totalMinted() external view returns (uint256) {
        // It is appropriate to return `_nextTokenId` because it starts at zero
        // and will always increment by one when a new token is successfully
        // minted.
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
