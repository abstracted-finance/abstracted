import {
  useTheme,
  Page,
  Text,
  Button,
  Spacer,
  Toggle,
  Spinner,
  Link,
  Loading,
  Row,
} from '@zeit-ui/react'

import { randomId } from '../../../utils/common'
import { LegoType, default as useLego } from '../../../containers/legos/use-legos'
import styled from 'styled-components'

import {
  AaveAssetsOptionsAutoComplete,
  CompoundAssetsOptionsAutoComplete,
} from '../../../utils/constants'

import useCompoundEntered from '../../../containers/compound/use-compound-entered'

const MButton = styled(Button)`
  margin: 2.5px;
`

export default ({ visible, setVisible }) => {
  const theme = useTheme()
  const { appendLego, appendLegos } = useLego.useContainer()

  const {
    isCompoundEntered,
    enterCompoundMarkets,
    isCheckingCompoundEntered,
    isEnteringCompoundMarkets,
  } = useCompoundEntered.useContainer()

  const addToCompoundLego = (l: LegoType) => {
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

  return (
    <section className={visible ? 'active' : ''}>
      <Page size="large">
        <div style={{ float: 'right', margin: '-25px 10px 0 0' }}>
          <Button
            onClick={() => {
              setVisible(false)
            }}
            auto
            type="secondary"
            ghost
          >
            Close
          </Button>
        </div>

        <Text h2>
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

        <MButton
          onClick={() => addToCompoundLego(LegoType.CompoundSupply)}
          auto
          type="secondary"
          disabled={!isCompoundEntered}
        >
          Supply
        </MButton>
        <MButton
          onClick={() => addToCompoundLego(LegoType.CompoundWithdraw)}
          auto
          type="secondary"
          disabled={!isCompoundEntered}
        >
          Withdraw
        </MButton>
        <MButton
          onClick={() => addToCompoundLego(LegoType.CompoundBorrow)}
          auto
          type="secondary"
          disabled={!isCompoundEntered}
        >
          Borrow
        </MButton>
        <MButton
          onClick={() => addToCompoundLego(LegoType.CompoundRepay)}
          auto
          type="secondary"
          disabled={!isCompoundEntered}
        >
          Repay
        </MButton>

        <Spacer y={1} />

        <Text h2>Aave</Text>
        <MButton
          onClick={() => {
            const id = randomId()
            appendLegos([
              {
                id: `flashloan-start-${id}`,
                type: LegoType.AaveFlashloanStart,
                args: [
                  {
                    asset: AaveAssetsOptionsAutoComplete[0].value,
                    amount: '0',
                  },
                ],
              },
              {
                id: `flashloan-end-${id}`,
                type: LegoType.AaveFlashloanEnd,
                args: [
                  {
                    asset: AaveAssetsOptionsAutoComplete[0].value,
                    amount: '0',
                  },
                ],
              },
            ])
            setVisible(false)
          }}
          auto
          type="secondary"
        >
          Flashloan
        </MButton>
      </Page>
      <style jsx>{`
        section {
          position: fixed;
          width: 100vw;
          height: 100vh;
          background-color: ${theme.palette.background};
          z-index: 5000;
          top: -5000px;
          left: -5000px;
          display: none;
          opacity: 0.98;
        }
        .active {
          top: 0;
          left: 0;
          bottom: 0;
          display: block;
        }
      `}</style>
    </section>
  )
}
