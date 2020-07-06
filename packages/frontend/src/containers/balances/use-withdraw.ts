import { createContainer } from 'unstated-next'
import { useState } from 'react'
import { useToasts } from '@zeit-ui/react'

import useWeb3 from '../web3/use-web3'
import useProxy from '../web3/use-proxy'
import useContracts from '../web3/use-contracts'

function useWithdraw() {
  const [, setToast] = useToasts()
  const { ethAddress } = useWeb3.useContainer()
  const { contracts } = useContracts.useContainer()
  const { proxy } = useProxy.useContainer()

  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const withdraw = async ({ tokenAddress, amountWei }) => {
    const { TokenActions } = contracts

    setIsWithdrawing(true)

    try {
      const calldata = TokenActions.interface.encodeFunctionData('transfer', [
        ethAddress,
        tokenAddress,
        amountWei,
      ])
      const tx = await proxy.execute(TokenActions.address, calldata, {
        gasLimit: 300000,
      })
      await tx.wait()

      setToast({
        text: 'Withdraw successful',
        type: 'success',
      })
    } catch (e) {
      setToast({
        text: 'Failed to withdraw',
        type: 'error',
      })
    }

    setIsWithdrawing(false)
  }

  return {
    withdraw,
    isWithdrawing,
  }
}

export default createContainer(useWithdraw)
