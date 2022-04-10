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

    // TODO: Make these mutable
    uint8 internal constant MAX_TOKENS_PER_ALPHA_WALLET = 3;
    uint8 internal constant MAX_TOKENS_PER_HYPELISTER_WALLET = 2;
    uint8 internal constant MAX_TOKENS_PER_HYPEMEMBER_WALLET = 1;
    uint8 internal constant MAX_TOKENS_PER_PUBLIC_WALLET = 2;

    // TODO: Make these mutable
    uint256 internal constant COMMUNITY_SALE_PRICE = 0.05 ether;
    uint256 internal constant PUBLIC_SALE_PRICE = 0.08 ether;

    // ====== STATE VARIABLES ======

    Sale internal _activeSale = Sale.Inactive;
    string internal _baseTokenURI;
    // TODO: Make this mutable
    uint256 internal immutable _maxSupply;
    // TODO: Make this mutable
    address internal immutable _teamWalletAddress;

    bytes32 internal _alphaMerkleRoot;
    bytes32 internal _hypelisterMerkleRoot;
    bytes32 internal _hypememberMerkleRoot;
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

    modifier isSupplyAvailable(uint256 amount) {
        require((_totalMinted() + amount) <= _maxSupply, "HH_SUPPLY_EXHAUSTED");
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
        bytes32 merkleRoot
    ) {
        require(
            MerkleProof.verify(
                merkleProof,
                merkleRoot,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "HH_VERIFICATION_FAILURE"
        );
        _;
    }

    // ====== MINTING FUNCTIONS ======

    // TODO: Consider using a different role
    function mintAdmin(address receiver, uint256 amount)
        external
        onlyOwner
        isSupplyAvailable(amount)
    {
        // TODO: Should we set `_claimed[receiver] = _activeSale`?
        _safeMint(receiver, amount);
    }

    /**
     * @dev Mints `amount` number of HYPEHAUSes as an ALPHA.
     *
     * This function requires several prerequisites to be met in order for
     * `msg.sender` to successfully mint HYPEHAUSes as an ALPHA:
     *
     *   - The community sale is currently active;
     *   - There is enough supply available to mint `amount` HYPEHAUSes;
     *   - `msg.sender` has not already claimed any amount of HYPEHAUSes during
     *     the community sale;
     *   - The provided `amount` is a value within the inclusive range of 1 and
     *     the maximum mint amount for ALPHAs (3 by default);
     *   - Sufficient amount of ETH is provided to purchase `amount` number of
     *     HYPEHAUSes at a discounted price; and
     *   - It can be verified that `msg.sender` is an ALPHA using the provided
     *     `merkleProof`.
     *
     * If any of the above prerequisites are not met, this function will reject
     * the mint and throw an error.
     */
    function mintAlpha(uint256 amount, bytes32[] calldata merkleProof)
        external
        payable
        nonReentrant
        isCommunitySaleActive
        isSupplyAvailable(amount)
        hasNotClaimedDuringSale(Sale.Community)
        isValidMintAmount(amount, MAX_TOKENS_PER_ALPHA_WALLET)
        isCorrectPayment(COMMUNITY_SALE_PRICE, amount)
        isValidMerkleProof(merkleProof, _alphaMerkleRoot)
    {
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Mints `amount` number of HYPEHAUSes as a HYPELISTER.
     *
     * This function has almost identical prerequisites to `mintAlpha` to be
     * met in order for `msg.sender` to successfully mint HYPEHAUSes as a
     * HYPELISTER. The only difference(s) are the following:
     *
     *   - The provided `amount` is a value within the inclusive range of 1 and
     *     the maximum mint amount for HYPELISTERs (2 by default)
     *
     * If any of the prerequisites are not met, this function will reject the
     * mint and throw an error.
     */
    function mintHypelister(uint256 amount, bytes32[] calldata merkleProof)
        external
        payable
        nonReentrant
        isCommunitySaleActive
        isSupplyAvailable(amount)
        hasNotClaimedDuringSale(Sale.Community)
        isValidMintAmount(amount, MAX_TOKENS_PER_HYPELISTER_WALLET)
        isCorrectPayment(COMMUNITY_SALE_PRICE, amount)
        isValidMerkleProof(merkleProof, _hypelisterMerkleRoot)
    {
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Mints `amount` number of HYPEHAUSes as a HYPEMEMBER.
     *
     * This function has almost identical prerequisites to `mintAlpha` to be
     * met in order for `msg.sender` to successfully mint HYPEHAUSes as a
     * HYPEMEMBER. The only difference(s) are the following:
     *
     *   - The provided `amount` is a value within the inclusive range of 1 and
     *     the maximum mint amount for HYPEMEMBERs (1 by default)
     *
     * If any of the prerequisites are not met, this function will reject the
     * mint and throw an error.
     */
    function mintHypemember(uint256 amount, bytes32[] calldata merkleProof)
        external
        payable
        nonReentrant
        isCommunitySaleActive
        isSupplyAvailable(amount)
        hasNotClaimedDuringSale(Sale.Community)
        isValidMintAmount(amount, MAX_TOKENS_PER_HYPEMEMBER_WALLET)
        isCorrectPayment(COMMUNITY_SALE_PRICE, amount)
        isValidMerkleProof(merkleProof, _hypememberMerkleRoot)
    {
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Mints `amount` number of HYPEHAUSes as a member of the public.
     *
     * This function requires several prerequisites to be met in order for
     * `msg.sender` to successfully mint HYPEHAUSes as a member of the public:
     *
     *   - The public sale is currently active;
     *   - There is enough supply available to mint `amount` HYPEHAUSes;
     *   - `msg.sender` has not already claimed any amount of HYPEHAUSes during
     *     the public sale;
     *   - The provided `amount` is a value within the inclusive range of 1 and
     *     the maximum mint amount for members of the public (2 by default); and
     *   - Sufficient amount of ETH is provided to purchase `amount` number of
     *     HYPEHAUSes at full price.
     *
     * If any of the above is not met, this function will throw an error.
     */
    function mintPublic(uint256 amount)
        external
        payable
        nonReentrant
        isPublicSaleActive
        isSupplyAvailable(amount)
        hasNotClaimedDuringSale(Sale.Public)
        isValidMintAmount(amount, MAX_TOKENS_PER_PUBLIC_WALLET)
        isCorrectPayment(PUBLIC_SALE_PRICE, 1)
    {
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Internal function that mints `amount` number of HYPEHAUSes to
     * `receiver`.
     */
    function _mintToAddress(address receiver, uint256 amount) internal {
        // An account may only mint once during the current `_activeSale`. Here,
        // we record the last `_activeSale` an account has minted.
        _claimed[receiver] = _activeSale;
        // The second argument of `_safeMint` in AZUKI's `ERC721A` contract
        // expects the amount to mint, not a token ID.
        _safeMint(receiver, amount);
    }

    // ====== PUBLIC FUNCTIONS ======

    /**
     * @dev Transfers any pending balance available in the contract to the
     * designated team wallet address.
     *
     * TODO: Consider using a different role here.
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
     * @return uint256 The count of minted HYPEHAUSes tracked by this contract,
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

    function setAlphaMerkleRoot(bytes32 root) external onlyOwner {
        _alphaMerkleRoot = root;
    }

    function setHypelisterMerkleRoot(bytes32 root) external onlyOwner {
        _hypelisterMerkleRoot = root;
    }

    function setHypememberMerkleRoot(bytes32 root) external onlyOwner {
        _hypememberMerkleRoot = root;
    }
}
