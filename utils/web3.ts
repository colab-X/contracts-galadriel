import hre, { ethers } from "hardhat"
import bluebird from "bluebird"
import { AddressLike, BaseContract, BigNumberish, Signer } from "ethers"
import { Account } from "./types"
import { ACCOUNTS, getAccount } from "./accounts"

/*

  WALLET UTILS

*/
export const getWallet = (name: string) => {
  const account = getAccount(name)
  return new ethers.Wallet(account.privateKey, ethers.provider)
}

export const getAddress = (name: string) => {
  const account = getAccount(name)
  return account.address
}

export const getRandomWallet = () => {
  return ethers.Wallet.createRandom()
}

export const transferEther = async (
  fromAccount: Account,
  toAccount: Account,
  amount: BigNumberish
) => {
  const signer = new hre.ethers.Wallet(
    fromAccount.privateKey,
    hre.ethers.provider
  )
  const tx = await signer.sendTransaction({
    to: toAccount.address,
    value: amount,
  })
  await tx.wait()
  console.log(
    `Moved ${amount} ETHER from ${fromAccount.name} (${fromAccount.address}) to ${toAccount.name} (${toAccount.address}) - ${tx.hash}.`
  )
}
/*

  DEPLOYMENT

*/
export async function deployContract<T extends any>(
  name: string,
  signer: Signer,
  args: any[] = []
): Promise<T> {
  const factory = await ethers.getContractFactory(name, signer)
  const contract = (await factory.deploy(...args)) as unknown as T
  return contract
}


/*

  HARDHAT DEPLOYMENTS

  these all require the deployments to have been done via hardhat
  and for there to be deployment.json files for us to look inside of

*/

export async function connectContract<T extends any>(name: string): Promise<T> {
  const deployment = await hre.deployments.get(name)
  const factory = await hre.ethers.getContractFactory(name)
  const contract = factory.attach(deployment.address) as unknown as T
  return contract
}

export async function getContractAddress(name: string): Promise<AddressLike> {
  const deployment = await hre.deployments.get(name)
  return deployment.address
}
