import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import useWeb3 from "../web3/useWeb3";
import useProxy from "../web3/useProxy";
import useContracts from "../web3/useContracts";
import useSettings from "../settings/useSettings";

import useLocalStorageState from "use-local-storage-state";

import {
  CoinGeckoIdMapping,
  AddressMapping,
  DecimalMapping,
  Assets,
} from "../../utils/constants";

export interface Balance {
  label: string;
  address: string;
  amount: string;
  decimals: number;
  price: number; // in nominated currency
}

const initialBalances: Balance[] = Object.keys(Assets).map((k) => {
  const v = Assets[k];
  return {
    label: v,
    address: AddressMapping[v],
    amount: "0",
    decimals: DecimalMapping[v],
    price: 0,
  };
});

function useBalances() {
  const { signer, provider } = useWeb3.useContainer();
  const { proxyAddress } = useProxy.useContainer();
  const { contracts } = useContracts.useContainer();
  const { settings } = useSettings.useContainer();
  const { IERC20 } = contracts;
  const { currency } = settings;

  const [isRetrievingBal, setIsRetrievingBal] = useState(false);
  const [balances, setBalances] = useLocalStorageState('balances', initialBalances);

  const getBalances = async () => {
    setIsRetrievingBal(true);

    // Query blockchain
    const newBalances = await Promise.all(
      initialBalances.map(async (x) => {
        let balance;
        if (x.label === Assets.ETH) {
          balance = await provider.getBalance(proxyAddress);
        } else {
          balance = await IERC20.attach(x.address).balanceOf(proxyAddress);
        }
        return {
          ...x,
          amount: ethers.utils.formatUnits(balance, x.decimals),
        };
      })
    );

    // Query Coingecko
    const coingeckoAssetIds = newBalances
      .map((x) => x.label)
      .map((x) => CoinGeckoIdMapping[x]);

    const coingeckoQueryUrl = encodeURI(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoAssetIds.join(
        ","
      )}&vs_currencies=${currency}`
    );

    const coingeckoResp = await fetch(coingeckoQueryUrl);
    const coingeckoJson = await coingeckoResp.json();

    const newBalancesWithPrices = newBalances.map((b) => {
      const coingeckoId = CoinGeckoIdMapping[b.label];
      const price = coingeckoJson[coingeckoId][currency];

      return {
        ...b,
        price,
      };
    });

    setBalances(newBalancesWithPrices);
    setIsRetrievingBal(false);
  };

  useEffect(() => {
    if (signer === null) return;
    if (
      proxyAddress === null ||
      proxyAddress === ethers.constants.AddressZero
    ) {
      setBalances(initialBalances);
      return;
    }

    getBalances();
  }, [proxyAddress, currency]);

  return {
    balances,
    isRetrievingBal,
    getBalances,
  };
}

export default createContainer(useBalances);
