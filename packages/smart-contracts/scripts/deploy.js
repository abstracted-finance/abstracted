const { ethers, network } = require("@nomiclabs/buidler");
const path = require("path");
const fs = require("fs");

async function main() {
  const accounts = await ethers.getSigners();
  const [deployer, owner] = accounts;

  // Deploys ProxyFactory
  const ProxyFactory = await ethers.getContractFactory(
    "ProxyFactory",
    deployer
  );
  const proxyFactory = await ProxyFactory.deploy({ gasLimit: 3250000 });

  console.log(`Deployed ProxyFactory at ${proxyFactory.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
