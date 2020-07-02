import { Text, Button, Link, Loading } from "@zeit-ui/react";

import useWeb3 from "../../containers/web3/useWeb3";
import useProxy from "../../containers/web3/useProxy";

export default () => {
  const { connect, signer, ethAddress } = useWeb3.useContainer();
  const { isCreatingProxy, createProxy, hasProxy } = useProxy.useContainer();

  if (signer === null || ethAddress === null) {
    return (
      <Text blockquote>
        Please{" "}
        <Link
          underline
          href="#"
          onClick={(e) => {
            e.preventDefault();
            connect();
          }}
          color
        >
          connect
        </Link>{" "}
        to a wallet to continue
      </Text>
    );
  }

  if (signer !== null && ethAddress !== null && !hasProxy) {
    if (isCreatingProxy) {
      return (
        <Text blockquote>
          <Loading />
        </Text>
      );
    }

    return (
      <Text blockquote>
        Please{" "}
        <Link
          underline
          href="#"
          onClick={(e) => {
            e.preventDefault();
            createProxy();
          }}
          color
        >
          create
        </Link>{" "}
        a smart wallet to continue
      </Text>
    );
  }

  return <Text blockquote>Connected!</Text>;
};
