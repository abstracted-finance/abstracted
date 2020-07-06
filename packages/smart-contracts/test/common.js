const { assert } = require('chai')
const { ethers } = require('@nomiclabs/buidler')
const localhostDeployments = require('../deployments/localhost/deployed.json')

const getContract = async ({ name, address, signer }) => {
  return ethers.getContractAt(
    name,
    address || localhostDeployments[name],
    signer
  )
}

const getProvider = () => {
  return new ethers.providers.JsonRpcProvider('http://localhost:8545')
}

const getNamedAccounts = async () => {
  const accounts = await ethers.getSigners()

  const [deployer, owner, user1, user2] = accounts

  return {
    deployer,
    owner,
    user1,
    user2,
  }
}

const getProxyContract = async ({ signer }) => {
  const proxyFactory = await getContract({
    name: 'ProxyFactory',
    signer,
  })

  let proxyAddress = await proxyFactory.proxies(signer._address)

  if (proxyAddress === ethers.constants.AddressZero) {
    const tx = await proxyFactory['build(address)'](signer._address)
    await tx.wait()

    proxyAddress = await proxyFactory.proxies(signer._address)
  }

  return getContract({ name: 'Proxy', address: proxyAddress, signer })
}

const getContractEthersInterface = async ({ name }) => {
  const contract = await ethers.getContractFactory(name)

  return contract.interface
}

const assertBNGreaterThan = (aBN, bBN) => {
  assert.ok(
    aBN.gt(bBN),
    `${aBN.toString()} is not greater than ${bBN.toString()}`
  )
}

const assertBNGreaterEqualThan = (aBN, bBN) => {
  assert.ok(
    aBN.gte(bBN),
    `${aBN.toString()} is not greater than or equal to ${bBN.toString()}`
  )
}

const assertBNLessThan = (aBN, bBN) => {
  assert.ok(aBN.lt(bBN), `${aBN.toString()} is not less than ${bBN.toString()}`)
}

const assertBNLessEqualThan = (aBN, bBN) => {
  assert.ok(
    aBN.lte(bBN),
    `${aBN.toString()} is not less than or equal to ${bBN.toString()}`
  )
}

const ADDRESSES = {
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
  WEENUS: '0x2823589Ae095D99bD64dEeA80B4690313e2fB519', // Test ERC20
  AAVE_LENDING_POOL_ADDRESS_PROVIDER:
    '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8',
  AETH: '0x3a3A65aAb0dd2A17E3F1947bA16138cd37d08c04',
  ADAI: '0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d',
}

module.exports = {
  ADDRESSES,
  getProvider,
  getNamedAccounts,
  getContract,
  getProxyContract,
  getContractEthersInterface,
  assertBNGreaterEqualThan,
  assertBNGreaterThan,
  assertBNLessEqualThan,
  assertBNLessThan,
}
