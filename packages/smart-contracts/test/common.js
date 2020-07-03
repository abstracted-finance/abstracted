const { assert } = require("chai");
const { ethers } = require("@nomiclabs/buidler");
const localhostDeployments = require("../deployments/localhost/deployed.json");

const getContract = async ({ name, address, signer }) => {
  return ethers.getContractAt(
    name,
    address || localhostDeployments[name],
    signer
  );
};

const getNamedAccounts = async () => {
  const accounts = await ethers.getSigners();

  const [deployer, owner, user1] = accounts;

  return {
    deployer,
    owner,
    user1,
  };
};

const getProxyContract = async ({ signer }) => {
  const proxyFactory = await getContract({
    name: "ProxyFactory",
    signer,
  });

  let proxyAddress = await proxyFactory.proxies(signer._address);

  if (proxyAddress === ethers.constants.AddressZero) {
    const tx = await proxyFactory["build(address)"](signer._address);
    await tx.wait();

    proxyAddress = await proxyFactory.proxies(signer._address);
  }

  return getContract({ name: "Proxy", address: proxyAddress, signer });
};

const getContractEthersInterface = async ({ name }) => {
  const contract = await ethers.getContractFactory(name);

  return contract.interface;
};

const assertBNGreaterThan = (aBN, bBN) => {
  assert.ok(
    aBN.gt(bBN),
    `${aBN.toString()} is not greater than ${bBN.toString()}`
  );
};

const assertBNGreaterEqualThan = (aBN, bBN) => {
  assert.ok(
    aBN.gte(bBN),
    `${aBN.toString()} is not greater than or equal to ${bBN.toString()}`
  );
};

const assertBNLessThan = (aBN, bBN) => {
  assert.ok(
    aBN.lt(bBN),
    `${aBN.toString()} is not less than ${bBN.toString()}`
  );
};

const assertBNLessEqualThan = (aBN, bBN) => {
  assert.ok(
    aBN.lte(bBN),
    `${aBN.toString()} is not less than or equal to ${bBN.toString()}`
  );
};

module.exports = {
  getNamedAccounts,
  getContract,
  getProxyContract,
  getContractEthersInterface,
  assertBNGreaterEqualThan,
  assertBNGreaterThan,
  assertBNLessEqualThan,
  assertBNLessThan,
};
