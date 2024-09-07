import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import process from "process"
import {connectContract, getWallet} from "../utils/web3";
import {ColabXCartoonCreation} from "../typechain-types";

const ORACLE_ADDRESS: string = process.env.ORACLE_ADDRESS

if (!ORACLE_ADDRESS) {
  throw new Error("ORACLE_ADDRESS env variable is not set.")
}

const deploy: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const contractName = "ColabXCartoonCreation"
  // @ts-ignore
  const { deployments, getNamedAccounts } = hre
  const { deploy, execute } = deployments
  const { admin } = await getNamedAccounts()
  // log the admin address
  console.log(`admin: ${admin}`)
  let  colabX = await deploy(contractName, {
    from: admin,
    args: [],
    log: true,
    waitConfirmations: hre.network.config.chainId == 1337 ? 1 : 6,
  })
  const contractI = await connectContract<ColabXCartoonCreation>(contractName)
  const contract = contractI.connect(getWallet("admin"))

  // await contract.initialize(ORACLE_ADDRESS);

  await execute(
      contractName,
      {
        from: admin,
        log: true,
      },
      "initialize",
      ORACLE_ADDRESS,)

  return true
}

deploy.id = "cartoon"

export default deploy

module.exports.tags = ["cartoon", "colabx"]
