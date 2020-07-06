import { Modal, Spacer } from '@zeit-ui/react'

import AaveComponents from './aave'
import CompoundComponents from './compound'
import UniswapV2Components from './uniswapv2'

export default (props) => {
  const { setVisible } = props

  return (
    <Modal width="40rem" {...props}>
      <Modal.Title>Add Component</Modal.Title>
      <Modal.Content>
        <AaveComponents setVisible={setVisible} />
        <Spacer y={1} />
        <CompoundComponents setVisible={setVisible} />
        <Spacer y={1} />
        <UniswapV2Components setVisible={setVisible} />
      </Modal.Content>
      <Modal.Action passive onClick={() => setVisible(false)}>
        Close
      </Modal.Action>
    </Modal>
  )
}
