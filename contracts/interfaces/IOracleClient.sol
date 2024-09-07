// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IOracleClient {
    function onOracleFunctionResponse(
        uint callbackId,
        string memory response,
        string memory errorMessage
    ) external;
}
