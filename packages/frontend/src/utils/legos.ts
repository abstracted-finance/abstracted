import { ethers } from "ethers";
import { Lego, LegoType } from "../containers/legos/useLegos";
import { getContractInterface, getContract, network } from "../utils/common";
import {
  AaveAddresses,
  AddressMapping,
  DecimalMapping,
  CTokenMapping,
  Assets,
} from "./constants";

interface LegoResults {
  valid: boolean;
  serialized: SerializedLego[];
}

type SerializedLego = {
  target: string;
  data: string;
  msgValue: string;
};

type Address = string;

const CompoundActions = getContract({ name: "CompoundActions", network });
const ICompoundActions = getContractInterface({
  name: "CompoundActions",
  network,
});

const TokenActions = getContract({ name: "TokenActions", network });
const ITokenActions = getContractInterface({ name: "TokenActions", network });

const AaveFlashloanActions = getContract({
  name: "AaveFlashloanActions",
  network,
});
const IAaveFlashloanActions = getContractInterface({
  name: "AaveFlashloanActions",
  network,
});

export const serializeLego = (lego: Lego): SerializedLego => {
  const { asset, amount } = lego.args[0];
  const decimals = DecimalMapping[asset];
  const amountWei = ethers.utils.parseUnits(amount, decimals);
  const cTokenAsset = CTokenMapping[asset];
  const cTokenAddress = cTokenAsset ? AddressMapping[cTokenAsset] : null;
  const msgValue = asset === Assets.ETH ? amountWei : amount;

  // Just for convinience
  const partialSerializedCompoundActions = {
    target: CompoundActions.address,
    msgValue,
  };

  if (lego.type === LegoType.CompoundBorrow) {
    return Object.assign({}, partialSerializedCompoundActions, {
      data: ICompoundActions.encodeFunctionData("borrow", [
        cTokenAddress,
        amountWei,
      ]),
    });
  }

  if (lego.type === LegoType.CompoundSupply) {
    return Object.assign({}, partialSerializedCompoundActions, {
      data: ICompoundActions.encodeFunctionData("supply", [
        cTokenAddress,
        amountWei,
      ]),
    });
  }

  if (lego.type === LegoType.CompoundRepay) {
    return Object.assign({}, partialSerializedCompoundActions, {
      data: ICompoundActions.encodeFunctionData("repayBorrow", [
        cTokenAddress,
        amountWei,
      ]),
    });
  }

  if (lego.type === LegoType.CompoundWithdraw) {
    return Object.assign({}, partialSerializedCompoundActions, {
      data: ICompoundActions.encodeFunctionData("redeemUnderlying", [
        cTokenAddress,
        amountWei,
      ]),
    });
  }

  throw new Error(`Unrecognized type: ${lego.type}`);
};

export const serializeLegos = ({
  legos,
  userProxy,
}: {
  legos: Lego[];
  userProxy: Address;
}): SerializedLego[] => {
  if (legos.length === 0) {
    return [];
  }

  let jumpUntil = -1;
  let serialized = [];
  for (const [i, lego] of legos.entries()) {
    if (i <= jumpUntil) {
      continue;
    }

    if (lego.id.startsWith("flashloan-start")) {
      const cleanId = lego.id.replace("flashloan-start-", "");
      const endingId = `flashloan-end-${cleanId}`;
      const endingIndex = legos.findIndex((x) => x.id === endingId);

      // Invalid configuration
      if (endingIndex === -1) {
        return [];
      }

      // Serialize
      const innerSerialized = serializeLegos({
        legos: legos.slice(i + 1, endingIndex),
        userProxy,
      });

      // Flashloan block
      if (lego.type === LegoType.AaveFlashloanStart) {
        const { amount, asset } = lego.args[0];
        const decimals = DecimalMapping[asset];
        const amountWei = ethers.utils.parseUnits(amount, decimals);
        const assetAddress = AddressMapping[asset];
        const refundAmountWei = amountWei
          .mul(ethers.BigNumber.from("10009"))
          .div(ethers.BigNumber.from("10000"));
        const msgValue = asset === Assets.ETH ? amountWei : amount;

        const postloanAddress = TokenActions.address;
        const postloanData = ITokenActions.encodeFunctionData("transfer", [
          AaveAddresses.LendingPoolCore,
          assetAddress,
          refundAmountWei, // Aave has 0.09% fee
        ]);

        const targets = [
          ...innerSerialized.map((x) => x.target),
          postloanAddress,
        ];

        const data = [...innerSerialized.map((x) => x.data), postloanData];

        const msgValues = [...innerSerialized.map((x) => x.msgValue), msgValue];

        const proxyTargetData = ethers.utils.defaultAbiCoder.encode(
          ["tuple(address,address[],bytes[],uint256[])"],
          [[userProxy, targets, data, msgValues]]
        );

        const flashloanSerialized = IAaveFlashloanActions.encodeFunctionData(
          "flashLoan",
          [
            AaveAddresses.LendingPool,
            AaveFlashloanActions.address,
            assetAddress,
            amount,
            proxyTargetData,
          ]
        );

        serialized.push({
          msgValue,
          data: flashloanSerialized,
          target: AaveFlashloanActions.address,
        });
      }

      // Jump until end of nested flashloan block
      jumpUntil = endingIndex;
    } else {
      serialized.push(serializeLego(lego));
    }
  }

  return serialized;
};

export const parseLegos = (legos: Lego[]): LegoResults => {
  // Empty legos is valid legos
  if (legos.length === 0) {
    return {
      valid: true,
      serialized: [],
    };
  }

  // Go through each entry and check if the nested flashloans
  // are placed correctly
  for (const [i, { id }] of legos.entries()) {
    // If our id starts with flashloan start
    if (id.startsWith("flashloan-start")) {
      const cleanId = id.replace("flashloan-start-", "");
      const endingId = `flashloan-end-${cleanId}`;
      const endingIndex = legos.findIndex((x) => x.id === endingId);

      // If no flashloan ending found within, then its invalid
      if (endingIndex === -1) {
        return {
          valid: false,
          serialized: [],
        };
      }

      // Checks to see if inner block is valid
      const parsed = parseLegos(legos.slice(i + 1, endingIndex));

      if (!parsed.valid) {
        return {
          valid: false,
          serialized: [],
        };
      }
    }
  }

  return {
    valid: true,
    serialized: serializeLegos({
      legos,
      userProxy: "0x42da91be491e4101f348b9a746183dad9a6f92a2",
    }),
  };
};
