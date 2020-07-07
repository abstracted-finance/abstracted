module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
      }
    }

    return config
  },

  // exportPathMap: async function (
  //   defaultPathMap,
  //   { dev, dir, outDir, distDir, buildId }
  // ) {
  //   if (dev) return defaultPathMap

  //   return {
  //     '/': { page: '/' },
  //     '/en-us/dashboard': { page: '/tools' },
  //   }
  // },
}
