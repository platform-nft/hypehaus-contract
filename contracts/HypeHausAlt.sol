// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract HypeHausAlt is ERC721URIStorage, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    // ====== EVENTS ======

    /**
     * @dev Emitted when a new HYPEhaus token is minted.
     */
    event MintHypeHaus(uint256 tokenId, address receiver);

    // ====== ENUMS ======

    /**
     * @dev An enumeration of all the possible sales the contract may be in.
     */
    enum ActiveSale {
        None,
        Community,
        Public
    }

    // ====== CONSTANTS ======

    uint8 internal constant MAX_TOKENS_PER_OG_WALLET = 5;
    uint8 internal constant MAX_TOKENS_PER_COMMUNITY_WALLET = 3;
    uint8 internal constant MAX_TOKENS_PER_PUBLIC_WALLET = 3;

    uint256 internal constant COMMUNITY_SALE_PRICE = 0.05 ether;
    uint256 internal constant PUBLIC_SALE_PRICE = 0.08 ether;

    // ====== STATE VARIABLES ======

    Counters.Counter internal _tokenIdCounter;
    ActiveSale internal _currentActiveSale;
    uint256 internal immutable _maxSupply;
    string internal _baseURIString;

    // ====== MODIFIERS ======

    modifier isPublicSaleActive() {
        require(
            _currentActiveSale == ActiveSale.Public,
            "HypeHausAlt: Public sale not open"
        );
        _;
    }

    modifier isCommunitySaleActive() {
        require(
            _currentActiveSale == ActiveSale.Community,
            "HypeHausAlt: Community sale not open"
        );
        _;
    }

    modifier isSupplyAvailable() {
        uint256 nextTokenId = _tokenIdCounter.current();
        require(nextTokenId < _maxSupply, "HypeHausAlt: Supply exhausted");
        _;
    }

    modifier isCorrectPayment(uint256 price) {
        require(msg.value >= price, "HypeHausAlt: Not enough ETH sent");
        _;
    }

    // ====== CONSTRUCTOR ======

    constructor(uint256 maxSupply, string memory baseURIString)
        ERC721("HYPEhaus", "HYPE")
    {
        _maxSupply = maxSupply;
        _baseURIString = baseURIString;
        _currentActiveSale = ActiveSale.None;
    }

    // ====== MINTING FUNCTIONS ======

    function mintPublicSale()
        external
        payable
        isPublicSaleActive
        isSupplyAvailable
        isCorrectPayment(PUBLIC_SALE_PRICE)
        returns (uint256)
    {
        uint256 nextTokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment(); // Checks-Effects-Interactions pattern
        _safeMint(msg.sender, nextTokenId);
        emit MintHypeHaus(nextTokenId, msg.sender);

        return nextTokenId;
    }

    function mintCommunitySale()
        external
        payable
        isCommunitySaleActive
        isSupplyAvailable
        isCorrectPayment(COMMUNITY_SALE_PRICE)
        returns (uint256)
    {
        return 0;
    }

    // ====== PUBLIC FUNCTIONS ======

    /**
     * @dev Reports the count of all the valid NFTs tracked by this contract.
     *
     * This is a partial conformance to the `ERC721Enumerable` extension.
     * Although we could inherit that extension, it would complicate the
     * contract when all we require is this function.
     *
     * @return uint256 The count of all the valid NFTs tracked by this contract,
     * where each one of them has an assigned and queryable owner not equal to
     * the zero address.
     */
    function totalSupply() external view returns (uint256) {
        // `_tokenIdCounter` returns the next token ID available. This value
        // will always be one higher than the last minted token's ID. For
        // example, if there is only one minted token with the ID `0`, this
        // function will return `1` (i.e. the next available token ID).
        return _tokenIdCounter.current();
    }

    /**
     * @dev Returns the URI of a token with the given token ID.
     *
     * Throws if the given token ID is not a valid NFT (i.e. it does not point
     * to a minted HYPEhaus token).
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "HypeHausAlt: Nonexistent token");
        return
            string(
                abi.encodePacked(_baseURIString, tokenId.toString(), ".json")
            );
    }

    // ====== ONLY-OWNER OPERATIONS ======

    function getActiveSale() external view onlyOwner returns (ActiveSale) {
        return _currentActiveSale;
    }

    function setActiveSale(ActiveSale activeSale) external onlyOwner {
        _currentActiveSale = activeSale;
    }
}
