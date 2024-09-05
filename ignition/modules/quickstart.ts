import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

import hre from "hardhat"

const ORACLE_ADDRESS = process.env.ORACLE_ADDRESS
if (!ORACLE_ADDRESS) {
  throw new Error("ORACLE_ADDRESS env variable is not set.")
}

export default buildModule("Quickstart", (m) => {
  const admin = m.getAccount(0)

  console.log({ admin })

  const quickStart = m.contract("Quickstart", [ORACLE_ADDRESS], {
    // from: admin,
  })

  return { quickStart }
})

// https://hardhat.org/ignition/docs/guides/creating-modules
