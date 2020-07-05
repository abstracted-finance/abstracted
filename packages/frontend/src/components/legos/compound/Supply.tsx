import { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Text,
  Input,
  AutoComplete,
  Spacer,
  Tooltip,
} from '@zeit-ui/react'
import * as Icon from '@zeit-ui/react-icons'

import useLego from '../../../containers/legos/use-legos'
import { CenterFlexDiv } from '../../common/Divs'
import GenericLego from '../GenericLego'
import { CompoundInputOptions } from './InputOptions'

import { partialSearchHandler } from '../../../utils/search'

export default (props) => {
  const legoArgs = props.lego.args[0]

  const { updateLego } = useLego.useContainer()

  // Value of asset
  const [inputAmount, setInputAmount] = useState(legoArgs.amount)

  // Asset type
  const [selectedOption, setSelectedOption] = useState(legoArgs.asset)
  const [inputOptions, setInputOptions] = useState(CompoundInputOptions)
  const searchHandler = partialSearchHandler(
    CompoundInputOptions,
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
    <CenterFlexDiv>
      <Text type="secondary" small>
        -{inputAmount} {selectedOption}
      </Text>
      <Spacer x={1} />
    </CenterFlexDiv>
  )

  const primaryDisplay = (
    <>
      <Row align="middle" justify="center">
        <Col span={3}>
          <Icon.LogOut />
        </Col>
        <Col span={13}>
          <Input
            onChange={(e) => setInputAmount(e.target.value)}
            value={inputAmount}
            placeholder="0"
            width="100%"
          />
        </Col>
        <Col span={8}>
          <AutoComplete
            onSelect={setSelectedOption}
            initialValue={selectedOption}
            width="100%"
            options={inputOptions}
            onSearch={searchHandler}
          />
        </Col>
      </Row>
    </>
  )

  return (
    <GenericLego
      isLoading={false}
      tagText="Supply"
      title="Compound"
      secondaryDisplay={secondaryDisplay}
      primaryDisplay={primaryDisplay}
      {...props}
    />
  )
}
