import { Button } from "@zeit-ui/react";

import useWeb3 from "../../containers/web3/useWeb3";
import useProxy from "../../containers/web3/useProxy";

export default () => {
  const { signer, ethAddress } = useWeb3.useContainer();
  const { createProxy, hasProxy } = useProxy.useContainer();

  return (
    <>
      {signer !== null && !hasProxy ? (
        <Button onClick={createProxy}>Create smart wallet</Button>
      ) : (
        <>{ethAddress}</>
      )}
    </>
  );
};
