// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IOracle.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OracleClient} from "./OracleClient.sol";

contract ColabXCartoonCreation is Ownable, Initializable, OracleClient {
    string public lastResponse;

    uint public callsCount;

    function initialize(address _oracleAddress) public initializer{
        setOracleAddress(_oracleAddress);
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
