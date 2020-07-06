import {
  Table,
  Text,
  Spacer,
  Progress,
  useTheme,
  Tooltip,
} from '@zeit-ui/react'
import RefreshIcon from '@zeit-ui/react-icons/refreshCcw'

import useSettings from '../../containers/settings/use-settings'
import useCompoundBalances from '../../containers/balances/use-compound-bals'

export default () => {
  const theme = useTheme()

  const { settings } = useSettings.useContainer()
  const currency = settings.currency.toUpperCase()
  const {
    getCompoundBalances,
    compoundBalances,
  } = useCompoundBalances.useContainer()

  const addViaKey = (k) => (acc, x) => {
    const value = parseFloat(x[k])
    return acc + (isNaN(value) ? 0 : value)
  }

  const totalBorrowed = compoundBalances
    .reduce(addViaKey('borrowedInCurrency'), 0)
    .toFixed(2)
    .toString()

  const totalSupplied = compoundBalances
    .reduce(addViaKey('suppliedInCurrency'), 0)
    .toFixed(2)
    .toString()

  const getProgressType = (progressPercentage) => {
    if (progressPercentage > 80) return 'error'
    if (progressPercentage > 60) return 'warning'
    return 'success'
  }

  // Max borrowed ratio is 0.75
  const borowedRatio = totalBorrowed / totalSupplied
  const borrowedPercentage = (borowedRatio / 0.75) * 100
  const progressType = getProgressType(borrowedPercentage)

  return (
    <>
      <Text h3>Compound</Text>
      <nav>
        <Text type="secondary" size={14}>
          Borrowed: {totalBorrowed} {currency}
        </Text>
        <Text type="secondary" size={14}>
          Supplied: {totalSupplied} {currency}
        </Text>
      </nav>
      <Spacer y={1.25} />
      <Progress type={progressType} value={borrowedPercentage} />
      <div className="progress-information">
        Borrowed: {isNaN(borrowedPercentage) ? '0' : borrowedPercentage.toFixed(2)}%
      </div>
      <Spacer y={1.25} />

      <nav>
        <div></div>
        <div className="table-options">
          <Spacer x={1} />
          <Tooltip text={'Refresh balance'}>
            <span className="span-refresh-icon" onClick={getCompoundBalances}>
              <RefreshIcon size={14} />
            </span>
          </Tooltip>
        </div>
      </nav>
      <Spacer y={0.33} />
      <div className="table-display">
        <Table data={compoundBalances}>
          <Table.Column prop="label" label="Asset" />
          <Table.Column prop="borrowed" label="Borrowed" />
          <Table.Column prop="supplied" label="Supplied" />
        </Table>
      </div>

      <style jsx>{`
        .progress-information {
          margin-top: 5px;
          font-size: 0.9rem;
          color: ${theme.palette.accents_7};
          text-align: center;
          width: 100%;
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
          height: 20px;
        }
      `}</style>
    </>
  )
}
