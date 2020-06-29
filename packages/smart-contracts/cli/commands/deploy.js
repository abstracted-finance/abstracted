const { ethers, network } = require("@nomiclabs/buidler");
const path = require("path");
const fs = require("fs");
const ora = require("ora");
const chalk = require("chalk");

const deploymentFilename = "config.json";
const deployedFilename = "deployed.json";

async function deploy({ deploymentDirectory, noToggleDeploy }) {
  const accounts = await ethers.getSigners();
  const [deployer, owner] = accounts;

  const absoluteDeploymentDirectory = path.join(
    process.cwd(),
    deploymentDirectory
  );
  const deployedFilePath = path.resolve(
    absoluteDeploymentDirectory,
    deployedFilename
  );
  const deploymentFilePath = path.resolve(
    absoluteDeploymentDirectory,
    deploymentFilename
  );

  // Create deployedFile if doesn't exists
  if (!fs.existsSync(deployedFilePath)) {
    fs.writeFileSync(deployedFilePath, "{}");
  }

  // Get deployments needed
  const deploymentConfig = JSON.parse(
    fs.readFileSync(deploymentFilePath, "utf8")
  );
  const updatedDeploymentConfig = Object.assign({}, deploymentConfig);

  // Get deploed
  const deployedConfig = JSON.parse(fs.readFileSync(deployedFilePath, "utf8"));

  // Deploys each contract
  for (const contractName in deploymentConfig) {
    const contract = await ethers.getContractFactory(contractName, deployer);

    if (deploymentConfig[contractName].deploy) {
      // Display deploying info
      const spinner = ora(`Deploying ${contractName}`).start();

      // Deploy contract
      const deployedContract = await contract.deploy();

      // Display success
      spinner.succeed(
        chalk.green(`Deployed ${contractName} to ${deployedContract.address}`)
      );

      // Write to config.json
      updatedDeploymentConfig[contractName].deploy = false;
      fs.writeFileSync(
        deploymentFilePath,
        JSON.stringify(updatedDeploymentConfig, null, 4)
      );

      // Write to deployed.json
      if (!noToggleDeploy) {
        deployedConfig[contractName] = deployedContract.address;
        fs.writeFileSync(
          deployedFilePath,
          JSON.stringify(deployedConfig, null, 4)
        );
      }
    }
  }
}

module.exports = {
  cmd: (program) =>
    program
      .command("deploy")
      .description("Deploys contracts")
      .option(
        "-t, --no-toggle-deploy",
        "Doesn't toggle 'deploy' value in config.json"
      )
      .option(
        "-d, --deployment-directory <value>",
        "Deployment directory with config.json"
      )
      .action(deploy),
};
