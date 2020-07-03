import { createContainer } from "unstated-next";
import { useState } from "react";
import { useToasts } from "@zeit-ui/react";
import { ethers } from "ethers";

import { AddressMapping, DecimalMapping } from "../../utils/constants";

import useWeb3 from "../web3/useWeb3";
import useProxy from "../web3/useProxy";
import useContracts from "../web3/useContracts";

function useWithdraw() {
  const [, setToast] = useToasts();
  const { ethAddress } = useWeb3.useContainer();
  const { contracts } = useContracts.useContainer();
  const { proxy } = useProxy.useContainer();

  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const withdraw = async ({ asset, amount }) => {
    const { TokenActions } = contracts;

    setIsWithdrawing(true);

    try {
      const tokenAddress = AddressMapping[asset];
      const decimals = DecimalMapping[asset];
      const calldata = TokenActions.interface.encodeFunctionData("transfer", [
        ethAddress,
        tokenAddress,
        ethers.utils.parseUnits(amount, decimals),
      ]);
      const tx = await proxy.execute(TokenActions.address, calldata, {
        gasLimit: 300000,
      });
      await tx.wait();

      setToast({
        text: "Withdraw successful",
        type: "success",
      });
    } catch (e) {
      setToast({
        text: "Failed to withdraw",
        type: "error",
      });
    }

    setIsWithdrawing(false);
  };

  return {
    withdraw,
    isWithdrawing,
  };
}

export default createContainer(useWithdraw);
