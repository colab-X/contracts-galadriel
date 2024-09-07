// Import ethers from Hardhat package
import readline from "readline"

import { deployments } from "hardhat"
import { connectContract, getWallet } from "../utils/web3"
import {ColabXCartoonCreation, Quickstart} from "typechain-types"
import { getAccount } from "utils/accounts"
import bluebird from "bluebird"
import JobStruct = ColabXCartoonCreation.JobStruct;

async function main() {
  const contractName = "ColabXCartoonCreation"
  // const quickStartContract = await deployments.get(contractName)

  const quickStart = await connectContract<ColabXCartoonCreation>(contractName)
  const contract = quickStart.connect(getWallet("admin"))

  // Create a contract instance
  // const contract = new ethers.Contract(contractAddress, contractABI, signer)

  // The content of the image you want to generate
  const message = await getUserInput()

  // Call the startChat function
  const transactionResponse = await contract.initJob(message)
  const receipt = await transactionResponse.wait()
  console.log(
    `Transaction sent, hash: ${receipt.hash}.\nExplorer: https://explorer.galadriel.com/tx/${receipt.hash}`
  )
  console.log(`Image generation started with message: "${message}"`)

  const jobId = receipt.getResult()

  let job = await contract.getJobDetails(jobId)

  // print w/o newline
  console.log("Waiting for response: ")


  while (job.status!=0) {
    await bluebird.delay(1000)
    job = await contract.getJobStatus()
    console.log(".")
  }

  console.log(`Image generation completed, image URL: ${newResponse}`)
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
