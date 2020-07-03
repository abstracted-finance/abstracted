import { createContainer } from "unstated-next";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import useWeb3 from "./useWeb3";
import { getContract, network } from "../../utils/common";
import { CompoundAddresses } from "../../utils/constants";

// Contracts that has dynamic address
const initialNoAddressContractNames = ["IERC20", "Proxy"];
const initialNoAddressContracts = initialNoAddressContractNames
  .map((x) => {
    return [
      x,
      getContract({
        name: x,
        network,
        address: ethers.constants.AddressZero,
      }),
    ];
  })
  .reduce((acc, [k, v]) => {
    return { ...acc, [k]: v };
  }, {});

// Contracts with manual address
const initialManualAddressContractsConfig = [
  { name: "IComptroller", address: CompoundAddresses.Comptroller },
];
const initialManualAddressContracts = initialManualAddressContractsConfig
  .map(({ name, address }) => {
    return [name, getContract({ name, network, address })];
  })
  .reduce((acc, [k, v]) => {
    return { ...acc, [k]: v };
  }, {});

// Contracts that has a fixed address
const initialAddressedContractNames = [
  "ProxyFactory",
  "CompoundActions",
  "TokenActions",
  "AaveFlashloanActions",
];
const initialAddressedContracts = initialAddressedContractNames
  .map((x) => {
    return [
      x,
      getContract({
        name: x,
        network,
      }),
    ];
  })
  .reduce((acc, [k, v]) => {
    return { ...acc, [k]: v };
  }, {});

const initialContracts: any = {
  ...initialNoAddressContracts,
  ...initialManualAddressContracts,
  ...initialAddressedContracts,
};

function useContracts() {
  const { signer } = useWeb3.useContainer();
  const [contracts, setContracts] = useState(initialContracts);

  const updateContractSigner = () => {
    const contractsWithNewSigner = Object.keys(contracts)
      .map((k) => {
        return [k, contracts[k].connect(signer)];
      })
      .reduce((acc, [k, v]) => {
        return { ...acc, [k]: v };
      }, {});

    setContracts(contractsWithNewSigner);
  };

  useEffect(() => {
    if (signer === null) return;

    updateContractSigner();
  }, [signer]);

  return {
    contracts,
  };
}

export default createContainer(useContracts);
