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
    address internal immutable _teamWalletAddress;
    uint256 internal immutable _maxSupply;
    string internal _baseTokenURI;

    bytes32 internal alphaTierMerkleRoot;
    bytes32 internal hypelistTierMerkleRoot;
    bytes32 internal hypememberTierMerkleRoot;
    mapping(address => bool) internal _claimedDuringCommunitySale;
    mapping(address => bool) internal _claimedDuringPublicSale;

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
        require(_totalMinted() < _maxSupply, "HH_SUPPLY_EXHAUSTED");
        _;
    }

    modifier isValidAmount(uint256 maximum, uint256 amount) {
        require(amount >= 1 && amount <= maximum, "HH_INVALID_MINT_AMOUNT");
        _;
    }

    modifier isCorrectPayment(uint256 price, uint256 amount) {
        require(msg.value >= price * amount, "HH_INSUFFICIENT_FUNDS");
        _;
    }

    modifier hasNotClaimedDuringCommunitySale() {
        require(
            !_claimedDuringCommunitySale[msg.sender],
            "HH_ADDRESS_ALREADY_CLAIMED"
        );
        _;
    }

    modifier hasNotClaimedDuringPublicSale() {
        require(
            !_claimedDuringPublicSale[msg.sender],
            "HH_ADDRESS_ALREADY_CLAIMED"
        );
        _;
    }

    modifier isValidMerkleProof(
        bytes32[] calldata merkleProof,
        uint256 amount
    ) {
        bytes32 root;
        if (amount == MAX_TOKENS_PER_ALPHA_WALLET) {
            root = alphaTierMerkleRoot;
        } else if (amount == MAX_TOKENS_PER_HYPELIST_WALLET) {
            root = hypelistTierMerkleRoot;
        } else {
            root = hypememberTierMerkleRoot;
        }

        require(
            MerkleProof.verify(
                merkleProof,
                root,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "HH_MERKLE_PROOF_FAILURE"
        );

        _;
    }

    // ====== MINTING FUNCTIONS ======

    /**
     * @dev Mints `amount` number of HYPEHAUS tokens during the community sale.
     *
     * This function requires several prerequisites in order to for `msg.sender`
     * to successfully mint HYPEHAUS tokens during the community sale:
     *
     *   - The community sale is active;
     *   - There is enough supply available to mint `amount` tokens;
     *   - `msg.sender` has not already claimed any amount of HYPEHAUS tokens
     *     during the community sale;
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
        hasNotClaimedDuringCommunitySale
        isValidAmount(MAX_TOKENS_PER_ALPHA_WALLET, amount)
        isCorrectPayment(COMMUNITY_SALE_PRICE, amount)
        isValidMerkleProof(merkleProof, amount)
    {
        // Accounts may only claim once. They will not be able to mint any
        // remaining HYPEHAUSes during community sale.
        _claimedDuringCommunitySale[msg.sender] = true;
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Mints `amount` number of HYPEHAUS tokens during the public sale.
     *
     * Like `mintCommunitySale`, this function has several prerequisites to
     * successfully mint HYPEHAUS tokens:
     *
     *   - The public sale is active;
     *   - There is enough supply available to mint one HYPEHAUS token;
     *   - `msg.sender` has not already claimed a HYPEHAUS token during the
     *     public sale; and
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
        hasNotClaimedDuringPublicSale
        isCorrectPayment(PUBLIC_SALE_PRICE, 1)
    {
        _claimedDuringPublicSale[msg.sender] = true;
        _mintToAddress(msg.sender, 1);
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

    function setAlphaTierMerkleRoot(bytes32 root) external onlyOwner {
        alphaTierMerkleRoot = root;
    }

    function setHypelistTierMerkleRoot(bytes32 root) external onlyOwner {
        hypelistTierMerkleRoot = root;
    }

    function setHypememberTierMerkleRoot(bytes32 root) external onlyOwner {
        hypememberTierMerkleRoot = root;
    }
}
