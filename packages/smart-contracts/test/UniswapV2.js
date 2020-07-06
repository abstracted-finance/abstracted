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

describe('UniswapV2', function () {
  const provider = getProvider()
  let user
  let userProxy
  let uniswapv2Actions
  let token

  let IUniswapV2Actions

  before(async () => {
    ;({ user1: user } = await getNamedAccounts())
    userProxy = await getProxyContract({ signer: user })
    token = await getContract({
      name: 'IERC20',
      address: ethers.constants.AddressZero,
      signer: user,
    })

    uniswapv2Actions = await getContract({ name: 'UniswapV2Actions' })
    IUniswapV2Actions = await getContractEthersInterface({
      name: 'UniswapV2Actions',
    })
  })

  const getTokenBalanceOf = async ({ tokenAddress, userAddress }) => {
    if (tokenAddress === ADDRESSES.ETH) {
      return provider.getBalance(userAddress)
    }
    return token.attach(tokenAddress).balanceOf(userAddress)
  }

  const swapExactInForOut = async ({
    amountIn,
    minAmountOut,
    from,
    to,
    recipient,
  }) => {
    const initialBal = await getTokenBalanceOf({
      tokenAddress: to,
      userAddress: recipient,
    })

    const calldata = IUniswapV2Actions.encodeFunctionData('swapExactInForOut', [
      ADDRESSES.UNISWAPV2_ROUTER_V2,
      amountIn,
      minAmountOut,
      from,
      to,
      recipient,
    ])

    const tx = await userProxy.execute(uniswapv2Actions.address, calldata, {
      value: from === ADDRESSES.ETH ? amountIn : 0,
      gasLimit: 600000,
    })
    await tx.wait()

    const finalBal = await getTokenBalanceOf({
      tokenAddress: to,
      userAddress: recipient,
    })

    assertBNGreaterThan(finalBal, initialBal)
  }

  it('Swap (ETH -> DAI)', async function () {
    await swapExactInForOut({
      amountIn: ethers.utils.parseEther('5'),
      minAmountOut: ethers.utils.parseEther('1'),
      from: ADDRESSES.ETH,
      to: ADDRESSES.DAI,
      recipient: userProxy.address,
    })
  })

  it('Swap (DAI -> SNX)', async function () {
    await swapExactInForOut({
      amountIn: ethers.utils.parseEther('10'),
      minAmountOut: ethers.utils.parseEther('0.1'),
      from: ADDRESSES.DAI,
      to: ADDRESSES.SNX,
      recipient: userProxy.address,
    })
  })

  it('Swap (DAI -> ETH)', async function () {
    await swapExactInForOut({
      amountIn: ethers.utils.parseEther('100'),
      minAmountOut: ethers.utils.parseEther('0.1'),
      from: ADDRESSES.DAI,
      to: ADDRESSES.ETH,
      recipient: userProxy.address,
    })
  })
})
