import { createContainer } from 'unstated-next'
import { useState, useEffect } from 'react'
import { useToasts } from '@zeit-ui/react'
import { ethers } from 'ethers'

import {
  CoinGeckoIdMapping,
  CompoundCAssets,
  AddressMapping,
  CTokenReverseMapping,
  CoinGeckoSupportedCurrencies,
  Assets,
  DecimalMapping,
} from '../../utils/constants'

import useSettings from '../settings/use-settings'
import useProxy from '../web3/use-proxy'
import useContracts from '../web3/use-contracts'

interface CompoundBalance {
  label: string
  borrowed: string
  supplied: string
  borrowedInCurrency: string
  suppliedInCurrency: string
}

const sortByLabel = (a, b) => {
  const [aL, bL] = [a.label, b.label].map((x) => x.toLowerCase())
  if (aL < bL) return -1
  if (bL < aL) return 1
  return 0
}

const initialCompoundBalance = Object.keys(CompoundCAssets)
  .map((k) => {
    return {
      label: CTokenReverseMapping[CompoundCAssets[k]],
      borrowed: '0.00',
      supplied: '0.00',
      borrowedInCurrency: '0.00',
      suppliedInCurrency: '0.00',
    }
  })
  .sort(sortByLabel)

function useCompoundBalances() {
  const [, setToast] = useToasts()
  const { contracts } = useContracts.useContainer()
  const { ICToken } = contracts
  const { settings } = useSettings.useContainer()
  const { currency } = settings
  const { proxyAddress } = useProxy.useContainer()

  const [isGettingCompoundBal, setIsGettingCompoundBal] = useState(false)
  const [compoundBalances, setCompoundBalances] = useState<CompoundBalance[]>(
    initialCompoundBalance
  )

  const getCompoundBalances = async () => {
    setIsGettingCompoundBal(true)

    const expScale = ethers.BigNumber.from(10).pow(18)

    // Get all account snapshots via cToken
    // then fix the balance of underlying with expScale
    // and exchangeRate mantissa

    // Also make the coingeckoId the key, to easily match
    // up the eth/ctoken eth/currency pricing pair
    const compoundCollateralAndDebt = (
      await Promise.all(
        Object.keys(CompoundCAssets).map(async (cToken) => {
          const cTokenAddress = AddressMapping[CompoundCAssets[cToken]]
          const [
            err,
            cTokenBalance,
            borrowBalance,
            exchangeRateMantissa,
          ] = await ICToken.attach(cTokenAddress).getAccountSnapshot(
            proxyAddress
          )

          if (err.toString() !== '0') {
            throw new Error(
              `Error on getAccountSnapshot: ${err}, go to https://compound.finance/docs/ctokens#ctoken-error-codes for more info`
            )
          }

          // balanceOfUnderlying and borrowBalance is w.r.t ETH
          // So we need to multiply it by ETH price and ETH price w.r.t currency
          const balanceOfUnderlying = cTokenBalance
            .mul(exchangeRateMantissa)
            .div(expScale)
          const asset = CTokenReverseMapping[cToken]
          const decimals = DecimalMapping[asset]
          return {
            [CoinGeckoIdMapping[asset]]: {
              asset,
              balanceOfUnderlying: ethers.utils.formatUnits(
                balanceOfUnderlying,
                decimals
              ),
              borrowBalance: ethers.utils.formatUnits(borrowBalance, decimals),
            },
          }
        })
      )
    ).reduce((acc, x) => {
      return { ...acc, ...x }
    }, {})

    // Query coingecko for CToken/ETH price
    const coingeckoAssetIds = Object.keys(CompoundCAssets)
      .map((k) => CTokenReverseMapping[CompoundCAssets[k]])
      .map((x) => CoinGeckoIdMapping[x])
    const coingeckoQueryUrl = encodeURI(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoAssetIds.join(
        ','
      )}&vs_currencies=${currency}`
    )
    const coingeckoResp = await fetch(coingeckoQueryUrl)
    const coingeckoJson = await coingeckoResp.json()

    // Convert debts to relevant curerncy pricing
    const compoundCollateralAndDebtNormalized = Object.keys(
      compoundCollateralAndDebt
    )
      .map((coingeckoId) => {
        // balanceOfUnderlying is supply (of the underlying)
        // as we're querying cToken

        // borrowBalance is the borrowed Balance
        const {
          asset,
          balanceOfUnderlying,
          borrowBalance,
        } = compoundCollateralAndDebt[coingeckoId]

        const assetInCurrencyPrice = coingeckoJson[coingeckoId][currency]

        const borrowed = parseFloat(borrowBalance.toString())
        const supplied = parseFloat(balanceOfUnderlying.toString())

        const borrowedInCurrency = borrowed * assetInCurrencyPrice
        const suppliedInCurrency = supplied * assetInCurrencyPrice

        return {
          label: asset,
          borrowed: borrowed.toFixed(2).toString(),
          supplied: supplied.toFixed(2).toString(),
          borrowedInCurrency: borrowedInCurrency.toFixed(2).toString(),
          suppliedInCurrency: suppliedInCurrency.toFixed(2).toString(),
        }
      })
      .sort(sortByLabel)

    setCompoundBalances(compoundCollateralAndDebtNormalized)
    setIsGettingCompoundBal(false)
  }

  useEffect(() => {
    if (!proxyAddress) return
    if (proxyAddress === ethers.constants.AddressZero) return

    getCompoundBalances().catch(() => {
      setToast({
        text: 'Failed to fetch compound balances',
        type: 'error',
      })
      setIsGettingCompoundBal(false)
    })
  }, [proxyAddress])

  const compoundBalancesLoading = compoundBalances.map((x) => {
    return {
      ...x,
      supplied: '...',
      borrowed: '...',
      suppliedInCurrency: '...',
      borrowedInCurrency: '...',
    }
  })

  return {
    getCompoundBalances,
    compoundBalances: isGettingCompoundBal
      ? compoundBalancesLoading
      : compoundBalances,
  }
}

export default createContainer(useCompoundBalances)
