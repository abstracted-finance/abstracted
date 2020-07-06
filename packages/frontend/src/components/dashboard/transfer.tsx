import {
  Text,
  Card,
  AutoComplete,
  Input,
  Spacer,
  Link,
  useToasts,
  Row,
  Col,
} from '@zeit-ui/react'
import * as Icon from '@zeit-ui/react-icons'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode.react'
import { ethers } from 'ethers'

import {
  AssetOptionsAutoComplete,
  Assets,
  AllAssets,
  AddressMapping,
  DecimalMapping,
  UniswapV2Addresses,
} from '../../utils/constants'

import { FullWidthButton } from '../buttons'

import { partialSearchHandler } from '../../utils/search'
import useContracts from '../../containers/web3/use-contracts'
import useProxy from '../../containers/web3/use-proxy'
import useBalances from '../../containers/balances/use-balances'
import useWithdraw from '../../containers/balances/use-withdraw'

const WithdrawCard = () => {
  const [, setToasts] = useToasts()
  const [withdrawToken, setWithdrawToken] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const { hasProxy, proxyAddress } = useProxy.useContainer()
  const { tryGetAddressAndDecimal, getBalanceOf } = useBalances.useContainer()
  const { withdraw, isWithdrawing } = useWithdraw.useContainer()

  const maxHandler = async () => {
    setWithdrawAmount('...')
    const { tokenAddress, decimals } = await tryGetAddressAndDecimal(
      withdrawToken
    )

    if (!decimals || !tokenAddress) {
      setWithdrawAmount('0')
      return
    }

    const balWei = await getBalanceOf({
      token: tokenAddress,
      address: proxyAddress,
    })
    setWithdrawAmount(ethers.utils.formatUnits(balWei, decimals))
  }

  const withdrawHandler = async () => {
    const { tokenAddress, decimals } = await tryGetAddressAndDecimal(
      withdrawToken
    )

    if (!decimals || !tokenAddress) return

    try {
      await withdraw({
        tokenAddress,
        amountWei: ethers.utils.parseUnits(withdrawAmount, decimals),
      })
    } catch (e) {
      setToasts({
        text: 'Failed to withdraw!',
        type: 'error',
      })
    }
  }

  return (
    <Card>
      <Text h5>Withdraw</Text>
      <Spacer y={0.25} />
      <AutoComplete
        value={withdrawToken}
        placeholder="Token address or token name"
        width="100%"
        options={AssetOptionsAutoComplete}
        onChange={(v) => setWithdrawToken(v)}
      />
      <Spacer y={0.25} />
      <Input
        iconClickable={true}
        onIconClick={maxHandler}
        iconRight={<Icon.Zap />}
        value={withdrawAmount}
        placeholder="Amount"
        width="100%"
        onChange={(e) => setWithdrawAmount(e.target.value)}
      />
      <Spacer y={0.5} />
      <FullWidthButton
        loading={isWithdrawing}
        disabled={!hasProxy}
        type="secondary"
        onClick={withdrawHandler}
      >
        Withdraw
      </FullWidthButton>
    </Card>
  )
}

export const SupplyCard = () => {
  const { hasProxy, proxyAddress } = useProxy.useContainer()

  return (
    <Card>
      <Text h5>Supply</Text>
      {hasProxy ? (
        <>
          <Text size={14} type="secondary">
            Send tokens to {proxyAddress} to fund your wallet.
          </Text>
          <QRCode value={proxyAddress} />
        </>
      ) : (
        <Text size={14} type="secondary">
          Create a smart wallet first!
        </Text>
      )}
    </Card>
  )
}

export const SwapCard = () => {
  const { hasProxy, proxy, proxyAddress } = useProxy.useContainer()
  const { getBalanceOf, tryGetAddressAndDecimal } = useBalances.useContainer()
  const { contracts } = useContracts.useContainer()
  const { UniswapV2Actions } = contracts

  const [, setToasts] = useToasts()
  const [isSwapping, setIsSwapping] = useState(false)

  const [isGettingAmountMinOut, setIsGettingAmountMinOut] = useState(false)
  const [getAmountMintOutId, setGetAmountMintOutId] = useState(null)

  const [amountIn, setAmountIn] = useState('')
  const [from, setFrom] = useState<string>(Assets.ETH)

  const [amountMinOut, setAmountMinOut] = useState('')
  const [to, setTo] = useState<string>(Assets.DAI)

  const [inputOptions, setInputOptions] = useState(AllAssets)
  const searchHandler = partialSearchHandler(AllAssets, setInputOptions)

  const swapFromToHandler = () => {
    const [newFrom, newTo] = [to, from]
    const [newAmountIn, newAmountMinOut] = [amountMinOut, amountIn]

    setFrom(newFrom)
    setTo(newTo)

    setAmountIn(newAmountIn)
    setAmountMinOut(newAmountMinOut)
  }

  const maxInHandler = async () => {
    setAmountIn('...')
    const { tokenAddress, decimals } = await tryGetAddressAndDecimal(from)

    if (!decimals || !tokenAddress) {
      setAmountIn('0')
      return
    }

    const balWei = await getBalanceOf({
      token: tokenAddress,
      address: proxyAddress,
    })
    setAmountIn(ethers.utils.formatUnits(balWei, decimals))
  }

  const getAmountMinOut = async () => {
    // Fetchs amount out for input
    const fromAddress = AddressMapping[from]
    const toAddress = AddressMapping[to]
    const fromDecimals = DecimalMapping[from]
    const toDecimals = DecimalMapping[to]
    const amountInWei = ethers.utils.parseUnits(amountIn, fromDecimals)

    const amountOutWei = await UniswapV2Actions.getExactInForOut(
      UniswapV2Addresses.RouterV2,
      fromAddress,
      toAddress,
      amountInWei
    )
    const amountOut = ethers.utils.formatUnits(amountOutWei, toDecimals)
    setAmountMinOut(amountOut)
    setIsGettingAmountMinOut(false)
  }

  const swapHandler = async () => {
    setIsSwapping(true)

    const fromAddress = AddressMapping[from]
    const toAddress = AddressMapping[to]
    const fromDecimals = DecimalMapping[from]
    const toDecimals = DecimalMapping[to]
    const amountInWei = ethers.utils.parseUnits(amountIn, fromDecimals)
    const amountMinOutWei = ethers.utils.parseUnits(amountMinOut, toDecimals)

    const callback = UniswapV2Actions.interface.encodeFunctionData(
      'swapExactInForOut',
      [
        UniswapV2Addresses.RouterV2,
        amountInWei,
        amountMinOutWei,
        fromAddress,
        toAddress,
        proxyAddress,
      ]
    )

    try {
      const tx = await proxy.execute(UniswapV2Actions.address, callback, {
        gasLimit: 310000,
      })
      await tx.wait()

      setToasts({
        text: 'Swap successful',
        type: 'success',
      })
    } catch (e) {
      setToasts({
        text: 'Swap failed',
        type: 'error',
      })
    }

    setIsSwapping(false)
  }

  useEffect(() => {
    if (isNaN(parseFloat(amountIn))) return
    if (!AddressMapping[from]) return
    if (!AddressMapping[to]) return
    if (!DecimalMapping[from]) return
    if (!DecimalMapping[to]) return

    clearTimeout(getAmountMintOutId)
    setIsGettingAmountMinOut(true)
    setGetAmountMintOutId(setTimeout(() => getAmountMinOut(), 1000))
  }, [amountIn, from])

  return (
    <>
      <Card>
        <Text h5>
          Swap&nbsp;&nbsp;
          <span className="swap-from-to" onClick={swapFromToHandler}>
            <Icon.Repeat size={14} />
          </span>
        </Text>
        <Row align="middle" justify="center">
          <Col span={3}>
            <Icon.LogIn />
          </Col>
          <Col span={13}>
            <Input
              iconClickable={hasProxy}
              onIconClick={maxInHandler}
              iconRight={<Icon.Zap />}
              onChange={(e) => setAmountIn(e.target.value)}
              placeholder="Amount In"
              width="100%"
              value={amountIn}
            />
          </Col>
          <Col span={8}>
            <AutoComplete
              initialValue={from}
              width="100%"
              options={inputOptions}
              onSearch={searchHandler}
              onSelect={setFrom}
              value={from}
            />
          </Col>
        </Row>
        <Row align="middle" justify="center">
          <Col span={3}>
            <Icon.LogOut />
          </Col>
          <Col span={13}>
            <Input
              onChange={(e) => setAmountMinOut(e.target.value)}
              placeholder="Min amount out"
              width="100%"
              value={isGettingAmountMinOut ? '...' : amountMinOut}
            />
          </Col>
          <Col span={8}>
            <AutoComplete
              initialValue={to}
              width="100%"
              options={inputOptions}
              onSearch={searchHandler}
              onSelect={setTo}
              value={to}
            />
          </Col>
        </Row>
        <Spacer y={1} />
        <FullWidthButton
          onClick={swapHandler}
          loading={isSwapping}
          disabled={!hasProxy}
          type="secondary"
        >
          Swap
        </FullWidthButton>
      </Card>

      <style jsx>{`
        .swap-from-to {
          cursor: pointer;
        }
      `}</style>
    </>
  )
}

export default () => {
  return (
    <>
      <Text h3>Transfer</Text>
      <Text size={14} type="secondary">
        Manage tokens in your smart wallet account here.
      </Text>

      <SwapCard />
      <Spacer y={0.5} />
      <WithdrawCard />
      <Spacer y={0.5} />
      <SupplyCard />
      <Spacer y={0.5} />
    </>
  )
}
