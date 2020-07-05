export enum Assets {
  USDC = 'USDC',
  TUSD = 'TUSD',
  USDT = 'USDT',
  sUSD = 'sUSD',
  BUSD = 'BUSD',
  ETH = 'ETH',
  LEND = 'LEND',
  BAT = 'BAT',
  KNC = 'KNC',
  LINK = 'LINK',
  MANA = 'MANA',
  MKR = 'MKR',
  REP = 'REP',
  SNX = 'SNX',
  WBTC = 'WBTC',
  ZRX = 'ZRX',
  DAI = 'DAI',
}

export const AssetOptionsAutoComplete = Object.keys(Assets).map(k => {
  return {
    value: Assets[k],
    label: Assets[k]
  }
})

export enum CompoundAssets {
  cETH = 'cETH',
  cBAT = 'cBAT',
  cUSDC = 'cUSDC',
  cUSDT = 'cUSDT',
  cDAI = 'cDAI',
  cWBTC = 'cWBTC',
  cREP = 'cREP',
  cZRX = 'cZRX',
}

export const AddressMapping = {
  [Assets.ETH]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  [Assets.USDC]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [Assets.TUSD]: '0x0000000000085d4780B73119b644AE5ecd22b376',
  [Assets.USDT]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  [Assets.sUSD]: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
  [Assets.BUSD]: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
  [Assets.LEND]: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
  [Assets.BAT]: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
  [Assets.KNC]: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
  [Assets.LINK]: '0x514910771af9ca656af840dff83e8264ecf986ca',
  [Assets.MANA]: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
  [Assets.MKR]: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  [Assets.REP]: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
  [Assets.SNX]: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  [Assets.WBTC]: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  [Assets.ZRX]: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
  [Assets.DAI]: '0x6b175474e89094c44da98b954eedeac495271d0f',
  [CompoundAssets.cETH]: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
  [CompoundAssets.cBAT]: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e',
  [CompoundAssets.cUSDC]: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
  [CompoundAssets.cUSDT]: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
  [CompoundAssets.cDAI]: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
  [CompoundAssets.cWBTC]: '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4',
  [CompoundAssets.cREP]: '0x158079ee67fce2f58472a96584a73c7ab9ac95c1',
  [CompoundAssets.cZRX]: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
}

export const CTokenMapping = {
  [Assets.ETH]: [CompoundAssets.cETH],
  [Assets.USDC]: [CompoundAssets.cUSDC],
  [Assets.USDT]: [CompoundAssets.cUSDT],
  [Assets.DAI]: [CompoundAssets.cDAI],
  [Assets.WBTC]: [CompoundAssets.cWBTC],
  [Assets.BAT]: [CompoundAssets.cBAT],
  [Assets.REP]: [CompoundAssets.cREP],
  [Assets.ZRX]: [CompoundAssets.cZRX],
}

export const DecimalMapping = {
  [Assets.ETH]: 18,
  [Assets.USDC]: 6,
  [Assets.TUSD]: 18,
  [Assets.USDT]: 6,
  [Assets.sUSD]: 18,
  [Assets.BUSD]: 18,
  [Assets.LEND]: 18,
  [Assets.BAT]: 18,
  [Assets.KNC]: 18,
  [Assets.LINK]: 18,
  [Assets.MANA]: 18,
  [Assets.MKR]: 18,
  [Assets.REP]: 18,
  [Assets.SNX]: 18,
  [Assets.WBTC]: 8,
  [Assets.ZRX]: 18,
  [Assets.DAI]: 18,
  [CompoundAssets.cETH]: 8,
  [CompoundAssets.cBAT]: 8,
  [CompoundAssets.cUSDC]: 8,
  [CompoundAssets.cUSDT]: 8,
  [CompoundAssets.cDAI]: 8,
  [CompoundAssets.cWBTC]: 8,
  [CompoundAssets.cREP]: 8,
  [CompoundAssets.cZRX]: 8,
}

export const AaveAddresses = {
  LendingPoolAddressProvider: '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8',
  LendingPool: '0x398ec7346dcd622edc5ae82352f02be94c62d119',
  LendingPoolCore: '0x3dfd23a6c5e8bbcfc9581d2e864a68feb6a076d3',
}

export const CompoundAddresses = {
  Comptroller: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b',
}

// https://api.coingecko.com/api/v3/coins/list
export const CoinGeckoIdMapping = {
  [Assets.ETH]: 'ethereum',
  [Assets.USDC]: 'usd-coin',
  [Assets.TUSD]: 'true-usd',
  [Assets.USDT]: 'tether',
  [Assets.sUSD]: 'nusd',
  [Assets.BUSD]: 'binance-usd',
  [Assets.LEND]: 'ethlend',
  [Assets.BAT]: 'basic-attention-token',
  [Assets.KNC]: 'kyber-network',
  [Assets.LINK]: 'link',
  [Assets.MANA]: 'decentraland',
  [Assets.MKR]: 'maker',
  [Assets.REP]: 'augur',
  [Assets.SNX]: 'havven',
  [Assets.WBTC]: 'wrapped-bitcoin',
  [Assets.ZRX]: '0x',
  [Assets.DAI]: 'dai',
}

export const CoinGeckoIdReverseMapping = Object.keys(CoinGeckoIdMapping)
  .map((k) => [CoinGeckoIdMapping[k], k])
  .reduce((acc, [k, v]) => {
    return {
      ...acc,
      [k]: v,
    }
  }, {})

// https://api.coingecko.com/api/v3/simple/supported_vs_currencies
export enum CoinGeckoSupportedCurrencies {
  BTC = 'btc',
  ETH = 'eth',
  LTC = 'ltc',
  BCH = 'bch',
  BNB = 'bnb',
  EOS = 'eos',
  XRP = 'xrp',
  XLM = 'xlm',
  USD = 'usd',
  AED = 'aed',
  ARS = 'ars',
  AUD = 'aud',
  BDT = 'bdt',
  BHD = 'bhd',
  BMD = 'bmd',
  BRL = 'brl',
  CAD = 'cad',
  CHF = 'chf',
  CLP = 'clp',
  CNY = 'cny',
  CZK = 'czk',
  DKK = 'dkk',
  EUR = 'eur',
  GBP = 'gbp',
  HKD = 'hkd',
  HUF = 'huf',
  IDR = 'idr',
  ILS = 'ils',
  INR = 'inr',
  JPY = 'jpy',
  KRW = 'krw',
  KWD = 'kwd',
  LKR = 'lkr',
  MMK = 'mmk',
  MXN = 'mxn',
  MYR = 'myr',
  NOK = 'nok',
  NZD = 'nzd',
  PHP = 'php',
  PKR = 'pkr',
  PLN = 'pln',
  RUB = 'rub',
  SAR = 'sar',
  SEK = 'sek',
  SGD = 'sgd',
  THB = 'thb',
  TRY = 'try',
  TWD = 'twd',
  UAH = 'uah',
  VEF = 'vef',
  VND = 'vnd',
  ZAR = 'zar',
  XDR = 'xdr',
  XAG = 'xag',
  XAU = 'xau',
}

export enum OperationType {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}
