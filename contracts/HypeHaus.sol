// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "erc721a/contracts/ERC721A.sol";

contract HypeHaus is ERC721A, Ownable {
    using Strings for uint256;

    // ====== ENUMS ======

    /**
     * @dev An enumeration of all the possible sales the contract may be in.

     * An `Inactive` sale indicates that the contract has not begun the pre-sale
     * (i.e. `Community` sale) or that it has finished the `Public` sale. As a
     * result, the contract will not accept any mints if `_activeSale` is set to
     * `Inactive`.
     */
    enum Sale {
        Inactive,
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

    Sale internal _activeSale = Sale.Inactive;
    address internal immutable _teamWalletAddress;
    uint256 internal immutable _maxSupply;
    string internal _baseTokenURI;

    // ====== CONSTRUCTOR ======

    constructor(
        uint256 maxSupply,
        string memory baseTokenURI,
        address teamWalletAddress
    ) ERC721A("HYPEHAUS", "HYPE") {
        _maxSupply = maxSupply;
        _baseTokenURI = baseTokenURI;
        _teamWalletAddress = teamWalletAddress;
    }

    // ====== MODIFIERS ======

    modifier isSaleActive() {
        require(_activeSale != Sale.Inactive, "HH_SALE_NOT_ACTIVE");
        _;
    }

    modifier isCommunitySaleActive() {
        require(_activeSale == Sale.Community, "HH_COMMUNITY_SALE_NOT_ACTIVE");
        _;
    }

    modifier isPublicSaleActive() {
        require(_activeSale == Sale.Public, "HH_PUBLIC_SALE_NOT_ACTIVE");
        _;
    }

    modifier isSupplyAvailable() {
        require(_totalMinted() < _maxSupply, "HH_SUPPLY_EXHAUSTED");
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
        isSaleActive
        isCommunitySaleActive
        isSupplyAvailable
        isCorrectPayment(COMMUNITY_SALE_PRICE)
    {
        _mintToAddress(msg.sender, amount);
    }

    function mintPublicSale(uint256 amount)
        external
        payable
        isSaleActive
        isPublicSaleActive
        isSupplyAvailable
        isCorrectPayment(PUBLIC_SALE_PRICE)
    {
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Internal function that mints `amount` number of HYPEHAUS tokens to
     * `receiver`. It emits a `MintHypeHaus` event for every token minted.
     */
    function _mintToAddress(address receiver, uint256 amount) internal {
        _safeMint(receiver, amount);
    }

    // ====== PUBLIC FUNCTIONS ======

    /**
     * @dev Transfers any pending balance available in the contract to the
     * designated team wallet address.
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(_teamWalletAddress).call{value: balance}("");
        require(success, "HH_TRANSFER_FAILURE");
    }

    /**
     * @dev Reports the count of all the valid HYPEHAUS tokens tracked by this
     * contract.
     *
     * @return uint256 The count of all the valid NFTs tracked by this contract,
     * where each one of them has an assigned and queryable owner not equal to
     * the zero address.
     */
    function totalMinted() external view returns (uint256) {
        return _totalMinted();
    }

    /**
     * @dev Returns the URI of a token with the given token ID.
     *
     * Throws if the given token ID is not a valid NFT (i.e. it does not point
     * to a minted HYPEHAUS token).
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "HH_NONEXISTENT_TOKEN");
        return
            string(
                abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json")
            );
    }

    // ====== ONLY-OWNER FUNCTIONS ======

    function getActiveSale() external view onlyOwner returns (Sale) {
        return _activeSale;
    }

    function setActiveSale(Sale activeSale) external onlyOwner {
        _activeSale = activeSale;
    }

    function setBaseTokenURI(string memory newBaseTokenURI) external onlyOwner {
        _baseTokenURI = newBaseTokenURI;
    }
}
