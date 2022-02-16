// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract HypeHaus is ERC1155, Ownable {
    /**
     * @dev Emitted when a new token kind has been created.
     */
    event CreateNewTokenKind(uint256 id, uint256 amount, string uri);

    uint256 public constant HAUS_COIN = 0;
    uint256 public constant HYPE_HAUS = 1;
    uint256 public constant DAO_HAUS = 2;

    mapping(uint256 => string) private _tokenUris;
    uint256 private _nextId = 3;

    constructor() ERC1155("") {
        // First we mint the appropriate amount for each token type.
        _mint(msg.sender, HAUS_COIN, 1e6 * 10**18, "");
        _mint(msg.sender, HYPE_HAUS, 555, "");
        _mint(msg.sender, DAO_HAUS, 8888, "");

        // Then we set the URI for each token type.
        _tokenUris[HAUS_COIN] = "ipfs://<haus-coin>/{id}.json";
        _tokenUris[HYPE_HAUS] = "ipfs://<hype-haus>/{id}.json";
        _tokenUris[DAO_HAUS] = "ipfs://<dao-haus>/{id}.json";
    }

    /**
     * @dev Adds more HAUS coins by `amount`.
     */
    function mintMoreHausCoins(uint256 amount) external onlyOwner {
        _mint(msg.sender, HAUS_COIN, amount, "");
    }

    /**
     * @dev Creates a new token kind with the given `amount` and `uri`.
     *
     * It is up to the the whoever calls this function to decide if the JSON
     * file name `uri` points to conforms to the ERC-1155 Metadata URI JSON
     * Schema.
     *
     * @return The ID of the newly-created token kind.
     */
    function createNewTokenKind(uint256 amount, string calldata uri_)
        external
        onlyOwner
        returns (uint256)
    {
        uint256 newTokenId = _nextId;

        _mint(msg.sender, newTokenId, amount, "");
        _tokenUris[newTokenId] = uri_;
        emit CreateNewTokenKind(newTokenId, amount, uri_);

        _nextId += 1;
        return newTokenId;
    }

    /**
     * @dev Awards `amount` token(s) with the given token kind `id` to the
     * `awardee`.
     */
    function awardToken(
        uint256 id,
        address awardee,
        uint256 amount
    ) external payable onlyOwner {
        _safeTransferFrom(msg.sender, awardee, id, amount, "");
    }

    /**
     * @dev Returns the URI of the given token type ID.
     *
     * This function DOES NOT process `{id}` nor asserts that the JSON file name
     * it points to conforms to the ERC-1155 Metadata URI JSON Schema. It is up
     * to the client's discretion to do what they want with the URI.
     */
    function uri(uint256 id) public view override returns (string memory) {
        return _tokenUris[id];
    }
}
