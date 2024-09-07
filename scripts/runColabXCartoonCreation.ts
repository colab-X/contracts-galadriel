// Import ethers from Hardhat package
import readline from "readline"

import {deployments} from "hardhat"
import {connectContract, getWallet} from "../utils/web3"
import {ColabXCartoonCreation, Quickstart} from "typechain-types"
import {getAccount} from "utils/accounts"
import bluebird from "bluebird"
import JobStruct = ColabXCartoonCreation.JobStruct;
import {JobAddedEvent} from "../typechain-types/contracts/ColabXOnChainJobCreator";

async function main() {
    const contractName = "ColabXCartoonCreation"

    const colabXConnect = await connectContract<ColabXCartoonCreation>(contractName)
    const contract = colabXConnect.connect(getWallet("admin"))

    console.log({contractAddress: await contract.getAddress()})

    // Create a contract instance
    // const contract = new ethers.Contract(contractAddress, contractABI, signer)

    // The content of the image you want to generate
    let message: string = "Generate a cover image for my cartoon about space explorers, in anime style with a boy and girl"
    message = await getUserInput()
    console.log(`Image generation started with message: "${message}"`)

    // Call the startChat function
    const transactionResponse = await contract.initJob(message)


    const receipt = await transactionResponse.wait()
    console.log(
        `Transaction sent, hash: ${receipt.hash}.\nExplorer: https://explorer.galadriel.com/tx/${receipt.hash}`
    )

    // console.log({receipt})

    // const jobId = await transactionResponse

    let jobId ;

    receipt.logs.forEach((log) => {
        const logs = contract.interface.parseLog(log as any);
        if (!logs) return;
        jobId = Number(logs.args[0]);
    });

    // jobId = transactionResponse.toString()

    console.log(`Job ID: ${jobId}`)

    let job = await contract.getJobDetails(jobId)

    // print w/o newline
    console.log("Waiting for response: ")


    // jobStatus started
    while (job.status.toString() == '0')  {
        await bluebird.delay(1000)
        job = await contract.getJobDetails(jobId)
        console.log(".")
    }
    console.log({
        id: job.id.toString(),
        jobStatus: job.status.toString(),
        message: job.message,
        response: job.response,
    })

    console.log(`Image generation completed, image URL: ${job.response}`)
}

async function getUserInput(): Promise<string | undefined> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    const question = (query: string): Promise<string> => {
        return new Promise((resolve) => {
            rl.question(query, (answer) => {
                resolve(answer)
            })
        })
    }

    try {
        const input = await question("Enter an image description: ")
        rl.close()
        return input
    } catch (err) {
        console.error("Error getting user input:", err)
        rl.close()
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
