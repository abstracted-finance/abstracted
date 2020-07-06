import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  useToasts,
  Button,
  Row,
  Col,
  Spacer,
  Note,
  Text,
  useModal,
} from '@zeit-ui/react'

import CompoundSupply from './compound/supply'
import CompoundWithdraw from './compound/withdraw'
import CompoundBorrow from './compound/borrow'
import CompoundRepay from './compound/repay'

import AaveFlashloanStart from './aave/flashloan-start'
import AaveFlashloanEnd from './aave/flashloan-end'

import AddLegoPage from './add-lego'
import GenericLego from './generic-lego'

import ImportModal from './modal-import'
import ExportModal from './modal-export'

import {
  Lego,
  LegoType,
  default as useLego,
} from '../../../containers/legos/use-legos'
import useProxy from '../../../containers/web3/use-proxy'

import { parseLegos } from '../../../utils/legos'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export default () => {
  const [, setToast] = useToasts()
  const { legos, setLegos } = useLego.useContainer()
  const { hasProxy, proxy, proxyAddress } = useProxy.useContainer()

  const {
    visible: importModalVisible,
    setVisible: setImportModalVisible,
    bindings: importModalBindings,
  } = useModal()
  const {
    visible: exportModalVisible,
    setVisible: setExportModalVisible,
    bindings: exportModalBindings,
  } = useModal()
  const [addPageVisible, setAddPageVisible] = useState(false)

  const onDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return
    }

    const curLego = legos[result.source.index]

    // Flashloan start cannot be after flashloan end
    if (curLego.id.startsWith('flashloan-start')) {
      const flashloanEndId = `flashloan-end-${curLego.id.replace(
        'flashloan-start-',
        ''
      )}`

      const flashloanEndIndex = legos.findIndex((x) => x.id === flashloanEndId)

      if (result.destination.index >= flashloanEndIndex) {
        setToast({
          text: 'Flashloan start cannot be after flashloan end',
          type: 'error',
        })
        return
      }
    }

    // Flashloan end cannot be before flashloan start
    if (curLego.id.startsWith('flashloan-end')) {
      const flashloanStartId = `flashloan-start-${curLego.id.replace(
        'flashloan-end-',
        ''
      )}`

      const flashloanStartIndex = legos.findIndex(
        (x) => x.id === flashloanStartId
      )

      if (result.destination.index <= flashloanStartIndex) {
        setToast({
          text: 'Flashloan end cannot be before flashloan start',
          type: 'error',
        })
        return
      }
    }

    const newItems = reorder(
      legos,
      result.source.index,
      result.destination.index
    )

    setLegos(newItems)
  }

  const LegoComponentMapping = {
    [LegoType.CompoundBorrow]: <CompoundBorrow />,
    [LegoType.CompoundRepay]: <CompoundRepay />,
    [LegoType.CompoundSupply]: <CompoundSupply />,
    [LegoType.CompoundWithdraw]: <CompoundWithdraw />,
    [LegoType.AaveFlashloanStart]: <AaveFlashloanStart />,
    [LegoType.AaveFlashloanEnd]: <AaveFlashloanEnd />,
  }

  const getLegoComponent = (lego: Lego) => {
    const lc = LegoComponentMapping[lego.type] || (
      <GenericLego
        tagText="Unknown config"
        title="Unknown"
        secondaryDisplay={<></>}
        primaryDisplay={<></>}
        isLoading={false}
        lego={{}}
      />
    )
    return React.cloneElement(lc, { lego })
  }

  return (
    <>
      <Text h3>No Code</Text>
      <Text type="secondary" size={14}>
        Build and share DeFi combinations!
      </Text>
      <Spacer y={1} />

      <Row gap={0.8}>
        <Col span={12}>
          <Button
            disabled={!hasProxy}
            onClick={() => setImportModalVisible(true)}
            type="secondary"
            auto
            style={{ width: '100%' }}
          >
            Import
          </Button>
        </Col>
        <Col span={12}>
          <Button
            disabled={!hasProxy}
            onClick={() => setExportModalVisible(true)}
            type="secondary"
            auto
            style={{ width: '100%' }}
          >
            Export
          </Button>
        </Col>
      </Row>
      <Spacer y={1} />

      {legos.length === 0 ? (
        <Note label={false}>Click on the add button below to get started!</Note>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {legos.map((lego, index) => (
                  <Draggable key={lego.id} draggableId={lego.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        // snapshot.isDragging to get isDragging
                        style={{
                          // some basic styles to make the items look a bit nicer
                          userSelect: 'none',
                          margin: '0 0 8px 0',

                          // styles we need to apply on draggables
                          ...provided.draggableProps.style,
                        }}
                      >
                        {getLegoComponent(lego)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Spacer y={1} />
      <Button
        onClick={() => setAddPageVisible(true)}
        disabled={!hasProxy}
        style={{ width: '100%' }}
        type="secondary"
      >
        Add
      </Button>
      <Spacer y={1} />
      <Button
        disabled={!hasProxy}
        onClick={async () => {
          const parseResults = parseLegos({
            legos,
            userProxy: proxyAddress,
          })

          if (!parseResults.valid) {
            setToast({
              text:
                'Invalid lego configuration (likely flashloan overlapping one another)',
              type: 'error',
            })
            return
          }

          const targets = parseResults.serialized.map((x) => x.target)
          const data = parseResults.serialized.map((x) => x.data)
          const msgValues = parseResults.serialized.map((x) => x.msgValue)

          try {
            const tx = await proxy.executes(targets, data, msgValues, {
              gasLimit: 6000000,
            })
            await tx.wait()
            setToast({
              text: 'Transaction successful',
              type: 'success',
            })
          } catch (e) {
            setToast({
              text: 'Transaction failed',
              type: 'error',
            })
          }
        }}
        style={{ width: '100%' }}
        type="secondary"
      >
        Execute
      </Button>

      <AddLegoPage visible={addPageVisible} setVisible={setAddPageVisible} />
      <ImportModal
        disabled={!hasProxy}
        setVisible={setImportModalVisible}
        {...importModalBindings}
      />
      <ExportModal
        disabled={!hasProxy}
        setVisible={setExportModalVisible}
        {...exportModalBindings}
      />
    </>
  )
}
