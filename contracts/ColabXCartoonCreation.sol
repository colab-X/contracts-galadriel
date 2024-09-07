// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IOracle.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ColabXCartoonCreation is Ownable, Initializable {
    address public oracleAddress;

    string public lastResponse;

    uint public callsCount;

    event OracleAddressUpdated(address indexed newOracleAddress);

    function initialize(address _oracleAddress) public initializer{
        setOracleAddress(_oracleAddress);
    }

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

    function initJob(string memory message) public returns (uint) {
        uint currentId = callsCount;
        callsCount = currentId + 1;

        IOracle(oracleAddress).createFunctionCall(
            currentId,
            "image_generation",
            message
        );

        return currentId;
    }

    function onOracleFunctionResponse(
        uint /*runId*/,
        string memory response,
        string memory errorMessage
    ) public onlyOracle {
        if (
            keccak256(abi.encodePacked(errorMessage)) !=
            keccak256(abi.encodePacked(""))
        ) {
            lastResponse = errorMessage;
        } else {
            lastResponse = response;
        }
    }
}
