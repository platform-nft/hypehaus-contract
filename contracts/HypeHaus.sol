// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract HypeHaus is ERC721URIStorage, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    // ====== EVENTS ======

    /**
     * @dev Emitted when a new *HYPEHAUS token is minted.
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

    uint8 internal constant MAX_TOKENS_PER_ALPHA_WALLET = 3;
    uint8 internal constant MAX_TOKENS_PER_HYPELIST_WALLET = 2;
    uint8 internal constant MAX_TOKENS_PER_HYPEMEMBER_WALLET = 1;
    uint8 internal constant MAX_TOKENS_PER_PUBLIC_WALLET = 1;

    uint256 internal constant COMMUNITY_SALE_PRICE = 0.05 ether;
    uint256 internal constant PUBLIC_SALE_PRICE = 0.08 ether;

    // ====== STATE VARIABLES ======

    ActiveSale internal _activeSale;
    Counters.Counter internal _supply;

    address internal immutable _teamWalletAddress;
    uint256 internal immutable _maxSupply;
    string internal _baseURIString;

    // ====== CONSTRUCTOR ======

    constructor(
        uint256 maxSupply,
        string memory baseURIString,
        address teamWalletAddress
    ) ERC721("HYPEhaus", "HYPE") {
        _maxSupply = maxSupply;
        _baseURIString = baseURIString;
        _activeSale = ActiveSale.None;
        _teamWalletAddress = teamWalletAddress;
    }

    // ====== MODIFIERS ======

    modifier isPublicSaleActive() {
        require(_activeSale == ActiveSale.Public, "HH_PUBLIC_SALE_NOT_OPEN");
        _;
    }

    modifier isCommunitySaleActive() {
        require(
            _activeSale == ActiveSale.Community,
            "HH_COMMUNITY_SALE_NOT_OPEN"
        );
        _;
    }

    modifier isSupplyAvailable() {
        require(_supply.current() < _maxSupply, "HH_SUPPLY_EXHAUSTED");
        _;
    }

    modifier isCorrectPayment(uint256 price) {
        require(msg.value >= price, "HH_INSUFFICIENT_FUNDS");
        _;
    }

    // ====== MINTING FUNCTIONS ======

    function mintCommunitySale(uint256 amount)
        external
        payable
        isCommunitySaleActive
        isSupplyAvailable
        isCorrectPayment(COMMUNITY_SALE_PRICE)
    {
        _mintToAddress(msg.sender, amount);
    }

    function mintPublicSale(uint256 amount)
        external
        payable
        isPublicSaleActive
        isSupplyAvailable
        isCorrectPayment(PUBLIC_SALE_PRICE)
    {
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Internal function that mints `amount` number of *HYPEHAUS tokens to
     * `receiver`. It emits a `MintHypeHaus` event for every token minted.
     */
    function _mintToAddress(address receiver, uint256 amount) internal {
        for (uint256 i = 0; i < amount; i++) {
            // Checks-Effects-Interactions pattern
            uint256 nextTokenId = _supply.current();
            _supply.increment();
            emit MintHypeHaus(nextTokenId, receiver);
            _safeMint(receiver, nextTokenId);
        }
    }

    // ====== PUBLIC FUNCTIONS ======

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(_teamWalletAddress).call{value: balance}("");
        require(success, "HH_TRANSFER_FAILURE");
    }

    /**
     * @dev Reports the count of all the valid *HYPEHAUS tokens tracked by this
     * contract.
     *
     * This is a partial conformance to the `ERC721Enumerable` extension. We
     * don't want the increased gas usages associated with that extension just
     * to provide a `totalSupply` function, so we've implemented our own here.
     *
     * @return uint256 The count of all the valid NFTs tracked by this contract,
     * where each one of them has an assigned and queryable owner not equal to
     * the zero address.
     */
    function totalSupply() external view returns (uint256) {
        return _supply.current();
    }

    /**
     * @dev Returns the URI of a token with the given token ID.
     *
     * Throws if the given token ID is not a valid NFT (i.e. it does not point
     * to a minted *HYPEHAUS token).
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        // TODO: Return URI to placeholder during community sale
        require(_exists(tokenId), "HH_NONEXISTENT_TOKEN");
        return
            string(
                abi.encodePacked(_baseURIString, tokenId.toString(), ".json")
            );
    }

    // ====== ONLY-OWNER OPERATIONS ======

    function getActiveSale() external view onlyOwner returns (ActiveSale) {
        return _activeSale;
    }

    function setActiveSale(ActiveSale activeSale) external onlyOwner {
        _activeSale = activeSale;
    }
}
