import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import useWeb3 from "../web3/useWeb3";
import useProxy from "../web3/useProxy";
import useContracts from "../web3/useContracts";
import {
  AddressMapping,
  DecimalMapping,
  CTokenMapping,
  Assets,
} from "../../utils/constants";
import { getContract, network } from "../../utils/common";
import { CompoundInputOptions } from "../../components/legos/compound/InputOptions";

interface Balance {
  label: string;
  address: string;
  amount: string;
  decimals: number;
}

const initialCompoundBalance: Balance[] = CompoundInputOptions.map((x) => {
  const cTokenValue = CTokenMapping[x.value];
  return {
    label: cTokenValue,
    address: AddressMapping[cTokenValue],
    amount: "0",
    decimals: DecimalMapping[cTokenValue],
  };
});

function useCompoundBalances() {
  const { signer, provider } = useWeb3.useContainer();
  const { proxyAddress } = useProxy.useContainer();
  const { contracts } = useContracts.useContainer();
  const { IERC20 } = contracts;

  const [isRetrievingCompoundBal, setIsRetrievingCompoundBal] = useState(false);
  const [compoundBalances, setCompoundBalances] = useState(
    initialCompoundBalance
  );

  const getCompoundBalances = async () => {
    setIsRetrievingCompoundBal(true);
    const newCompoundBalances = await Promise.all(
      initialCompoundBalance.map(async (x) => {
        let balance;
        if (x.label === Assets.ETH) {
          balance = provider.getBalance(proxyAddress);
        } else {
          balance = await IERC20.attach(x.address).balanceOf(proxyAddress);
        }
        return {
          ...x,
          amount: ethers.utils.formatUnits(balance, x.decimals),
        };
      })
    );
    setCompoundBalances(newCompoundBalances);
    setIsRetrievingCompoundBal(false);
  };

  useEffect(() => {
    if (signer === null) return;
    if (proxyAddress === null) {
      setCompoundBalances(initialCompoundBalance);
      return;
    }

    getCompoundBalances();
  }, [proxyAddress]);

  return {
    compoundBalances,
    isRetrievingCompoundBal,
  };
}

export default createContainer(useCompoundBalances);
