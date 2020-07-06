import { ethers } from 'ethers'
import { Lego, LegoType } from '../containers/legos/use-legos'
import { getContractInterface, getContract, network } from '../utils/common'
import {
  AaveAddresses,
  UniswapV2Addresses,
  AddressMapping,
  DecimalMapping,
  CTokenMapping,
  Assets,
} from './constants'

interface LegoResults {
  valid: boolean
  serialized: SerializedLego[]
}

type SerializedLego = {
  target: string
  data: string
  msgValue: ethers.BigNumber
}

type Address = string

const CompoundActions = getContract({ name: 'CompoundActions', network })
const ICompoundActions = getContractInterface({
  name: 'CompoundActions',
  network,
})

const TokenActions = getContract({ name: 'TokenActions', network })
const ITokenActions = getContractInterface({ name: 'TokenActions', network })

const AaveFlashloanActions = getContract({
  name: 'AaveFlashloanActions',
  network,
})
const IAaveFlashloanActions = getContractInterface({
  name: 'AaveFlashloanActions',
  network,
})

const UniswapV2Actions = getContract({
  name: 'UniswapV2Actions',
  network,
})
const IUniswapV2Actions = getContractInterface({
  name: 'UniswapV2Actions',
  network,
})

const serializeCompoundLego = ({ lego }: { lego: Lego }): SerializedLego => {
  const { asset, amount } = lego.args[0]
  const decimals = DecimalMapping[asset]
  const amountWei = ethers.utils.parseUnits(amount, decimals)
  const cTokenAsset = CTokenMapping[asset]
  const cTokenAddress = cTokenAsset ? AddressMapping[cTokenAsset] : null
  const msgValue = asset === Assets.ETH ? amountWei : ethers.constants.Zero

  // Mapping of lego type and function name
  const LegoTypeFunctionNameMapping = {
    [LegoType.CompoundBorrow]: 'borrow',
    [LegoType.CompoundSupply]: 'supply',
    [LegoType.CompoundRepay]: 'repayBorrow',
    [LegoType.CompoundWithdraw]: 'redeemUnderlying',
  }

  return {
    target: CompoundActions.address,
    msgValue,
    data: ICompoundActions.encodeFunctionData(
      LegoTypeFunctionNameMapping[lego.type],
      [cTokenAddress, amountWei]
    ),
  }
}

const serializeUniswapV2Lego = ({
  lego,
  userProxy,
}: {
  lego: Lego
  userProxy: Address
}): SerializedLego => {
  const { from, to, amountIn, amountMinOut } = lego.args[0]
  const fromDecimals = DecimalMapping[from]
  const toDecimals = DecimalMapping[to]
  const fromAddress = AddressMapping[from]
  const toAddress = AddressMapping[to]
  const amountInWei = ethers.utils.parseUnits(amountIn, fromDecimals)
  const amountMinOutWei = ethers.utils.parseUnits(amountMinOut, toDecimals)
  const msgValue = from === Assets.ETH ? amountInWei : ethers.constants.Zero

  if (lego.type === LegoType.UniswapV2SwapExactInToOut) {
    return {
      target: UniswapV2Actions.address,
      msgValue,
      data: IUniswapV2Actions.encodeFunctionData('swapExactInForOut', [
        UniswapV2Addresses.RouterV2,
        amountInWei,
        amountMinOutWei,
        fromAddress,
        toAddress,
        userProxy,
      ]),
    }
  }
}

export const serializeLego = ({
  lego,
  userProxy,
}: {
  lego: Lego
  userProxy: Address
}): SerializedLego => {
  const CompoundLegoTypes = [
    LegoType.CompoundBorrow,
    LegoType.CompoundRepay,
    LegoType.CompoundSupply,
    LegoType.CompoundWithdraw,
  ]

  const UniswapV2LegoTypes = [LegoType.UniswapV2SwapExactInToOut]

  if (CompoundLegoTypes.includes(lego.type)) {
    return serializeCompoundLego({ lego })
  }

  if (UniswapV2LegoTypes.includes(lego.type)) {
    return serializeUniswapV2Lego({ lego, userProxy })
  }

  throw new Error(`Unrecognized type: ${lego.type}`)
}

export const serializeLegos = ({
  legos,
  userProxy,
}: {
  legos: Lego[]
  userProxy: Address
}): SerializedLego[] => {
  if (legos.length === 0) {
    return []
  }

  let jumpUntil = -1
  let serialized = []
  for (const [i, lego] of legos.entries()) {
    if (i <= jumpUntil) {
      continue
    }

    if (lego.id.startsWith('flashloan-start')) {
      const cleanId = lego.id.replace('flashloan-start-', '')
      const endingId = `flashloan-end-${cleanId}`
      const endingIndex = legos.findIndex((x) => x.id === endingId)

      // Invalid configuration
      if (endingIndex === -1) {
        return []
      }

      // Serialize
      const innerSerialized = serializeLegos({
        legos: legos.slice(i + 1, endingIndex),
        userProxy,
      })

      // Flashloan block
      if (lego.type === LegoType.AaveFlashloanStart) {
        const { amount, asset } = lego.args[0]
        const decimals = DecimalMapping[asset]
        const amountWei = ethers.utils.parseUnits(amount, decimals)
        const assetAddress = AddressMapping[asset]
        const refundAmountWei = amountWei
          .mul(ethers.BigNumber.from('10009'))
          .div(ethers.BigNumber.from('10000'))
        const msgValue =
          asset === Assets.ETH ? refundAmountWei : ethers.constants.Zero

        const postloanAddress = TokenActions.address
        const postloanData = ITokenActions.encodeFunctionData('transfer', [
          AaveAddresses.LendingPoolCore,
          assetAddress,
          refundAmountWei, // Aave has 0.09% fee
        ])

        const targets = [
          ...innerSerialized.map((x) => x.target),
          postloanAddress,
        ]

        const data = [...innerSerialized.map((x) => x.data), postloanData]

        const msgValues = [...innerSerialized.map((x) => x.msgValue), msgValue]

        const proxyTargetData = ethers.utils.defaultAbiCoder.encode(
          ['tuple(address,address[],bytes[],uint256[])'],
          [[userProxy, targets, data, msgValues]]
        )

        const flashloanSerialized = IAaveFlashloanActions.encodeFunctionData(
          'flashLoan',
          [
            AaveAddresses.LendingPool,
            AaveFlashloanActions.address,
            assetAddress,
            amountWei,
            proxyTargetData,
          ]
        )

        serialized.push({
          target: AaveFlashloanActions.address,
          data: flashloanSerialized,
          msgValue: ethers.constants.Zero,
        })
      }

      // Jump until end of nested flashloan block
      jumpUntil = endingIndex
    } else {
      serialized.push(serializeLego({ lego, userProxy }))
    }
  }

  return serialized
}

export const parseLegos = ({
  legos,
  userProxy,
}: {
  legos: Lego[]
  userProxy: Address
}): LegoResults => {
  // Empty legos is valid legos
  if (legos.length === 0) {
    return {
      valid: true,
      serialized: [],
    }
  }

  // Go through each entry and check if the nested flashloans
  // are placed correctly
  for (const [i, { id }] of legos.entries()) {
    // If our id starts with flashloan start
    if (id.startsWith('flashloan-start')) {
      const cleanId = id.replace('flashloan-start-', '')
      const endingId = `flashloan-end-${cleanId}`
      const endingIndex = legos.findIndex((x) => x.id === endingId)

      // If no flashloan ending found within, then its invalid
      if (endingIndex === -1) {
        return {
          valid: false,
          serialized: [],
        }
      }

      // Checks to see if inner block is valid
      const parsed = parseLegos({
        legos: legos.slice(i + 1, endingIndex),
        userProxy,
      })

      if (!parsed.valid) {
        return {
          valid: false,
          serialized: [],
        }
      }
    }
  }

  return {
    valid: true,
    serialized: serializeLegos({
      legos,
      userProxy,
    }),
  }
}
