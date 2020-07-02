import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

import useWeb3 from "./useWeb3";

import { getContract, network } from "../../utils/common";

function useProxy() {
  const { ethAddress, signer } = useWeb3.useContainer();

  const [proxy, setProxy] = useState(null);
  const [proxyFactory, setProxyFactory] = useState(null);
  const [proxyAddress, setProxyAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasProxy =
    proxyAddress &&
    proxyAddress !== "0x0000000000000000000000000000000000000000";

  // get proxy address
  const fetchProxyAddress = async () => {
    const proxyAddress = await proxyFactory.proxies(ethAddress);
    setProxyAddress(proxyAddress);

    if (proxyAddress !== "0x0000000000000000000000000000000000000000") {
      setProxy(
        getContract({
          name: "Proxy",
          network,
        })
          .attach(proxyAddress)
          .connect(signer)
      );
    }
  };

  // Creates a proxy
  const createProxy = async () => {
    console.log(proxyFactory);
    const tx = await proxyFactory["build(address)"](ethAddress);
    await tx.wait();

    setLoading(true);
    try {
      await fetchProxyAddress();
    } catch (e) {
      console.log("ERROR!!!");
    }
    setLoading(false);
  };

  // fetch proxy address
  useEffect(() => {
    if (signer === null) return;

    // Update proxy factory
    if (proxyFactory === null) {
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
  }, [signer, proxyFactory]);

  return {
    proxyAddress,
    proxy,
    fetchProxyAddress,
    loading,
    hasProxy,
    createProxy,
  };
}

export default createContainer(useProxy);
