const { ethers } = require('@nomiclabs/buidler')
const {
  ADDRESSES,
  getProvider,
  getContract,
  getNamedAccounts,
  getProxyContract,
  getContractEthersInterface,
  assertBNGreaterThan,
} = require('./common')

describe('Aave', function () {
  const provider = getProvider()

  let user
  let userProxy
  let token
  let aaveActions
  let aaveFlashloanActions
  let tokenActions
  let aToken

  let IAaveActions
  let IAaveFlashloanActions
  let ITokenActions

  let aaveLendingPoolAddressProvider
  let aaveLendingPoolCoreAddress
  let aaveLendingPoolAddress

  before(async () => {
    aaveLendingPoolAddressProvider = await getContract({
      name: 'ILendingPoolAddressesProvider',
      address: ADDRESSES.AAVE_LENDING_POOL_ADDRESS_PROVIDER,
    })

    aaveLendingPoolCoreAddress = await aaveLendingPoolAddressProvider.getLendingPoolCore()
    aaveLendingPoolAddress = await aaveLendingPoolAddressProvider.getLendingPool()
    ;({ user1: user } = await getNamedAccounts())

    userProxy = await getProxyContract({ signer: user })

    aToken = await getContract({
      name: 'IAToken',
      address: ethers.constants.AddressZero,
      signer: user,
    })
    token = await getContract({
      name: 'IERC20',
      address: ethers.constants.AddressZero,
      signer: user,
    })

    aaveActions = await getContract({ name: 'AaveActions' })
    aaveFlashloanActions = await getContract({ name: 'AaveFlashloanActions' })
    tokenActions = await getContract({ name: 'TokenActions' })

    IAaveActions = await getContractEthersInterface({
      name: 'AaveActions',
    })
    IAaveFlashloanActions = await getContractEthersInterface({
      name: 'AaveFlashloanActions',
    })
    ITokenActions = await getContractEthersInterface({
      name: 'TokenActions',
    })
  })

  const getTokenBalanceOf = async ({ tokenAddress, userAddress }) => {
    if (tokenAddress === ADDRESSES.ETH) {
      return provider.getBalance(userAddress)
    }
    return token.attach(tokenAddress).balanceOf(userAddress)
  }

  const depositAave = async ({
    depositAmountWei,
    tokenAddress,
    aTokenAddress,
  }) => {
    const initialBal = await aToken
      .attach(aTokenAddress)
      .balanceOf(userProxy.address)

    const calldata = IAaveActions.encodeFunctionData('deposit', [
      aaveLendingPoolAddress,
      aaveLendingPoolCoreAddress,
      userProxy.address,
      tokenAddress,
      depositAmountWei,
    ])

    const tx = await userProxy.execute(aaveActions.address, calldata, {
      value: tokenAddress === ADDRESSES.ETH ? depositAmountWei : '0',
      gasLimit: 1200000,
    })
    await tx.wait()

    const finalBal = await aToken
      .attach(aTokenAddress)
      .balanceOf(userProxy.address)

    assertBNGreaterThan(finalBal, initialBal)
  }

  const borrowAave = async ({ borrowAmountWei, tokenAddress }) => {
    const initialBal = await getTokenBalanceOf({
      tokenAddress,
      userAddress: userProxy.address,
    })

    const calldata = IAaveActions.encodeFunctionData('borrow', [
      aaveLendingPoolAddress,
      tokenAddress,
      borrowAmountWei,
      2, // variable rate
    ])

    const tx = await userProxy.execute(aaveActions.address, calldata, {
      gasLimit: 1200000,
    })
    await tx.wait()

    const finalBal = await getTokenBalanceOf({
      tokenAddress,
      userAddress: userProxy.address,
    })

    assertBNGreaterThan(finalBal, initialBal)
  }

  const flashloanAave = async ({ reserve, amountWei, autoFund }) => {
    const refundAmount = amountWei
      .mul(ethers.BigNumber.from('10009'))
      .div(ethers.BigNumber.from('10000'))

    // Give account enough fees to refund
    if (autoFund) {
      const fee = refundAmount.sub(amountWei)

      if (reserve === ADDRESSES.ETH) {
        await user.sendTransaction({
          to: userProxy.address,
          value: fee,
        })
      } else {
        await token.attach(reserve).transfer(userProxy.address, fee)
      }
    }

    // Postloan we need to refund
    const postloanAddress = tokenActions.address
    const postloanActionData = ITokenActions.encodeFunctionData('transfer', [
      aaveLendingPoolCoreAddress,
      reserve,
      refundAmount, // Aave has 0.09% fee
    ])

    const targets = [postloanAddress]
    const data = [postloanActionData]
    const msgValues = [reserve === ADDRESSES.ETH ? refundAmount : 0]

    const proxyTargetData = ethers.utils.defaultAbiCoder.encode(
      ['tuple(address,address[],bytes[],uint256[])'],
      [[userProxy.address, targets, data, msgValues]]
    )

    // Call "flashLoan" via proxy
    const flashloanCalldata = IAaveFlashloanActions.encodeFunctionData(
      'flashLoan',
      [
        aaveLendingPoolAddress,
        aaveFlashloanActions.address,
        reserve,
        amountWei,
        proxyTargetData,
      ]
    )

    const flashLoanTx = await userProxy.executes(
      [aaveFlashloanActions.address],
      [flashloanCalldata],
      [ethers.constants.Zero],
      { value: 0, gasLimit: 6000000 }
    )
    await flashLoanTx.wait()
  }

  describe('AaveActions', function () {
    it('Deposit (ETH)', async function () {
      const depositAmountWei = ethers.utils.parseEther('5')
      const aTokenAddress = ADDRESSES.AETH
      const tokenAddress = ADDRESSES.ETH

      await depositAave({
        depositAmountWei,
        aTokenAddress,
        tokenAddress,
      })
    })

    it('Borrow (DAI)', async function () {
      const borrowAmountWei = ethers.utils.parseEther('100')
      const tokenAddress = ADDRESSES.DAI

      await borrowAave({
        borrowAmountWei,
        tokenAddress,
      })
    })

    it('Deposit (DAI)', async function () {
      const depositAmountWei = ethers.utils.parseEther('10')
      const aTokenAddress = ADDRESSES.ADAI
      const tokenAddress = ADDRESSES.DAI

      await depositAave({
        depositAmountWei,
        aTokenAddress,
        tokenAddress,
      })
    })

    it('Borrow (ETH)', async function () {
      const borrowAmountWei = ethers.utils.parseEther('0.05')
      const tokenAddress = ADDRESSES.ETH

      await borrowAave({
        borrowAmountWei,
        tokenAddress,
      })
    })
  })

  describe('AaveFlashloanActions', function () {
    it('Flashloan (ETH)', async function () {
      await flashloanAave({
        reserve: ADDRESSES.ETH,
        amountWei: ethers.utils.parseEther('10'),
        autoFund: true,
      })
    })

    it('Flashloan (DAI)', async function () {
      // Should have enough from borrow to refund
      await flashloanAave({
        reserve: ADDRESSES.DAI,
        amountWei: ethers.utils.parseEther('10'),
        autoFund: false,
      })
    })
  })
})
