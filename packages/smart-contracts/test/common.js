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

  if (proxyAddress === "0x0000000000000000000000000000000000000000") {
    const tx = await proxyFactory["build(address)"](signer._address);
    await tx.wait();

    proxyAddress = await proxyFactory.proxies(signer._address);
  }

  return getContract({ name: "Proxy", address: proxyAddress, signer });
};

const getContractEthersInterface = async ({ name }) => {
  const contract = await ethers.getContractFactory(name);

  return contract.interface
};

module.exports = {
  getNamedAccounts,
  getContract,
  getProxyContract,
  getContractEthersInterface
};
