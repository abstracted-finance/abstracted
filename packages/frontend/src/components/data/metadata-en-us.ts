export default [
    {
      name: "dashboard",
      children: [
        {
          name: "smart-wallet",
          children: [
            {
              name: "overview",
              url: "/en-us/dashboard/overview",
              index: 5,
              group: "smart-wallet",
            },
            {
              name: "security",
              url: "/en-us/dashboard/security",
              index: 15,
              group: "smart-wallet",
            },
          ],
        },
      ],
    },
    {
      name: "tools",
      children: [
        {
          name: "black-swan",
          children: [
            {
              name: "only-stablecoins",
              url: "/en-us/tools/only-stablecoins",
              index: 100,
              group: "black-swan",
            },
            {
              name: "ethereum-bad",
              url: "/en-us/tools/grid",
              index: 100,
              group: "black-swan",
            },
            {
              name: "exit-borrowing",
              url: "/en-us/tools/exit-borrowing",
              index: 100,
              group: "black-swan",
            },
          ],
        },
        {
          name: "bridges",
          children: [
            {
              name: "protocol",
              url: "/en-us/tools/bridges",
              index: 100,
              group: "bridges",
            },
          ],
        },
        {
          name: "swaps",
          children: [
            {
              name: "collateral",
              url: "/en-us/tools/collateral",
              index: 100,
              group: "swaps",
            },
            {
              name: "debt",
              url: "/en-us/tools/debt",
              index: 100,
              group: "swaps",
            },
          ],
        },
        {
          name: "risk",
          children: [
            {
              name: "leverage",
              url: "/en-us/tools/leverage",
              index: 100,
              group: "risk",
            },
            {
              name: "de-leverage",
              url: "/en-us/tools/leverage",
              index: 100,
              group: "risk",
            },
          ],
        },
        {
          name: "custom",
          children: [
            {
              name: "no-code",
              url: "/en-us/tools/no-code",
              index: 100,
              group: "custom",
            },
          ],
        },
      ],
    },
    {
      name: "settings",
      children: [
        {
          name: "preferences",
          children: [
            {
              name: "general",
              url: "/en-us/settings/general",
              index: 100,
              group: "preferences",
            },
          ],
        },
      ],
    },
  ];
  