// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract HypeHausAccessControl is AccessControl {
    // ====== CONSTANTS ======

    // Responsible for changing state variables
    bytes32 public constant OPERATOR_ROLE = keccak256("HH_OPERATOR_ROLE");
    // Responsible for withdrawing pending funds
    bytes32 public constant WITHDRAWER_ROLE = keccak256("HH_WITHDRAWER_ROLE");

    // ====== CONSTRUCTOR ======

    constructor() {
        // The admin may grant and revoke operators and withdrawers
        _setRoleAdmin(OPERATOR_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(WITHDRAWER_ROLE, DEFAULT_ADMIN_ROLE);

        // The contract deployer is the admin
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // ====== MODIFIERS ======

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "HH_CALLER_NOT_ADMIN");
        _;
    }

    modifier onlyOperator() {
        require(
            hasGivenOrAdminRole(OPERATOR_ROLE, msg.sender),
            "HH_CALLER_NOT_OPERATOR"
        );
        _;
    }

    modifier onlyWithdrawer() {
        require(
            hasGivenOrAdminRole(WITHDRAWER_ROLE, msg.sender),
            "HH_CALLER_NOT_WITHDRAWER"
        );
        _;
    }

    // ====== EXTERNAL/PUBLIC FUNCTIONS ======

    /**
     * @dev Determines whether the given `account` is a member of the given
     * `role` or an admin.
     *
     * By default, `hasRole` only checks if the account is a member of a role.
     * However, sometimes it is useful to allow the admin (typically the
     * contract deployer) to also pass this check.
     */
    function hasGivenOrAdminRole(bytes32 role, address account)
        public
        view
        returns (bool)
    {
        return hasRole(role, account) || hasRole(DEFAULT_ADMIN_ROLE, account);
    }
}
