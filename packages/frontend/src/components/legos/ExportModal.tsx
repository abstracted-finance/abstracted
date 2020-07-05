import { Modal, Textarea, useClipboard, useToasts } from "@zeit-ui/react";

import useLegos from "../../containers/legos/use-legos";

export default (props) => {
  const [, setToasts] = useToasts();
  const { copy } = useClipboard();
  const { legos } = useLegos.useContainer();

  const legoConfig = JSON.stringify(legos, null, 4);

  return (
    <Modal width="40rem" {...props}>
      <Modal.Title>Import Lego Configuration</Modal.Title>
      <Modal.Content>
        <Textarea
          value={legoConfig}
          onChange={() => {}}
          minHeight="200px"
          width="100%"
          placeholder="Legos configuration"
        />
      </Modal.Content>
      <Modal.Action
        onClick={() => {
          copy(legoConfig);
          setToasts({
            text: "Lego configuration copied!",
          });
        }}
      >
        Copy
      </Modal.Action>
    </Modal>
  );
};
