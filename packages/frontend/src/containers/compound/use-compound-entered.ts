import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useToasts } from "@zeit-ui/react";

import useProxy from "../web3/use-proxy";
import useContract from "../web3/use-contracts";

import {
  CompoundAssets,
  CompoundAddresses,
  AddressMapping,
} from "../../utils/constants";

function useCompoundEntered() {
  const [, setToast] = useToasts();
  const { proxy, proxyAddress } = useProxy.useContainer();
  const { contracts } = useContract.useContainer();
  const { IComptroller, CompoundActions } = contracts;

  const [isCheckingCompoundEntered, setCheckingCompoundEntered] = useState(
    false
  );
  const [isEnteringCompoundMarkets, setIsEnteringCompoundMarkets] = useState(
    false
  );
  const [compoundEntered, setCompoundEntered] = useState(false);

  const checkCompoundMarketsEntered = async () => {
    setCheckingCompoundEntered(true);
    const marketsEntered = await IComptroller.getAssetsIn(proxyAddress);

    if (marketsEntered.length !== Object.keys(CompoundAssets).length) {
      setCompoundEntered(false);
    } else {
      setCompoundEntered(true);
    }
    setCheckingCompoundEntered(false);
  };

  const enterCompoundMarkets = async () => {
    setIsEnteringCompoundMarkets(true);

    const cTokenAddresses = Object.keys(CompoundAssets).map(
      (k) => AddressMapping[k]
    );
    const calldata = CompoundActions.interface.encodeFunctionData(
      "enterMarkets",
      [CompoundAddresses.Comptroller, cTokenAddresses]
    );

    try {
      const tx = await proxy.execute(CompoundActions.address, calldata, {
        gasLimit: 400000,
      });
      await tx.wait();
      setToast({
        text: "Compound markets entered!",
        type: "success",
      });
      setCompoundEntered(true);
    } catch (e) {
      setToast({
        text: "Failed to enter compound markets!",
        type: "error",
      });
    }
    setIsEnteringCompoundMarkets(false);
  };

  useEffect(() => {
    if (proxyAddress === null) return;
    if (proxyAddress === ethers.constants.AddressZero) return;

    checkCompoundMarketsEntered();
  }, [proxyAddress]);

  return {
    compoundEntered,
    isCheckingCompoundEntered,
    enterCompoundMarkets,
    isEnteringCompoundMarkets,
  };
}

export default createContainer(useCompoundEntered);
