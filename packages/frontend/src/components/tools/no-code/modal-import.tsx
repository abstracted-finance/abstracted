import { useToasts, Modal, Textarea } from '@zeit-ui/react'

import useLegos from '../../../containers/legos/use-legos'
import { useState } from 'react'

export default (props) => {
  const { setVisible } = props
  const [, setToasts] = useToasts()
  const { setLegos } = useLegos.useContainer()
  const [legoConfig, setLegoConfig] = useState('')

  const importLegoConfig = () => {
    let legoJsonConfig
    try {
      legoJsonConfig = JSON.parse(legoConfig)
    } catch (e) {
      setVisible(false)
      setToasts({
        text: 'Failed to parse config',
        type: 'error',
      })
      return
    }
    setLegos(legoJsonConfig)
    setVisible(false)
    setToasts({
      text: 'Successfully loaded lego config',
      type: 'success',
    })
  }

  return (
    <Modal width="40rem" {...props}>
      <Modal.Title>Import Lego Configuration</Modal.Title>
      <Modal.Content>
        <Textarea
          value={legoConfig}
          onChange={(e) => setLegoConfig(e.target.value)}
          minHeight="200px"
          width="100%"
          placeholder="Legos configuration"
        />
      </Modal.Content>
      <Modal.Action passive onClick={() => setVisible(false)}>
        Close
      </Modal.Action>
      <Modal.Action onClick={importLegoConfig}>Import</Modal.Action>
    </Modal>
  )
}
