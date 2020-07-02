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

  let aaveLendingPoolAddressProvider;
  const aaveLendingPoolAddressProviderAddress =
    "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8";

  let aaveLendingPoolCoreAddress;
  let aaveLendingPoolAddress;

  before(async () => {
    aaveLendingPoolAddressProvider = await getContract({
      name: "ILendingPoolAddressesProvider",
      address: aaveLendingPoolAddressProviderAddress,
    });

    aaveLendingPoolCoreAddress = await aaveLendingPoolAddressProvider.getLendingPoolCore();
    aaveLendingPoolAddress = await aaveLendingPoolAddressProvider.getLendingPool();

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

    // Postloan we need to refund
    const postloanAddress = tokenActions.address;
    const postloanActionData = ITokens.encodeFunctionData("transfer", [
      aaveLendingPoolCoreAddress,
      reserve,
      refundAmount, // Aave has 0.09% fee
    ]);

    const targets = [postloanAddress];
    const data = [postloanActionData];
    const msgValues = [fee]

    const proxyTargetData = ethers.utils.defaultAbiCoder.encode(
      ["tuple(address,address[],bytes[],uint256[])"],
      [[userProxy.address, targets, data, msgValues]]
    );

    // Call "flashLoan" via proxy
    const flashloanCalldata = IAave.encodeFunctionData("flashLoan", [
      aaveLendingPoolAddress,
      aaveFlashloanActions.address,
      reserve,
      amount,
      proxyTargetData,
    ]);

    const flashLoanTx = await userProxy.executes(
      [aaveFlashloanActions.address],
      [flashloanCalldata],
      [ethers.constants.Zero],
      { value: fee, gasLimit: 6000000 }
    );
    await flashLoanTx.wait();
  });
});
