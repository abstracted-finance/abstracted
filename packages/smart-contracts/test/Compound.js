const { expect } = require("chai");
const { ethers } = require("@nomiclabs/buidler");
const {
  getContract,
  getNamedAccounts,
  getProxyContract,
  getContractEthersInterface,
  assertBNGreaterThan,
} = require("./common");

describe("Compound", function () {
  let user;
  let userProxy;
  let compoundActions;
  let ICompound;
  let tokenActions;
  let erc20;
  let cTokenContract;

  const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  // https://compound.finance/docs#networks
  const comptrollerAddress = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";
  const cDaiAddress = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";
  const cEthAddress = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
  const cUSDCAddress = "0x39aa39c021dfbae8fac545936693ac917d5e7563";
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  before(async () => {
    const { user1: user } = await getNamedAccounts();
    userProxy = await getProxyContract({ signer: user });

    compoundActions = await getContract({ name: "CompoundActions" });
    tokenActions = await getContract({ name: "TokenActions" });

    erc20 = await getContract({ name: "IERC20", address: ZERO_ADDRESS });
    cTokenContract = await getContract({
      name: "ICToken",
      address: ZERO_ADDRESS,
    });

    ICompound = await getContractEthersInterface({ name: "CompoundActions" });
  });

  it("Enter Markets", async function () {
    const calldata = ICompound.encodeFunctionData("enterMarkets", [
      comptrollerAddress,
      [cEthAddress, cDaiAddress, cUSDCAddress],
    ]);

    const tx = await userProxy.execute(compoundActions.address, calldata, {
      gasLimit: 300000,
    });
    await tx.wait();
  });

  it("Supply (Mint cEther)", async function () {
    const cToken = cEthAddress;
    const amount = ethers.utils.parseEther("5.0");

    const initialBal = await erc20.attach(cToken).balanceOf(userProxy.address);

    const calldata = ICompound.encodeFunctionData("supply", [cToken, amount]);
    const tx = await userProxy.execute(compoundActions.address, calldata, {
      value: amount,
      gasLimit: 275000,
    });
    await tx.wait();

    const finalBal = await erc20.attach(cToken).balanceOf(userProxy.address);

    assertBNGreaterThan(finalBal, initialBal);
  });

  it("Borrow (USDC)", async function () {
    const token = usdcAddress;
    const cToken = cUSDCAddress;
    const amount = ethers.utils.parseUnits("10.0", 6); // USDC has 6 decimals

    const initialBal = await erc20.attach(token).balanceOf(userProxy.address);

    const calldata = ICompound.encodeFunctionData("borrow", [cToken, amount]);
    const tx = await userProxy.execute(compoundActions.address, calldata, {
      gasLimit: 375000,
    });
    await tx.wait();

    const finalBal = await erc20.attach(token).balanceOf(userProxy.address);

    assertBNGreaterThan(finalBal, initialBal);
  });

  it("Repay (USDC)", async function () {
    const cToken = cUSDCAddress;
    const amount = ethers.utils.parseUnits("5.0", 6); // USDC has 6 decimals

    const initialBal = await cTokenContract
      .attach(cToken)
      .borrowBalanceStored(userProxy.address);

    const calldata = ICompound.encodeFunctionData("repayBorrow", [
      cToken,
      amount,
    ]);
    const tx = await userProxy.execute(compoundActions.address, calldata, {
      gasLimit: 375000,
    });
    await tx.wait();

    const finalBal = await cTokenContract
      .attach(cToken)
      .borrowBalanceStored(userProxy.address);

    assertBNGreaterThan(initialBal, finalBal);
  });

  it("RedeemUnderlying (ETH)", async function () {
    const cToken = cEthAddress;
    const amount = ethers.utils.parseEther("1.0");

    const initialBal = await erc20.attach(cToken).balanceOf(userProxy.address);

    const calldata = ICompound.encodeFunctionData("redeemUnderlying", [
      cToken,
      amount,
    ]);
    const tx = await userProxy.execute(compoundActions.address, calldata, {
      gasLimit: 375000,
    });
    await tx.wait();

    const finalBal = await erc20.attach(cToken).balanceOf(userProxy.address);

    assertBNGreaterThan(initialBal, finalBal);
  });

  it("Batch Execution", async function () {
    const data = [
      ICompound.encodeFunctionData("enterMarkets", [
        comptrollerAddress,
        [cEthAddress, cDaiAddress, cUSDCAddress],
      ]),
      ICompound.encodeFunctionData("supply", [
        cEthAddress,
        ethers.utils.parseEther("5.0"),
      ]),
      ICompound.encodeFunctionData("borrow", [
        cUSDCAddress,
        ethers.utils.parseUnits("10.0", 6),
      ]),
      ICompound.encodeFunctionData("borrow", [
        cDaiAddress,
        ethers.utils.parseEther("10.0"),
      ]),
      ICompound.encodeFunctionData("redeemUnderlying", [
        cEthAddress,
        ethers.utils.parseEther("1.0"),
      ]),
    ];

    const msgValues = [
      ethers.constants.Zero,
      ethers.utils.parseEther("5.0"),
      ethers.constants.Zero,
      ethers.constants.Zero,
      ethers.constants.Zero,
    ];

    const targets = Array(data.length)
      .fill(0)
      .map(() => compoundActions.address);

    const tx = await userProxy.executes(targets, data, msgValues, {
      gasLimit: 6000000,
      value: msgValues.reduce((acc, x) => acc.add(x), ethers.constants.Zero),
    });
    await tx.wait();
  });
});
