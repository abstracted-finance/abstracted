import {
  Text,
  Card,
  AutoComplete,
  Input,
  Spacer,
  Link,
  useToasts,
} from '@zeit-ui/react'
import { useState } from 'react'
import QRCode from 'qrcode.react'
import { ethers } from 'ethers'

import { AssetOptionsAutoComplete } from '../../utils/constants'

import { FullWidthButton } from '../buttons'
import useProxy from '../../containers/web3/use-proxy'
import useBalances from '../../containers/balances/use-balances'
import useWithdraw from '../../containers/balances/use-withdraw'

export default () => {
  const [withdrawToken, setWithdrawToken] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const { hasProxy, proxyAddress } = useProxy.useContainer()
  const { tryGetAddressAndDecimal, getBalanceOf } = useBalances.useContainer()
  const { withdraw, isWithdrawing } = useWithdraw.useContainer()
  const [, setToasts] = useToasts()

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
    <>
      <Text h3>Transfer</Text>
      <Text size={14} type="secondary">
        Manage tokens in your smart wallet account here.
      </Text>

      <Card>
        <Text h5>Withdraw</Text>
        <Link
          color
          onClick={(e) => {
            e.preventDefault()
            maxHandler()
          }}
        >
          Max
        </Link>
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

      <Spacer y={1} />

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
    </>
  )
}
