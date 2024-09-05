import { HardhatUserConfig, task } from "hardhat/config"
import "@typechain/hardhat"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-chai-matchers"
import "@nomicfoundation/hardhat-ethers"
import "hardhat-deploy"
import "@nomicfoundation/hardhat-ignition"

import * as dotenv from "dotenv"
import * as process from "process"

const ENV_FILE = process.env.CONFIG || "./.env"

console.log(`ENV_FILE is ${ENV_FILE}`)

dotenv.config({ path: ENV_FILE })

import { ACCOUNT_ADDRESSES, PRIVATE_KEYS } from "./utils/accounts"

let NETWORK = process.env.NETWORK || "hardhat"
const INFURA_KEY = process.env.INFURA_KEY || ""

console.log(`infura key is ${INFURA_KEY}`)

const halIp = "23.239.13.239"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable the IR optimization to work around the "Stack too deep" error
    },
  },
  defaultNetwork: NETWORK,
  namedAccounts: ACCOUNT_ADDRESSES,
  networks: {
    hardhat: {
      saveDeployments: true,
      // deploy: "hardhat",
      chainId: 1337,
      accounts: [
        {
          privateKey:
            process.env.PRIVATE_KEY ||
            "beb00ab9be22a34a9c940c27d1d6bfe59db9ab9de4930c968b16724907591b3f",
          balance: `${1000000000000000000000000n}`,
        },
        ...PRIVATE_KEYS.map((privateKey) => {
          return {
            privateKey: privateKey,
            balance: `${1000000000000000000000000n}`,
          }
        }),
      ],
    },
    localhost: {
      url: "http://localhost:8545",
      ws: "ws://localhost:8546",
      chainId: 1337,
      accounts: PRIVATE_KEYS,
      saveDeployments: true,
    },
    g: {
      chainId: 696969,
      url: "https://devnet.galadriel.com/",
      accounts: PRIVATE_KEYS,
      // https://explorer.galadriel.com/
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  // sourcify: {
  //     // Disabled by default
  //     // Doesn't need an API key
  //     enabled: true
  // }
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    dontOverrideCompile: false, // defaults to false
  },
}

config.networks.galadriel = config.networks.g

// config.networks.localhost = config.networks.hardhat

// import "./tasks"

// console.log(config)

module.exports = config
