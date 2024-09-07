// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

import "./ColabXToken.sol";

// a version of ColabXToken.sol that can be called by any address
// so we can run unit tests
contract ColabXTokenTestable is ColabXToken {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ColabXToken(name, symbol, initialSupply) {}

    function _checkControllerAccess() internal pure override returns (bool) {
        return true;
    }
}
