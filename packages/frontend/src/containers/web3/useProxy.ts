import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";
import { useToasts } from "@zeit-ui/react";

import useWeb3 from "./useWeb3";

import { getContract, network } from "../../utils/common";

function useProxy() {
  const { ethAddress, signer } = useWeb3.useContainer();

  const [, setToasts] = useToasts();
  const [isCreatingProxy, setIsCreatingProxy] = useState(false);
  const [proxy, setProxy] = useState(null);
  const [proxyFactory, setProxyFactory] = useState(null);
  const [proxyAddress, setProxyAddress] = useState(null);

  const hasProxy =
    proxyAddress &&
    proxyAddress !== "0x0000000000000000000000000000000000000000";

  // get proxy address
  const fetchProxyAddress = async () => {
    const proxyAddress = await proxyFactory.proxies(ethAddress);

    if (proxyAddress !== "0x0000000000000000000000000000000000000000") {
      setProxyAddress(proxyAddress);
      setProxy(
        getContract({
          name: "Proxy",
          network,
          address: proxyAddress,
        }).connect(signer)
      );
      setToasts({
        text: "Smart wallet created!",
        type: "success",
      });
    }
  };

  // Creates a proxy
  const createProxy = async () => {
    const tx = await proxyFactory["build(address)"](ethAddress);
    await tx.wait();

    setIsCreatingProxy(true);
    try {
      await fetchProxyAddress();
    } catch (e) {
      console.log("ERROR!!!");
    }
    setIsCreatingProxy(false);
  };

  // fetch proxy address
  useEffect(() => {
    if (signer === null) return;
    if (ethAddress === null) return;

    // Update proxy factory
    if (proxyFactory === null && signer !== null) {
      setProxyFactory(
        getContract({
          name: "ProxyFactory",
          network,
        }).connect(signer)
      );
    }

    if (proxyFactory !== null) {
      fetchProxyAddress();
    }
  }, [signer, ethAddress, proxyFactory]);

  return {
    proxyAddress,
    proxy,
    fetchProxyAddress,
    hasProxy,
    createProxy,
    isCreatingProxy,
  };
}

export default createContainer(useProxy);
