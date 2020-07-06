import { createContainer } from 'unstated-next'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { useToasts } from '@zeit-ui/react'

import useProxy from '../web3/use-proxy'
import useContract from '../web3/use-contracts'

import {
  CompoundCAssets,
  CompoundAddresses,
  AddressMapping,
} from '../../utils/constants'

function useCompoundEntered() {
  const [, setToast] = useToasts()
  const { proxy, proxyAddress } = useProxy.useContainer()
  const { contracts } = useContract.useContainer()
  const { IComptroller, CompoundActions } = contracts

  const [isCheckingCompoundEntered, setCheckingCompoundEntered] = useState(
    false
  )
  const [isEnteringCompoundMarkets, setIsEnteringCompoundMarkets] = useState(
    false
  )
  const [isCompoundEntered, setIsCompoundEntered] = useState(false)

  const checkCompoundMarketsEntered = async () => {
    setCheckingCompoundEntered(true)
    const marketsEntered = await IComptroller.getAssetsIn(proxyAddress)

    if (marketsEntered.length !== Object.keys(CompoundCAssets).length) {
      setIsCompoundEntered(false)
    } else {
      setIsCompoundEntered(true)
    }
    setCheckingCompoundEntered(false)
  }

  const enterCompoundMarkets = async () => {
    setIsEnteringCompoundMarkets(true)

    const cTokenAddresses = Object.keys(CompoundCAssets).map(
      (k) => AddressMapping[k]
    )
    const calldata = CompoundActions.interface.encodeFunctionData(
      'enterMarkets',
      [CompoundAddresses.Comptroller, cTokenAddresses]
    )

    try {
      const tx = await proxy.execute(CompoundActions.address, calldata, {
        gasLimit: 400000,
      })
      await tx.wait()
      setToast({
        text: 'Compound markets entered!',
        type: 'success',
      })
      setIsCompoundEntered(true)
    } catch (e) {
      setToast({
        text: 'Failed to enter compound markets!',
        type: 'error',
      })
    }
    setIsEnteringCompoundMarkets(false)
  }

  useEffect(() => {
    if (proxyAddress === null) return
    if (proxyAddress === ethers.constants.AddressZero) return

    checkCompoundMarketsEntered()
  }, [proxyAddress])

  return {
    isCompoundEntered,
    isCheckingCompoundEntered,
    enterCompoundMarkets,
    isEnteringCompoundMarkets,
  }
}

export default createContainer(useCompoundEntered)
