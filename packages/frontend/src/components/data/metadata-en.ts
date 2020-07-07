export default [
  {
    name: 'dashboard',
    children: [
      {
        name: 'smart-wallet',
        children: [
          {
            name: 'overview',
            url: '/en/dashboard/overview/',
            index: 5,
            group: 'smart-wallet',
          },
          {
            name: 'transfer',
            url: '/en/dashboard/transfer/',
            index: 5,
            group: 'smart-wallet',
          },
        ],
      },
      {
        name: 'apps',
        children: [
          // {
          //   name: 'aave',
          //   url: '/en/dashboard/aave/',
          //   index: 5,
          //   group: 'apps',
          // },
          {
            name: 'compound',
            url: '/en/dashboard/compound/',
            index: 5,
            group: 'apps',
          },
          // {
          //   name: 'uniswap-v2',
          //   url: '/en/dashboard/uniswap-v2/',
          //   index: 5,
          //   group: 'apps',
          // },
        ],
      },
    ],
  },
  {
    name: 'tools',
    children: [
      {
        name: 'general',
        children: [
          {
            name: 'introduction',
            url: '/en/tools/introduction/',
            index: 100,
            group: 'general',
          },
        ],
      },
      // {
      //   name: 'black-swan',
      //   children: [
      //     {
      //       name: 'only-stablecoins',
      //       url: '/en/tools/only-stablecoins/',
      //       index: 100,
      //       group: 'black-swan',
      //     },
      //     {
      //       name: 'ethereum-bad',
      //       url: '/en/tools/grid',
      //       index: 100,
      //       group: 'black-swan',
      //     },
      //     {
      //       name: 'exit-borrowing',
      //       url: '/en/tools/exit-borrowing/',
      //       index: 100,
      //       group: 'black-swan',
      //     },
      //   ],
      // },
      // {
      //   name: 'bridges',
      //   children: [
      //     {
      //       name: 'protocol',
      //       url: '/en/tools/bridges',
      //       index: 100,
      //       group: 'bridges',
      //     },
      //   ],
      // },
      // {
      //   name: 'swaps',
      //   children: [
      //     {
      //       name: 'collateral',
      //       url: '/en/tools/collateral/',
      //       index: 100,
      //       group: 'swaps',
      //     },
      //     {
      //       name: 'debt',
      //       url: '/en/tools/debt/',
      //       index: 100,
      //       group: 'swaps',
      //     },
      //   ],
      // },
      // {
      //   name: 'position',
      //   children: [
      //     {
      //       name: 'leverage',
      //       url: '/en/tools/leverage/',
      //       index: 100,
      //       group: 'position',
      //     },
      //     {
      //       name: 'de-leverage',
      //       url: '/en/tools/leverage/',
      //       index: 100,
      //       group: 'position',
      //     },
      //   ],
      // },
      {
        name: 'custom-diy',
        children: [
          {
            name: 'no-code',
            url: '/en/tools/no-code/',
            index: 100,
            group: 'custom-diy',
          },
        ],
      },
    ],
  },
  {
    name: 'settings',
    children: [
      {
        name: 'preferences',
        children: [
          {
            name: 'general',
            url: '/en/settings/general/',
            index: 100,
            group: 'preferences',
          },
        ],
      },
    ],
  },
]
