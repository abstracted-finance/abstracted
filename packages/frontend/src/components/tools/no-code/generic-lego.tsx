import { useState } from 'react'
import { Card, Tag, Text, Spacer, Row, Col, Spinner } from '@zeit-ui/react'
import { XIcon, ChevronUpIcon, ChevronDownIcon } from '../../icons'
import useLego from '../../../containers/legos/use-legos'

export default ({
  tagText,
  title,
  secondaryDisplay,
  primaryDisplay,
  isLoading,
  lego,
}) => {
  const { legos, setLegos, removeLego } = useLego.useContainer()
  const [showSettings, setShowSettings] = useState(true)

  return (
    <Card width="100%">
      <Row justify="center" align="middle">
        <Col span={20}>
          <Tag type="default" invert>
            {tagText}
          </Tag>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Text size="1.5rem" b>
            {title}
          </Text>
        </Col>
        <Col span={3}>{isLoading ? <Spinner /> : null}</Col>
        <Col span={1}>
          <div style={{ float: 'right' }}>
            <XIcon
              onClick={() => {
                // Remove start and end of flashloan
                if (lego.id.startsWith('flashloan')) {
                  const id = lego.id.split('-').slice(-1)[0]
                  setLegos(legos.filter((x) => !x.id.includes(id)))
                } else {
                  removeLego(lego)
                }
              }}
              size={18}
            />
          </div>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col span={23}>
          <Spacer y={1} />
          {!showSettings ? secondaryDisplay : null}
        </Col>
        <Col span={1}>
          <div style={{ float: 'right', marginTop: '15px' }}>
            {showSettings ? (
              <ChevronUpIcon onClick={() => setShowSettings(!showSettings)} />
            ) : (
              <ChevronDownIcon onClick={() => setShowSettings(!showSettings)} />
            )}
          </div>
        </Col>
      </Row>

      {showSettings ? primaryDisplay : null}
    </Card>
  )
}
