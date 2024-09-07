// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OracleClient} from "./OracleClient.sol";

contract ColabXCartoonCreation is Ownable, Initializable, OracleClient {
    uint public jobCount;

    enum JobStatus { InProgress, Success, Failed }

    event JobUpdated (uint indexed jobId, JobStatus jobStatus);

    struct Job {
        uint id;
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
        jobCount++;

        JobStatus jobStatus = JobStatus.InProgress;

        // Store the job details in the mapping with status InProgress
        jobs[currentId] = Job({
            id:currentId,
            message: message,
            response: "",
            status: jobStatus
        });

        // Call the oracle to create the function call
        IOracle(oracleAddress).createFunctionCall(
            currentId,
            "image_generation",
            message
        );

        emit JobUpdated(currentId, jobStatus);

        return currentId;
    }


    function checkJobId (uint jobId) public view returns (bool){
//        require(jobId < jobCount, "Invalid job ID");
        return jobId<jobCount;
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

        emit JobUpdated(runId, job.status);
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
