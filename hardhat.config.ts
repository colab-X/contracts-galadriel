import { HardhatUserConfig, task } from "hardhat/config"
import "@typechain/hardhat"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-chai-matchers"
import "@nomicfoundation/hardhat-ethers"
import "hardhat-deploy"
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
  solidity: "0.8.21",
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
    geth: {
      url: "http://localhost:8545",
      ws: "ws://localhost:8546",
      chainId: 1337,
      accounts: PRIVATE_KEYS,
      saveDeployments: true,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
      ws: `wss://sepolia.infura.io/ws/v3/${INFURA_KEY}`,
      chainId: 11155111,
      accounts: PRIVATE_KEYS,
      saveDeployments: true,
    },
    hal: {
      chainId: 1337,
      url: `http://${halIp}:8545`,
      ws: `ws://${halIp}:8546`,
      faucet: `http://${halIp}:8085`,
      accounts: PRIVATE_KEYS,
      saveDeployments: true,
    },
    coreDao: {
      //Testnet
      chainId: 1115,
      url: "https://rpc.test.btcs.network",
      faucet: "https://scan.test.btcs.network/faucet",
      explorer: "https://scan.test.btcs.network/",
      accounts: PRIVATE_KEYS,
      saveDeployments: true,
    },

    titanAI: {
      //skale testnet
      chainId: 1020352220,
      url: "https://testnet.skalenodes.com/v1/aware-fake-trim-testnet",
      ws: "wss://testnet.skalenodes.com/v1/ws/aware-fake-trim-testnet",
      accounts: PRIVATE_KEYS,
      saveDeployments: true,
      // https://testnet.portal.skale.space/chains/titan
      // https://aware-fake-trim-testnet.explorer.testnet.skalenodes.com

      // Faucet:
      // https://www.sfuelstation.com/claim-sfuel/0x9c7398aEc564B94db7B932f96d2BD8010a7e8Ee2?testnet=true
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

// config.networks.localhost = config.networks.hardhat

import "./tasks"

// console.log(config)

module.exports = config
