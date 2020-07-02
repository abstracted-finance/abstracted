import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

type Provider = ethers.providers.Provider;
type Signer = ethers.Signer;

function useWeb3() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [network, setNetwork] = useState<any>(null);
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const attemptConnection = async () => {
    if (window.ethereum === undefined) {
      throw Error("MetaMask not found");
    }

    // get provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner()
    const network = await provider.getNetwork();

    // get address
    await provider.send("eth_requestAccounts", null);
    const address = await signer.getAddress();

    setProvider(provider);
    setSigner(signer);
    setNetwork(network);
    setEthAddress(address);
  };

  const connect = async () => {
    try {
      setError(null);
      await attemptConnection();
    } catch (error) {
      setError(error);
    }
  };

  return { provider, signer, network, ethAddress, connect, error };
}

export default createContainer(useWeb3);
