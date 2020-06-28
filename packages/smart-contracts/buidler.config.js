usePlugin("@nomiclabs/buidler-ethers");

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
  // This is a sample solc configuration that specifies which version of solc to use
  solc: {
    version: "0.6.8",
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      timeout: 240000,
    },
  },
  defaultNetwork: "localhost",
};
