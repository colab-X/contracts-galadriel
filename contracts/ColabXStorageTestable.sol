// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

import "./CollabXStorage.sol";

contract CollabXStorageTestable is CollabXStorage {
  function _checkControllerAccess() internal pure override returns (bool) {
    return true;
  }
}
