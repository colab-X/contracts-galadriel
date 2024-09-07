// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OracleClient {
    address public oracleAddress;

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }
}
