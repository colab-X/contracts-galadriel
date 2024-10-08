// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./IColabXJobManager.sol";
import "./IColabXJobClient.sol";

contract ExampleClient is Ownable, Initializable, IColabXJobClient {
    address private jobManagerAddress;
    IColabXJobManager private jobManagerContract;

    mapping(uint256 => string) private jobResults;

    event JobCreated(uint256 id, string message);

    event JobCompleted(uint256 id, string dealId, string dataId);

    function initialize(address _jobManagerAddress) public initializer {
        setJobManagerAddress(_jobManagerAddress);
    }

    function setJobManagerAddress(address _jobManagerAddress) public onlyOwner {
        require(_jobManagerAddress != address(0), "Job manager address");
        jobManagerAddress = _jobManagerAddress;
        jobManagerContract = IColabXJobManager(jobManagerAddress);
    }

    function getJobResult(uint256 _jobID) public view returns (string memory) {
        return jobResults[_jobID];
    }

    function runCowsay(string memory message) public {
        string[] memory inputs = new string[](1);
        inputs[0] = string(abi.encodePacked("Message=", message));
        uint256 id = jobManagerContract.runJob(
            "cowsay:v0.1.0",
            inputs,
            msg.sender
        );

        emit JobCreated(id, message);
    }

    function submitResults(
        uint256 id,
        string memory dealId,
        string memory dataId
    ) public override {
        jobResults[id] = dataId;
        emit JobCompleted(id, dealId, dataId);
    }
}
