import {
  Checkbox,
  Table,
  Text,
  Spacer,
  Tooltip,
  useTheme,
} from '@zeit-ui/react'
import RefreshIcon from '@zeit-ui/react-icons/refreshCcw'

import useProxy from '../../containers/web3/use-proxy'
import useSettings from '../../containers/settings/use-settings'
import useBalances from '../../containers/balances/use-balances'

import useLocalStorageState from 'use-local-storage-state'

export default () => {
  const theme = useTheme()

  const { hasProxy, proxyAddress } = useProxy.useContainer()
  const { getBalances, balances } = useBalances.useContainer()
  const { settings } = useSettings.useContainer()
  const currency = settings.currency.toUpperCase()

  const [showZeroBal, setShowZeroBal] = useLocalStorageState<boolean>(
    'showZeroBal',
    false
  )

  const filteredBal = showZeroBal
    ? balances
    : balances.filter((x) => {
        const f = parseFloat(x.balance)
        return f !== 0 && !isNaN(f)
      })

  const totalValue = filteredBal.reduce((acc, x) => {
    const value = parseFloat(x.value)
    return acc + (isNaN(value) ? 0 : value)
  }, 0)

  return (
    <>
      <Text h3>Overview</Text>
      <div className="overview-summary">
        <span>Smart Wallet Address: {hasProxy ? proxyAddress : 'Not found'}</span>
        <Spacer y={0.33} />
        <span>
          Total Value: {totalValue} {currency}
        </span>
      </div>
      <Spacer y={1} />
      <nav>
        <div></div>
        <div className="table-options">
          <Checkbox
            checked={showZeroBal}
            onChange={(e) => setShowZeroBal(e.target.checked)}
            size="small"
          >
            Show zero balances
          </Checkbox>
          <Spacer x={1} />
          <Tooltip text={'Refresh balance'}>
            <span className="span-refresh-icon" onClick={getBalances}>
              <RefreshIcon size={14} />
            </span>
          </Tooltip>
        </div>
      </nav>

      <Spacer y={0.5} />
      <div className="table-display">
        <Table data={filteredBal}>
          <Table.Column prop="label" label="Asset" />
          <Table.Column prop="price" label={`Price (${currency})`} />
          <Table.Column prop="balance" label="Balance" />
          <Table.Column prop="value" label="Value" />
        </Table>
      </div>

      <style jsx>{`
        .overview-summary {
          font-size: 0.9rem;
          color: ${theme.palette.accents_7};
        }

        .table-display {
          overflow-x: auto;
        }

        .table-options {
          display: flex;
          align-items: center;
        }

        .span-refresh-icon {
          cursor: pointer;
        }

        nav {
          display: flex;
          justify-content: space-between;
          max-width: 100%;
          margin: 0 auto;
          height: 30px;
        }
      `}</style>
    </>
  )
}
