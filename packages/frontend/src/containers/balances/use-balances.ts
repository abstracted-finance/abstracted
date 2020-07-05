import { createContainer } from 'unstated-next'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import useWeb3 from '../web3/use-web3'
import useProxy from '../web3/use-proxy'
import useContracts from '../web3/use-contracts'
import useSettings from '../settings/use-settings'

import {
  CoinGeckoIdMapping,
  AddressMapping,
  DecimalMapping,
  Assets,
} from '../../utils/constants'
import { useToasts } from '@zeit-ui/react'

const sortByName = ((a, b) => {
  const [aL, bL] = [a.label, b.label].map((x) => x.toLowerCase())
  if (aL < bL) return -1
  if (bL < aL) return 1
  return 0
})

export interface Balance {
  label: string
  address: string
  balance: string
  decimals: number
  price: string // in nominated currency
  value: string // amount * price
}

const initialBalances: Balance[] = Object.keys(Assets).map((k) => {
  const v = Assets[k]
  return {
    label: v,
    address: AddressMapping[v],
    balance: '0.00',
    decimals: DecimalMapping[v],
    price: '0.00',
    value: '0.00',
  }
}).sort(sortByName)

function useBalances() {
  const [, setToasts] = useToasts()
  const { signer, provider } = useWeb3.useContainer()
  const { proxyAddress } = useProxy.useContainer()
  const { contracts } = useContracts.useContainer()
  const { settings } = useSettings.useContainer()
  const { IERC20 } = contracts
  const { currency } = settings

  const [isRetrievingBal, setIsRetrievingBal] = useState(false)
  const [balances, setBalances] = useState(initialBalances)

  const getBalanceOf = async ({ token, address }) => {
    if (token === AddressMapping[Assets.ETH]) {
      return provider.getBalance(address)
    }

    return IERC20.attach(token).balanceOf(address)
  }

  const getDecimalsOf = async ({ token }) => {
    if (token === AddressMapping[Assets.ETH]) {
      return 18
    }

    return IERC20.attach(token).decimals()
  }

  const tryGetAddressAndDecimal = async (assetNameOrTokenAddress) => {
    let tokenAddress = AddressMapping[assetNameOrTokenAddress]
    let decimals = DecimalMapping[assetNameOrTokenAddress]

    if (!tokenAddress && ethers.utils.isAddress(assetNameOrTokenAddress)) {
      tokenAddress = assetNameOrTokenAddress
      decimals = await getDecimalsOf(tokenAddress)
    }

    if (!tokenAddress || !decimals) {
      setToasts({
        text: `Unable to retrieve token information for ${assetNameOrTokenAddress}!`,
        type: 'error',
      })
      return {
        tokenAddress: null,
        decimals: null,
      }
    }

    return {
      tokenAddress,
      decimals,
    }
  }

  const getBalances = async () => {
    if (provider === null) return;
    if (proxyAddress === ethers.constants.AddressZero) return

    setIsRetrievingBal(true)

    // Query blockchain
    const newBalances = await Promise.all(
      initialBalances.map(async (x) => {
        let balance
        if (x.label === Assets.ETH) {
          balance = await provider.getBalance(proxyAddress)
        } else {
          balance = await IERC20.attach(x.address).balanceOf(proxyAddress)
        }
        return {
          ...x,
          balance: parseFloat(
            ethers.utils.formatUnits(balance, x.decimals)
          ).toFixed(2),
        }
      })
    )

    const newBalancesSorted = newBalances.sort(sortByName)

    // Query Coingecko
    const coingeckoAssetIds = newBalancesSorted
      .map((x) => x.label)
      .map((x) => CoinGeckoIdMapping[x])

    const coingeckoQueryUrl = encodeURI(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoAssetIds.join(
        ','
      )}&vs_currencies=${currency}`
    )

    const coingeckoResp = await fetch(coingeckoQueryUrl)
    const coingeckoJson = await coingeckoResp.json()

    const newBalancesWithPrices = newBalancesSorted.map((b) => {
      const coingeckoId = CoinGeckoIdMapping[b.label]
      const price = (coingeckoJson[coingeckoId][currency]).toFixed(2)
      const value = parseFloat(b.balance) * price

      return {
        ...b,
        price,
        value: parseFloat(isNaN(value) ? '0' : value.toString()).toFixed(2),
      }
    })

    setBalances(newBalancesWithPrices)
    setIsRetrievingBal(false)
  }

  useEffect(() => {
    if (signer === null) return
    if (
      proxyAddress === null ||
      proxyAddress === ethers.constants.AddressZero
    ) {
      setBalances(initialBalances)
      return
    }

    getBalances()
  }, [proxyAddress, currency])

  const balancesLoading = balances.map((x) => {
    return {
      ...x,
      balance: '...',
      price: '...',
      value: '...',
    }
  })

  return {
    balances: isRetrievingBal ? balancesLoading : balances,
    isRetrievingBal,
    getBalances,
    getDecimalsOf,
    getBalanceOf,
    tryGetAddressAndDecimal
  }
}

export default createContainer(useBalances)
