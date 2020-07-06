const { ethers } = require('ethers')
const path = require('path')

export const randomId = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  //return id of format 'aaaaaaaa'
  return s4() + s4()
}

export const getContract = ({
  name,
  address = undefined,
  network = 'mainnet',
}) => {
  const deployedFilePath = path.join('deployments', network, 'deployed.json')

  let artifact, deployed
  try {
    deployed = require(`@abstracted/smart-contracts/deployments/${network}/deployed.json`)
  } catch (e) {
    throw new Error(
      `Network not found in deployment path! (${deployedFilePath})`
    )
  }

  try {
    artifact = require(`@abstracted/smart-contracts/artifacts/${name}.json`)
  } catch (e) {
    throw new Error(`Contract name not found in artifacts path! (${name})`)
  }

  const abi = artifact.abi
  const aAddress = address || deployed[name]

  if (aAddress === undefined) {
    throw new Error(`${name} has not been deployed to ${network}!`)
  }

  return new ethers.Contract(aAddress, abi)
}

export const getContractInterface = ({ name, network = 'mainnet' }) => {
  return getContract({ name, address: ethers.constants.AddressZero, network })
    .interface
}

export const network =
  process.env.ETH_NETWORK === 'development' ? 'localhost' : 'mainnet'
