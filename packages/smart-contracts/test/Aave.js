const { expect } = require("chai");
const { ethers } = require("@nomiclabs/buidler");
const {
  getContract,
  getNamedAccounts,
  getProxyContract,
  getContractEthersInterface,
} = require("./common");

describe("Aave", function () {
  let user;
  let userProxy;
  let aaveFlashloanActions;
  let tokenActions;

  let IAave;
  let ITokens;

  before(async () => {
    const { user1: user } = await getNamedAccounts();
    userProxy = await getProxyContract({ signer: user });

    aaveFlashloanActions = await getContract({ name: "AaveFlashloanActions" });
    tokenActions = await getContract({ name: "TokenActions" });

    IAave = await getContractEthersInterface({
      name: "AaveFlashloanActions",
    });

    ITokens = await getContractEthersInterface({
      name: "TokenActions",
    });
  });

  it("Flashloan (ETH)", async function () {
    const reserve = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    const amount = ethers.utils.parseEther("5.0");
    const refundAmount = amount
      .mul(ethers.BigNumber.from("10009"))
      .div(ethers.BigNumber.from("10000"));
    const fee = refundAmount.sub(amount);

    const addressProvider = await getContract({
      name: "ILendingPoolAddressesProvider",
      address: await aaveFlashloanActions.addressesProvider(),
    });
    const lendingPoolCoreAddress = await addressProvider.getLendingPoolCore();

    // Encode _params for flashloan
    const postloanAddress = tokenActions.address;
    const postloanActionData = ITokens.encodeFunctionData("transfer", [
      lendingPoolCoreAddress,
      reserve,
      refundAmount, // Aave has 0.09% fee
    ]);

    const callDataTargets = [postloanAddress];
    const callDataData = [postloanActionData];

    const proxyTargetData = ethers.utils.defaultAbiCoder.encode(
      ["tuple(address,address[],bytes[])"],
      [[userProxy.address, callDataTargets, callDataData]]
    );

    // Call "flashLoan" via proxy
    const flashloanCalldata = IAave.encodeFunctionData("flashLoan", [
      aaveFlashloanActions.address,
      reserve,
      amount,
      proxyTargetData,
    ]);

    const flashLoanTx = await userProxy.executes(
      [aaveFlashloanActions.address],
      [flashloanCalldata],
      { value: fee, gasLimit: 6000000 }
    );
    await flashLoanTx.wait();
  });
});
