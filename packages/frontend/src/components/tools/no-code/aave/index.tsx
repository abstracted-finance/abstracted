import { Text } from '@zeit-ui/react'

import { AaveAssetsOptionsAutoComplete } from '../../../../utils/constants'
import { randomId } from '../../../../utils/common'
import useLego, { LegoType } from '../../../../containers/legos/use-legos'

import { MButton } from '../../../buttons'

export default ({ setVisible }) => {
  const { appendLegos } = useLego.useContainer()

  const addAaveFlashLoanComponent = () => {
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
  }

  return (
    <>
      <Text h3>Aave</Text>
      <MButton onClick={addAaveFlashLoanComponent} auto type="secondary">
        Flashloan
      </MButton>
    </>
  )
}
