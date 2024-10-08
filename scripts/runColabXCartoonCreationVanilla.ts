// Import ethers from Hardhat package
import contractAbi from "../deployments/g/ColabXCartoonCreation.json"

import {deployments} from "hardhat"
import {getWallet} from "../utils/web3"
import {ColabXCartoonCreation} from "typechain-types"
import bluebird from "bluebird"
import {ethers} from "ethers";

async function main() {
    const contractName = "ColabXCartoonCreation"
    const colabXCartoon = await deployments.get(contractName)

    // const collabXConnect = await connectContract<ColabXCartoonCreation>(contractName)
    // const contract = quickStart.connect(getWallet("admin"))
    //
    // console.log({contractAddress: await contract.getAddress()})
    //


    let contractAddress = "0xd1fB2a15545032a8170370d7eC47C0FC69A00eed"
    contractAddress = colabXCartoon.address

    let contractABI: string[] | any = [
        "function initJob(string memory message) public returns (uint)",
        "function getJobDetails(uint jobId) public view returns (Job memory)",
    ]
    contractABI = contractAbi.abi

    // console.log(contractABI)

    const signer = getWallet("admin")

    const contract = new ethers.Contract(contractAddress, contractABI, signer)


    // Create a contract instance
    // const contract = new ethers.Contract(contractAddress, contractABI, signer)

    // The content of the image you want to generate
    // const message: string = await getUserInput()
    const message: string = "Generate a cover image for my cartoon about space explorers, in anime style with a boy and girl"
    console.log(`
    Image
    generation
    started
    with message:
    "${message}"`)

    // Call the startChat function
    const transactionResponse = await contract.initJob(message)


    const receipt = await transactionResponse.wait()
    console.log(
        `
    Transaction
    sent, hash
: ${receipt.hash}
.\nExplorer: https://explorer.galadriel.com/tx/${receipt.hash}`
        )

    // console.log({receipt})

    // const jobId = await transactionResponse

    let jobId;

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
    while (job.status.toString() == '0') {
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


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
