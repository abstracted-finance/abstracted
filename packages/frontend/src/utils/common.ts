const { ethers } = require("ethers");
const path = require("path");

export const randomId = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaaaaaa'
  return s4() + s4();
};

export const getContract = ({ name, network = "mainnet" }) => {
  const deployedFilePath = path.join("deployments", network, "deployed.json");

  let artifact, deployed;
  try {
    deployed = require(`@abstracted/smart-contracts/deployments/${network}/deployed.json`);
  } catch (e) {
    throw new Error(
      `Network not found in deployment path! (${deployedFilePath})`
    );
  }

  try {
    artifact = require(`@abstracted/smart-contracts/artifacts/${name}.json`);
  } catch (e) {
    throw new Error(`Contract name not found in artifacts path! (${name})`);
  }

  const abi = artifact.abi;
  const address = deployed[name];

  if (address === undefined) {
    throw new Error(`${name} has not been deployed to ${network}!`);
  }

  return new ethers.Contract(address, abi);
};

export const getContractInterface = ({ name, network = "mainnet" }) => {
  return getContract({ name, network }).interface;
};

export const network =
  process.env.NODE_ENV === "development" ? "localhost" : "mainnet";
