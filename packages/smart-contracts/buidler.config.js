const { task } = require("@nomiclabs/buidler/config");
const chalk = require("chalk");

usePlugin("@nomiclabs/buidler-ethers");

task("deploy-for-testing", "Deploys contracts for testing").setAction(
  async () => {
    const { deploy } = require("./cli/commands/deploy");

    console.log(chalk.blue("Deploying contracts for testing"));
    await deploy({
      deploymentDirectory: "deployments/localhost",
      noToggleDeploy: true,
    });
  }
);

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
  // This is a sample solc configuration that specifies which version of solc to use
  solc: {
    version: "0.6.6",
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      timeout: 240000,
    },
  },
  defaultNetwork: "localhost",
};
