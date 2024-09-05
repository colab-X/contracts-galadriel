import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const ORACLE_ADDRESS: string = process.env.ORACLE_ADDRESS

if (ORACLE_ADDRESS) {
  throw new Error("ORACLE_ADDRESS env variable is not set.")
}

const deployQuickStart: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { admin } = await getNamedAccounts()
  // log the admin address
  console.log(`admin: ${admin}`)
  await deploy("Quickstart", {
    from: admin,
    args: [],
    log: true,
    waitConfirmations: hre.network.config.chainId == 1337 ? 1 : 6,
  })
  return true
}

deployQuickStart.id = "quickStart"

export default deployQuickStart

module.exports.tags = ["quickStart"]
