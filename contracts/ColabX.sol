// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IOracle.sol";

contract ColabX {
    // Owner of the contract
    address public owner;

    // Oracle address for off-chain AI interactions
    address public oracleAddress;

    // Events
    event NewRequest(
        uint256 requestId,
        address indexed user,
        string prompt,
        string taskType
    );
    event AIResponseReceived(uint256 requestId, string response);

    // Structure to store creative work details
    struct CreativeWork {
        address creator;
        string prompt;
        string aiResponse;
        string taskType; // "text" or "image"
        bool isCompleted;
    }

    // Mapping to store creative works by requestId
    mapping(uint256 => CreativeWork) public creativeWorks;
    uint256 public requestCount = 0;

    // Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    // Constructor to set the owner and oracle address
    constructor(address _oracleAddress) {
        owner = msg.sender;
        oracleAddress = _oracleAddress;
    }

    // Function to submit a new creative work request
    function createRequest(
        string memory _prompt,
        string memory _taskType
    ) public {
        require(
            keccak256(abi.encodePacked(_taskType)) ==
                keccak256(abi.encodePacked("text")) ||
                keccak256(abi.encodePacked(_taskType)) ==
                keccak256(abi.encodePacked("image")),
            "Invalid task type"
        );

        requestCount++;
        uint256 requestId = requestCount;

        creativeWorks[requestId] = CreativeWork({
            creator: msg.sender,
            prompt: _prompt,
            aiResponse: "",
            taskType: _taskType,
            isCompleted: false
        });

        // Emit event for the new request
        emit NewRequest(requestId, msg.sender, _prompt, _taskType);

        // Interact with the oracle to request AI response
        Oracle(oracleAddress).requestAIResponse(requestId, _prompt, _taskType);
    }

    // Function to handle the AI response (to be called by oracle)
    function handleAIResponse(
        uint256 _requestId,
        string memory _response
    ) public {
        require(msg.sender == oracleAddress, "Unauthorized");

        CreativeWork storage work = creativeWorks[_requestId];
        require(!work.isCompleted, "Work already completed");

        // Update the creative work with AI's response
        work.aiResponse = _response;
        work.isCompleted = true;

        // Emit an event to notify that AI response has been received
        emit AIResponseReceived(_requestId, _response);
    }

    // Function to change oracle address (owner-only)
    function setOracleAddress(address _oracleAddress) public onlyOwner {
        oracleAddress = _oracleAddress;
    }

    // Function to get the creative work details by requestId
    function getCreativeWork(
        uint256 _requestId
    )
        public
        view
        returns (
            address creator,
            string memory prompt,
            string memory aiResponse,
            string memory taskType,
            bool isCompleted
        )
    {
        CreativeWork memory work = creativeWorks[_requestId];
        return (
            work.creator,
            work.prompt,
            work.aiResponse,
            work.taskType,
            work.isCompleted
        );
    }
}
