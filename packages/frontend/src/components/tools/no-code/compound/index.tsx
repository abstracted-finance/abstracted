import { Text, Spinner, Toggle, Link, Row, Loading } from '@zeit-ui/react'

import { CompoundAssetsOptionsAutoComplete } from '../../../../utils/constants'
import { randomId } from '../../../../utils/common'
import useLego, { LegoType } from '../../../../containers/legos/use-legos'

import { MButton } from '../../../buttons'
import useCompoundEntered from '../../../../containers/compound/use-compound-entered'

export default ({ setVisible }) => {
  const {
    isCompoundEntered,
    enterCompoundMarkets,
    isCheckingCompoundEntered,
    isEnteringCompoundMarkets,
  } = useCompoundEntered.useContainer()

  const { appendLego } = useLego.useContainer()

  const addCompoundComponent = (l: LegoType) => {
    appendLego({
      id: randomId(),
      type: l,
      args: [
        {
          asset: CompoundAssetsOptionsAutoComplete[0].value,
          amount: '0',
        },
      ],
    })
    setVisible(false)
  }

  const compoundComponents = [
    {
      label: 'Supply',
      onClick: () => addCompoundComponent(LegoType.CompoundSupply),
    },
    {
      label: 'Withdraw',
      onClick: () => addCompoundComponent(LegoType.CompoundWithdraw),
    },
    {
      label: 'Borrow',
      onClick: () => addCompoundComponent(LegoType.CompoundBorrow),
    },
    {
      label: 'Repay',
      onClick: () => addCompoundComponent(LegoType.CompoundRepay),
    },
  ]

  return (
    <>
      <Text h3>
        Compound&nbsp;&nbsp;
        {isCheckingCompoundEntered ? (
          <Spinner style={{ display: 'inline-block' }} />
        ) : null}
        {!isCheckingCompoundEntered && !isCompoundEntered ? (
          <Toggle
            checked={isCompoundEntered}
            disabled={isEnteringCompoundMarkets}
            onChange={(e) => {
              // Enter markets
              if (e.target.checked) {
                enterCompoundMarkets()
              }
            }}
            size="large"
          />
        ) : null}
      </Text>

      {!isEnteringCompoundMarkets &&
      !isCheckingCompoundEntered &&
      !isCompoundEntered ? (
        <Text type="secondary">
          You need to{' '}
          <Link
            color
            onClick={(e) => {
              e.preventDefault()
              enterCompoundMarkets()
            }}
            href="#"
          >
            enable
          </Link>{' '}
          Compound before you can use these lego pieces
        </Text>
      ) : null}
      {isEnteringCompoundMarkets ? (
        <Row style={{ padding: '10px 0', width: '50px' }}>
          <Loading />
        </Row>
      ) : null}

      {compoundComponents.map(({ label, onClick }) => {
        return (
          <MButton
            onClick={onClick}
            auto
            type="secondary"
            disabled={!isCompoundEntered}
          >
            {label}
          </MButton>
        )
      })}
    </>
  )
}
