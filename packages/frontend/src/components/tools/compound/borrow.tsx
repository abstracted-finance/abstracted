import { useState, useEffect } from 'react'
import { Row, Col, Text, Input, AutoComplete, Tooltip } from '@zeit-ui/react'
import * as Icon from '@zeit-ui/react-icons'

import useLego from '../../../containers/legos/use-legos'

import GenericLego from '../no-code/generic-lego'
import { CompoundAssetsOptionsAutoComplete } from '../../../utils/constants'

import { partialSearchHandler } from '../../../utils/search'

export default (props) => {
  const legoArgs = props.lego.args[0]

  const { updateLego } = useLego.useContainer()

  const [inputAmount, setInputAmount] = useState(legoArgs.amount)
  const [selectedOption, setSelectedOption] = useState(legoArgs.asset)
  const [inputOptions, setInputOptions] = useState(
    CompoundAssetsOptionsAutoComplete
  )
  const searchHandler = partialSearchHandler(
    CompoundAssetsOptionsAutoComplete,
    setInputOptions
  )

  useEffect(() => {
    const curLego = props.lego
    updateLego({
      ...curLego,
      args: [
        {
          asset: selectedOption,
          amount: inputAmount,
        },
      ],
    })
  }, [inputAmount, selectedOption])

  const secondaryDisplay = (
    <div>
      <Text type="secondary" small>
        +{inputAmount} {selectedOption}
      </Text>
    </div>
  )

  const primaryDisplay = (
    <>
      <Row align="middle" justify="center">
        <Col span={3}>
          <Icon.LogIn />
        </Col>
        <Col span={13}>
          <Input
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0"
            width="100%"
          />
        </Col>
        <Col span={8}>
          <AutoComplete
            initialValue={selectedOption}
            width="100%"
            options={inputOptions}
            onSearch={searchHandler}
            onSelect={setSelectedOption}
          />
        </Col>
      </Row>
    </>
  )

  return (
    <GenericLego
      tagText="Borrow"
      title="Compound"
      secondaryDisplay={secondaryDisplay}
      primaryDisplay={primaryDisplay}
      {...props}
    />
  )
}
