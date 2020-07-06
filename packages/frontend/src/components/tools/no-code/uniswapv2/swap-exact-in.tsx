import { useState, useEffect } from 'react'
import { Row, Col, Text, Input, AutoComplete, Tooltip } from '@zeit-ui/react'
import * as Icon from '@zeit-ui/react-icons'

import useLego from '../../../../containers/legos/use-legos'
import useContracts from '../../../../containers/web3/use-contracts'

import GenericLego from '../generic-lego'
import {
  AddressMapping,
  UniswapV2Addresses,
  AllAssets,
  DecimalMapping,
} from '../../../../utils/constants'

import { partialSearchHandler } from '../../../../utils/search'
import { ethers } from 'ethers'

export default (props) => {
  const legoArgs = props.lego.args[0]
  const { updateLego } = useLego.useContainer()
  const { contracts } = useContracts.useContainer()
  const { UniswapV2Actions } = contracts

  const [isGettingAmountMinOut, setIsGettingAmountMinOut] = useState(false)
  const [getAmountMintOutId, setGetAmountMintOutId] = useState(null)

  const [amountIn, setAmountIn] = useState(legoArgs.amountIn)
  const [from, setFrom] = useState(legoArgs.from)

  const [amountMinOut, setAmountMinOut] = useState(legoArgs.amountMinOut)
  const [to, setTo] = useState(legoArgs.to)

  const [inputOptions, setInputOptions] = useState(AllAssets)
  const searchHandler = partialSearchHandler(AllAssets, setInputOptions)

  useEffect(() => {
    const curLego = props.lego
    updateLego({
      ...curLego,
      args: [
        {
          from,
          to,
          amountIn,
          amountMinOut,
        },
      ],
    })
  }, [amountIn, from, amountMinOut, to])

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

  const secondaryDisplay = (
    <div>
      <Text type="secondary" small>
        -{amountIn || '0'} {from}
        &nbsp;&nbsp;&nbsp;&nbsp; +{amountMinOut || '0'} {to}
      </Text>
    </div>
  )

  const primaryDisplay = (
    <>
      <Row align="middle" justify="center">
        <Col span={3}>
          <Icon.LogIn />
        </Col>
        <Col span={13}>
          <Input
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
          />
        </Col>
      </Row>
    </>
  )

  return (
    <GenericLego
      tagText={`Swap Token`}
      title="Uniswap V2"
      secondaryDisplay={secondaryDisplay}
      primaryDisplay={primaryDisplay}
      {...props}
    />
  )
}
