const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const getContract = ({ name, network }) => {
  const deployedFilePath = path.join(
    __dirname,
    "deployments",
    network,
    "deployed.json"
  );

  if (!fs.existsSync(deployedFilePath)) {
    throw new Error(
      `Network not found in deployment path! (${deployedFilePath})`
    );
  }

  const artifactFilePath = path.join(__dirname, "artifacts", `${name}.json`);
  if (!fs.existsSync(artifactFilePath)) {
    throw new Error(`Contract name not found in artifacts path! (${name})`);
  }

  const abi = JSON.parse(fs.readFileSync(artifactFilePath, "utf-8")).abi;
  const address = JSON.parse(fs.readFileSync(deployedFilePath, "utf-8"))[name];

  if (address === undefined) {
    throw new Error(`${name} has not been deployed to ${network}!`);
  }

  return new ethers.Contract(address, abi);
};

module.exports = {
  getContract,
};
