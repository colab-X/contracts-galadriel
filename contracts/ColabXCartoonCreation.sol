// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OracleClient} from "./OracleClient.sol";

contract ColabXCartoonCreation is Ownable, Initializable, OracleClient {
    uint public jobCount;

    enum JobStatus { InProgress, Success, Failed }

    struct Job {
        string message;
        string response;     // The oracle response (success or error message)
        JobStatus status;    // The status of the job (in progress, success, or failed)
    }

    // Mapping from job ID to Job details
    mapping(uint => Job) public jobs;

    function initialize(address _oracleAddress) public initializer {
        setOracleAddress(_oracleAddress);
    }

    // Initiate a new job with a message for the oracle
    function initJob(string memory message) public returns (uint) {
        uint currentId = jobCount;
        jobCount = currentId + 1;

        // Store the job details in the mapping with status InProgress
        jobs[currentId] = Job({
            message: message,
            response: "",
            status: JobStatus.InProgress
        });

        // Call the oracle to create the function call
        IOracle(oracleAddress).createFunctionCall(
            currentId,
            "image_generation",
            message
        );

        return currentId;
    }

    // Handle the response from the oracle
    function onOracleFunctionResponse(
        uint runId,
        string memory response,
        bool isSuccess
    ) public onlyOracle {
        require(runId < jobCount, "Invalid job ID");

        Job storage job = jobs[runId];

        // Update the job with the response and the final status
        job.response = response;
        if (isSuccess) {
            job.status = JobStatus.Success;
        } else {
            job.status = JobStatus.Failed;
        }
    }

    // Retrieve the details of a job by job ID
    function getJobDetails(uint jobId) public view returns (Job memory) {
        require(jobId < jobCount, "Invalid job ID");
        return jobs[jobId];
    }

    // Get the status and response for a specific job
    function getJobStatus(uint jobId) public view returns (JobStatus status, string memory response) {
        require(jobId < jobCount, "Invalid job ID");

        Job storage job = jobs[jobId];
        return (job.status, job.response);
    }
}
