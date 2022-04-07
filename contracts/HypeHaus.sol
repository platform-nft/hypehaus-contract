// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "erc721a/contracts/ERC721A.sol";

contract HypeHaus is ERC721A, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // ====== ENUMS ======

    /**
     * @dev An enumeration of all the possible sales the contract may be in.
     *
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
    string internal _baseTokenURI;
    uint256 internal immutable _maxSupply;
    address internal immutable _teamWalletAddress;

    bytes32 internal _alphaTierMerkleRoot;
    bytes32 internal _hypelistTierMerkleRoot;
    bytes32 internal _hypememberTierMerkleRoot;
    // A mapping of addresses and the last sale they have claimed a HYPEHAUS.
    mapping(address => Sale) internal _claimed;

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

    modifier isCommunitySaleActive() {
        require(_activeSale == Sale.Community, "HH_COMMUNITY_SALE_NOT_ACTIVE");
        _;
    }

    modifier isPublicSaleActive() {
        require(_activeSale == Sale.Public, "HH_PUBLIC_SALE_NOT_ACTIVE");
        _;
    }

    modifier isSupplyAvailable() {
        // TODO: Originally we had a counter to indicate the number of tokens
        // minted, but since `_totalMinted` is already provided by `ERC721A`,
        // we'll use it instead.
        require(_totalMinted() < _maxSupply, "HH_SUPPLY_EXHAUSTED");
        _;
    }

    modifier isValidMintAmount(uint256 amount, uint256 maximum) {
        // The front-end will ensure that `amount` is between 1 and `maximum`,
        // but we'll do a check anyway.
        require(amount >= 1 && amount <= maximum, "HH_INVALID_MINT_AMOUNT");
        _;
    }

    modifier isCorrectPayment(uint256 price, uint256 amount) {
        require(msg.value >= price * amount, "HH_INSUFFICIENT_FUNDS");
        _;
    }

    modifier hasNotClaimedDuringSale(Sale sale) {
        require(_claimed[msg.sender] != sale, "HH_ADDRESS_ALREADY_CLAIMED");
        _;
    }

    modifier isValidMerkleProof(
        bytes32[] calldata merkleProof,
        uint256 amount
    ) {
        bytes32 root;
        if (amount == MAX_TOKENS_PER_ALPHA_WALLET) {
            root = _alphaTierMerkleRoot;
        } else if (amount == MAX_TOKENS_PER_HYPELIST_WALLET) {
            root = _hypelistTierMerkleRoot;
        } else {
            root = _hypememberTierMerkleRoot;
        }

        require(
            MerkleProof.verify(
                merkleProof,
                root,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "HH_VERIFICATION_FAILURE"
        );

        _;
    }

    // ====== MINTING FUNCTIONS ======

    /**
     * @dev Mints `amount` number of HYPEHAUSes during the community sale.
     *
     * This function requires several prerequisites in order for `msg.sender` to
     * successfully mint HYPEHAUSes during the community sale:
     *
     *   - The community sale is currently active;
     *   - There is enough supply available to mint `amount` HYPEHAUSes;
     *   - `msg.sender` has not already claimed any amount of HYPEHAUSes during
     *     the community sale;
     *   - The provided `amount` is a value between 1 and 3 (inclusive);
     *   - Sufficient amount of ETH is provided to purchase `amount` number of
     *     HYPEHAUSes at a discounted price; and
     *   - It can be verified that `msg.sender` is either an Alpha, Hypelister
     *     or Hypemember using the provided `merkleProof`.
     *
     * If any of the above is not met, this function will throw an error.
     */
    function mintCommunitySale(uint256 amount, bytes32[] calldata merkleProof)
        external
        payable
        nonReentrant
        isCommunitySaleActive
        isSupplyAvailable
        hasNotClaimedDuringSale(Sale.Community)
        isValidMintAmount(amount, MAX_TOKENS_PER_ALPHA_WALLET)
        isCorrectPayment(COMMUNITY_SALE_PRICE, amount)
        isValidMerkleProof(merkleProof, amount)
    {
        // Accounts may only mint once during the community sale, even if they
        // have remaining HYPEHAUSes they can mint.
        _claimed[msg.sender] = Sale.Community;
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Mints one HYPEHAUS during the public sale.
     *
     * Like `mintCommunitySale`, this function has several prerequisites to
     * successfully mint one HYPEHAUS:
     *
     *   - The public sale is currently active;
     *   - There is enough supply available to mint one HYPEHAUS;
     *   - `msg.sender` has not already claimed a HYPEHAUS during the public
     *     sale; and
     *   - Sufficient amount of ETH is provided to purchase one HYPEHAUS at full
     *     price.
     *
     * If any of the above is not met, this function will throw an error.
     */
    function mintPublicSale()
        external
        payable
        nonReentrant
        isPublicSaleActive
        isSupplyAvailable
        hasNotClaimedDuringSale(Sale.Public)
        isCorrectPayment(PUBLIC_SALE_PRICE, 1)
    {
        // All accounts may only mint one HYPEHAUS during the public sale.
        // However, any previous HYPEHAUSes minted during the community sale
        // will still be available to them.
        _claimed[msg.sender] = Sale.Public;
        _mintToAddress(msg.sender, 1);
    }

    /**
     * @dev Internal function that mints `amount` number of HYPEHAUSes to
     * `receiver`.
     */
    function _mintToAddress(address receiver, uint256 amount) internal {
        // The second argument of `_safeMint` in AZUKI's `ERC721A` contract
        // expects the amount to mint, not the token ID.
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
     * @dev Reports the count of all the valid HYPEHAUSes tracked by this
     * contract.
     *
     * @return uint256 The count minted HYPEHAUSes tracked by this contract,
     * where each one of them has an assigned and queryable owner not equal to
     * the zero address.
     */
    function totalMinted() external view returns (uint256) {
        return _totalMinted();
    }

    /**
     * @dev Returns the URI of a HYPEHAUS with the given token ID.
     *
     * Throws if the given token ID is not a valid (i.e. it does not point to a
     * minted HYPEHAUS).
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

    function setAlphaTierMerkleRoot(bytes32 root) external onlyOwner {
        _alphaTierMerkleRoot = root;
    }

    function setHypelistTierMerkleRoot(bytes32 root) external onlyOwner {
        _hypelistTierMerkleRoot = root;
    }

    function setHypememberTierMerkleRoot(bytes32 root) external onlyOwner {
        _hypememberTierMerkleRoot = root;
    }
}
