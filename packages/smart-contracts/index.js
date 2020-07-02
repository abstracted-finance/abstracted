const { ethers } = require("ethers");
const path = require("path");

const getContract = ({ name, network = "mainnet" }) => {
  const deployedFilePath = path.join(
    "deployments",
    network,
    "deployed.json"
  );

  let artifact, deployed
  try {
    deployed = require(`./${deployedFilePath}`)
  } catch(e) {
    throw new Error(
      `Network not found in deployment path! (${deployedFilePath})`
    );
  }

  const artifactFilePath = path.join(__dirname, "artifacts", `${name}.json`);
  if (!fs.existsSync(artifactFilePath)) {
    throw new Error(`Contract name not found in artifacts path! (${name})`);
  }

  const abi = JSON.parse(fs.readFileSync(artifactFilePath, "utf-8")).abi;
  const address = deployed[name];

  if (address === undefined) {
    throw new Error(`${name} has not been deployed to ${network}!`);
  }

  return new ethers.Contract(address, abi);
};

const getContractInterface = ({ name, network = "mainnet" }) => {
  return getContract({ name, network })
}

module.exports = {
  getContract,
  getContractInterface
};
