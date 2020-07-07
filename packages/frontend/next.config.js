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

  experimental: {
    trailingSlash: true,
  },

  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    if (dev) return defaultPathMap

    // More for static builds
    // Append index.html to each keys that start with a 'en'
    // so that it automatically redirects
    const pathMapFixed = Object.keys(defaultPathMap)
      .map((k) => {
        if (!k.startsWith('/en')) {
          return {}
        }

        return {
          [`${k}/index.html`]: defaultPathMap[k],
        }
      })
      .reduce((acc, x) => {
        return { ...acc, ...x }
      }, {})

    return {
      ...defaultPathMap,
      ...pathMapFixed,
    }
  },
}
