import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";
import { useToasts } from "@zeit-ui/react";

import useWeb3 from "./useWeb3";
import useContracts from "./useContracts";

import { getContract, network } from "../../utils/common";
import { ethers } from "ethers";

function useProxy() {
  const { ethAddress, signer } = useWeb3.useContainer();
  const { contracts } = useContracts.useContainer();

  const { ProxyFactory } = contracts;

  const [, setToasts] = useToasts();
  const [isCreatingProxy, setIsCreatingProxy] = useState(false);
  const [proxy, setProxy] = useState(null);
  const [proxyAddress, setProxyAddress] = useState(null);

  const hasProxy =
    proxyAddress &&
    proxyAddress !== ethers.constants.AddressZero;

  // get proxy address
  const fetchProxyAddress = async () => {
    const newProxyAddress = await ProxyFactory.proxies(ethAddress);

    if (newProxyAddress === proxyAddress) return;

    if (newProxyAddress !== ethers.constants.AddressZero) {
      setProxyAddress(newProxyAddress);
      setProxy(
        getContract({
          name: "Proxy",
          network,
          address: newProxyAddress,
        }).connect(signer)
      );
      setToasts({
        text: "Smart wallet connected!",
        type: "success",
      });
    }

    if (newProxyAddress === ethers.constants.AddressZero) {
      setProxyAddress(newProxyAddress);
      setProxy(null);
    }
  };

  // Creates a proxy
  const createProxy = async () => {
    const tx = await ProxyFactory["build(address)"](ethAddress);
    await tx.wait();

    setIsCreatingProxy(true);
    try {
      await fetchProxyAddress();
    } catch (e) {
      setToasts({
        text: "Error fetching smart wallet address",
        type: "error",
      });
    }
    setIsCreatingProxy(false);
  };

  // fetch proxy address
  useEffect(() => {
    if (signer === null) return;
    if (ethAddress === null) return;
    if (ProxyFactory === null) return;

    fetchProxyAddress();
  }, [signer, ethAddress, ProxyFactory]);

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
