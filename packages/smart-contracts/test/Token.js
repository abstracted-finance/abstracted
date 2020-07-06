const { ethers } = require('@nomiclabs/buidler')
const {
  ADDRESSES,
  getProvider,
  getContract,
  getNamedAccounts,
  getProxyContract,
  assertBNLessThan,
  assertBNGreaterThan,
  getContractEthersInterface,
} = require('./common')

// To Test ERC20 transfers
const WeenusTokenAbi = require('./abi/WeenusToken')

describe('Token', function () {
  const provider = getProvider()
  let user1
  let user2
  let user1Proxy
  let tokenActions
  let ITokenActions

  let weenusToken

  before(async () => {
    ;({ user1, user2 } = await getNamedAccounts())
    user1Proxy = await getProxyContract({ signer: user1 })

    tokenActions = await getContract({ name: 'TokenActions' })
    ITokenActions = await getContractEthersInterface({ name: 'TokenActions' })

    weenusToken = await ethers.getContractAt(
      WeenusTokenAbi,
      ADDRESSES.WEENUS,
      user1
    )
  })

  it('Transfer (ETH)', async function () {
    const ethAmount = ethers.utils.parseEther('5')

    // Send funds to proxy account first
    await user1.sendTransaction({
      to: user1Proxy.address,
      value: ethAmount,
    })

    // Transfer some ETH from proxy to user2
    const initialUser2Balance = await provider.getBalance(user2._address)
    const initialProxyBalance = await provider.getBalance(user1Proxy.address)

    const calldata = ITokenActions.encodeFunctionData('transfer', [
      user2._address,
      ADDRESSES.ETH,
      ethAmount,
    ])

    const tx = await user1Proxy.execute(tokenActions.address, calldata, {
      gasLimit: 600000,
    })
    await tx.wait()

    const finalUser2Balance = await provider.getBalance(user2._address)
    const finalProxyBalance = await provider.getBalance(user1Proxy.address)

    assertBNLessThan(finalProxyBalance, initialProxyBalance)
    assertBNGreaterThan(finalUser2Balance, initialUser2Balance)
  })

  it('Transfer (ERC20)', async function () {
    // Sends the funds to proxy
    const erc20Amount = ethers.utils.parseEther('100')
    await weenusToken.drip()
    await weenusToken.transfer(user1Proxy.address, erc20Amount)

    // Transfer ERC20 from proxy to user2
    const initialUser2Balance = await weenusToken.balanceOf(user2._address)
    const initialProxyBalance = await weenusToken.balanceOf(user1Proxy.address)

    const calldata = ITokenActions.encodeFunctionData('transfer', [
      user2._address,
      ADDRESSES.WEENUS,
      erc20Amount,
    ])
    const tx = await user1Proxy.execute(tokenActions.address, calldata, {
      gasLimit: 600000,
    })
    await tx.wait()

    const finalUser2Balance = await weenusToken.balanceOf(user2._address)
    const finalProxyBalance = await weenusToken.balanceOf(user1Proxy.address)

    assertBNLessThan(finalProxyBalance, initialProxyBalance)
    assertBNGreaterThan(finalUser2Balance, initialUser2Balance)
  })
})
