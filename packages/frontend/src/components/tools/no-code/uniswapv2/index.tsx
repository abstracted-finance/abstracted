import { Text } from '@zeit-ui/react'

import { AssetOptionsAutoComplete } from '../../../../utils/constants'
import { randomId } from '../../../../utils/common'
import useLego, { LegoType } from '../../../../containers/legos/use-legos'

import { MButton } from '../../../buttons'

export default ({ setVisible }) => {
  const { appendLego } = useLego.useContainer()

  const addUniswapV2SwapExactInToOutComponent = () => {
    appendLego({
      id: randomId(),
      type: LegoType.UniswapV2SwapExactInToOut,
      args: [
        {
          from: AssetOptionsAutoComplete[0].value,
          to: AssetOptionsAutoComplete[1].value,
          amountIn: '',
          amountMinOut: '',
        },
      ],
    })
    setVisible(false)
  }

  return (
    <>
      <Text h3>Uniswap V2</Text>
      <MButton
        onClick={addUniswapV2SwapExactInToOutComponent}
        auto
        type="secondary"
      >
        Swap Tokens
      </MButton>
    </>
  )
}
