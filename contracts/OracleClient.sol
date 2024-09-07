// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OracleClient is Ownable{
    address public oracleAddress;
    event OracleAddressUpdated(address indexed newOracleAddress);


    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        require(newOracleAddress != address(0), "Invalid Oracle Address: zero address");
        require(oracleAddress!=newOracleAddress, "Oracle Address is same");
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }
}
