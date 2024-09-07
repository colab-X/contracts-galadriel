// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

import "./CollabXToken.sol";

// a version of CollabXToken.sol that can be called by any address
// so we can run unit tests
contract CollabXTokenTestable is CollabXToken {
  constructor(
    string memory name,
    string memory symbol,
    uint256 initialSupply
  ) CollabXToken(name, symbol, initialSupply) {}

  function _checkControllerAccess() internal pure override returns (bool) {
    return true;
  }
}
