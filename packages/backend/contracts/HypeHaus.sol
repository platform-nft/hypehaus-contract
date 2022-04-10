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
     * A `Closed` sale state indicates that the contract has either not begun
     * the pre-sale (i.e. `Community` sale) or has finished the `Public` sale.
     * As a result, the contract will not accept any mints if `activeSale` is
     * set to `Closed`.
     */
    enum Sale {
        Closed,
        Community,
        Public
    }

    // ====== PUBLIC STATE VARIABLES ======

    uint8 public maxMintAlpha = 3;
    uint8 public maxMintHypelister = 2;
    uint8 public maxMintHypemember = 1;
    uint8 public maxMintPublic = 2;

    uint256 public communitySalePrice = 0.05 ether;
    uint256 public publicSalePrice = 0.08 ether;

    Sale public activeSale = Sale.Closed;
    uint256 public maxSupply;

    // ====== INTERNAL STATE VARIABLES ======

    string internal _baseTokenURI;
    address internal _teamWalletAddress;

    bytes32 internal _alphaMerkleRoot;
    bytes32 internal _hypelisterMerkleRoot;
    bytes32 internal _hypememberMerkleRoot;
    // A mapping of addresses and the last sale they have claimed a HYPEHAUS.
    mapping(address => Sale) internal _claimed;

    // ====== CONSTRUCTOR ======

    constructor(
        uint256 maxSupply_,
        string memory baseTokenURI,
        address teamWalletAddress
    ) ERC721A("HYPEHAUS", "HYPE") {
        maxSupply = maxSupply_;
        _baseTokenURI = baseTokenURI;
        _teamWalletAddress = teamWalletAddress;
    }

    // ====== MODIFIERS ======

    modifier isCommunitySaleActive() {
        require(activeSale == Sale.Community, "HH_COMMUNITY_SALE_NOT_ACTIVE");
        _;
    }

    modifier isPublicSaleActive() {
        require(activeSale == Sale.Public, "HH_PUBLIC_SALE_NOT_ACTIVE");
        _;
    }

    modifier isSupplyAvailable(uint256 amount) {
        require((_totalMinted() + amount) <= maxSupply, "HH_SUPPLY_EXHAUSTED");
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

    // TODO: Consider using a different role here.
    function mintAdmin(address receiver, uint256 amount)
        external
        onlyOwner
        isSupplyAvailable(amount)
    {
        _mintToAddress(receiver, amount);
    }

    /**
     * @dev Mints `amount` number of HYPEHAUSes as an ALPHA.
     *
     * This function requires several prerequisites to be met for `msg.sender`
     * to successfully mint HYPEHAUSes as an ALPHA:
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
        isValidMintAmount(amount, maxMintAlpha)
        isCorrectPayment(communitySalePrice, amount)
        isValidMerkleProof(merkleProof, _alphaMerkleRoot)
    {
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Mints `amount` number of HYPEHAUSes as a HYPELISTER.
     *
     * This function has identical prerequisites to `mintAlpha` to be met for
     * `msg.sender` to successfully mint HYPEHAUSes as a HYPELISTER, with the
     * exception of the following:
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
        isValidMintAmount(amount, maxMintHypelister)
        isCorrectPayment(communitySalePrice, amount)
        isValidMerkleProof(merkleProof, _hypelisterMerkleRoot)
    {
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Mints `amount` number of HYPEHAUSes as a HYPEMEMBER.
     *
     * This function has identical prerequisites to `mintAlpha` to be met for
     * `msg.sender` to successfully mint HYPEHAUSes as a HYPEMEMBER, with the
     * exception of the following:
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
        isValidMintAmount(amount, maxMintHypemember)
        isCorrectPayment(communitySalePrice, amount)
        isValidMerkleProof(merkleProof, _hypememberMerkleRoot)
    {
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Mints `amount` number of HYPEHAUSes as a member of the public.
     *
     * This function requires several prerequisites to be met for `msg.sender`
     * to successfully mint HYPEHAUSes as a member of the public:
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
        isValidMintAmount(amount, maxMintPublic)
        isCorrectPayment(publicSalePrice, amount)
    {
        _mintToAddress(msg.sender, amount);
    }

    /**
     * @dev Internal function that mints `amount` number of HYPEHAUSes to
     * `receiver`.
     *
     * TODO: Consider adding `require(tx.origin == msg.sender)` call.
     */
    function _mintToAddress(address receiver, uint256 amount) internal {
        // An address may only mint once during the current `activeSale`. Here,
        // we record the last `activeSale` the receiver has minted.
        _claimed[receiver] = activeSale;
        // The second argument of `_safeMint` in AZUKI's `ERC721A` contract
        // expects the amount to mint, not a token ID.
        _safeMint(receiver, amount);
    }

    // ====== EXTERNAL/PUBLIC FUNCTIONS ======

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

    // ====== ONLY-OWNER OPERATIONS ======

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

    // TODO: Consider using a different role here.
    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

    // ====== ONLY-OWNER SETTERS ======

    // TODO: Consider using a different role here.
    function setCommunitySalePrice(uint256 newPrice) external onlyOwner {
        communitySalePrice = newPrice;
    }

    // TODO: Consider using a different role here.
    function setPublicSalePrice(uint256 newPrice) external onlyOwner {
        publicSalePrice = newPrice;
    }

    // TODO: Consider using a different role here.
    function setActiveSale(Sale newActiveSale) external onlyOwner {
        activeSale = newActiveSale;
    }

    // TODO: Consider using a different role here.
    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        maxSupply = newMaxSupply;
    }

    function setBaseTokenURI(string memory newBaseTokenURI) external onlyOwner {
        _baseTokenURI = newBaseTokenURI;
    }

    // TODO: Consider using a different role here.
    function setTeamWalletAddress(address newAddress) external onlyOwner {
        _teamWalletAddress = newAddress;
    }

    function setAlphaMerkleRoot(bytes32 newMerkleRoot) external onlyOwner {
        _alphaMerkleRoot = newMerkleRoot;
    }

    function setHypelisterMerkleRoot(bytes32 newMerkleRoot) external onlyOwner {
        _hypelisterMerkleRoot = newMerkleRoot;
    }

    function setHypememberMerkleRoot(bytes32 newMerkleRoot) external onlyOwner {
        _hypememberMerkleRoot = newMerkleRoot;
    }
}
