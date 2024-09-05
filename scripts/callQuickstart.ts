// Import ethers from Hardhat package
import readline from "readline"

import { deployments, ethers } from "hardhat"
import { connectContract, getWallet } from "../utils/web3"
import { Quickstart } from "typechain-types"
import { getAccount } from "utils/accounts"

async function main() {
  const contractABI = [
    "function initializeDalleCall(string memory message) public returns (uint)",
    "function lastResponse() public view returns (string)",
  ]

  // const quickStart = await deployments.get("Quickstart")
  const quickStart = await connectContract<Quickstart>("Quickstart")

  // const contractAddress = process.env.QUICKSTART_CONTRACT_ADDRESS
  const contractAddress = quickStart.address

  const [signer] = await ethers.getSigners()

  // Create a contract instance
  // const contract = new ethers.Contract(contractAddress, contractABI, signer)

  const contract = quickStart.connect(getWallet("admin"))

  // The content of the image you want to generate
  const message = await getUserInput()

  // Call the startChat function
  const transactionResponse = await contract.initializeDalleCall(message)
  const receipt = await transactionResponse.wait()
  console.log(
    `Transaction sent, hash: ${receipt.hash}.\nExplorer: https://explorer.galadriel.com/tx/${receipt.hash}`
  )
  console.log(`Image generation started with message: "${message}"`)

  // loop and sleep by 1000ms, and keep printing `lastResponse` in the contract.
  let lastResponse = await contract.lastResponse()
  let newResponse = lastResponse

  // print w/o newline
  console.log("Waiting for response: ")
  while (newResponse === lastResponse) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    newResponse = await contract.lastResponse()
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
