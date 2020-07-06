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

// Helper function to map over stuff
const toAutoCompleteOptions = (m) => (k) => {
  return {
    value: m[k],
    label: m[k],
  }
}

export const AssetOptionsAutoComplete = Object.keys(Assets).map(
  toAutoCompleteOptions(Assets)
)

// ---- Aave ----

export const AaveAddresses = {
  LendingPoolAddressProvider: '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8',
  LendingPool: '0x398ec7346dcd622edc5ae82352f02be94c62d119',
  LendingPoolCore: '0x3dfd23a6c5e8bbcfc9581d2e864a68feb6a076d3',
}

export enum AaveAAssets {
  aETH = 'aETH',
  aDAI = 'aDAI',
  aUSDC = 'aUSDC',
  aSUSD = 'aSUSD',
  aTUSD = 'aTUSD',
  aUSDT = 'aUSDT',
  aBUSD = 'aBUSD',
  aBAT = 'aBAT',
  aKNC = 'aKNC',
  aLEND = 'aLEND',
  aLINK = 'aLINK',
  aMANA = 'aMANA',
  aMKR = 'aMKR',
  aREP = 'aREP',
  aSNX = 'aSNX',
  aWBTC = 'aWBTC',
  aZRX = 'aZRX',
}

export const AaveAssets = [
  Assets.ETH,
  Assets.USDC,
  Assets.TUSD,
  Assets.USDT,
  Assets.sUSD,
  Assets.BUSD,
  Assets.LEND,
  Assets.BAT,
  Assets.KNC,
  Assets.LINK,
  Assets.MANA,
  Assets.MKR,
  Assets.REP,
  Assets.SNX,
  Assets.WBTC,
  Assets.ZRX,
  Assets.DAI,
]

export const AaveAssetsOptionsAutoComplete = AaveAssets.map(
  toAutoCompleteOptions(Assets)
)

// ---- Compound ----

export const CompoundAddresses = {
  Comptroller: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b',
}

export enum CompoundCAssets {
  cETH = 'cETH',
  cBAT = 'cBAT',
  cUSDC = 'cUSDC',
  cUSDT = 'cUSDT',
  cDAI = 'cDAI',
  cWBTC = 'cWBTC',
  cREP = 'cREP',
  cZRX = 'cZRX',
}

export const CompoundAssets = [
  Assets.ETH,
  Assets.BAT,
  Assets.USDC,
  Assets.USDT,
  Assets.DAI,
  Assets.WBTC,
  Assets.REP,
  Assets.ZRX,
]

export const CompoundAssetsOptionsAutoComplete = CompoundAssets.map(
  toAutoCompleteOptions(Assets)
)

// ---- Mappings ---- //

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
  [CompoundCAssets.cETH]: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
  [CompoundCAssets.cBAT]: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e',
  [CompoundCAssets.cUSDC]: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
  [CompoundCAssets.cUSDT]: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
  [CompoundCAssets.cDAI]: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
  [CompoundCAssets.cWBTC]: '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4',
  [CompoundCAssets.cREP]: '0x158079ee67fce2f58472a96584a73c7ab9ac95c1',
  [CompoundCAssets.cZRX]: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
  [AaveAAssets.aETH]: '0x3a3A65aAb0dd2A17E3F1947bA16138cd37d08c04',
  [AaveAAssets.aDAI]: '0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d',
  [AaveAAssets.aUSDC]: '0x9bA00D6856a4eDF4665BcA2C2309936572473B7E',
  [AaveAAssets.aSUSD]: '0x625aE63000f46200499120B906716420bd059240',
  [AaveAAssets.aTUSD]: '0x4DA9b813057D04BAef4e5800E36083717b4a0341',
  [AaveAAssets.aUSDT]: '0x71fc860F7D3A592A4a98740e39dB31d25db65ae8',
  [AaveAAssets.aBUSD]: '0x6Ee0f7BB50a54AB5253dA0667B0Dc2ee526C30a8',
  [AaveAAssets.aBAT]: '0xE1BA0FB44CCb0D11b80F92f4f8Ed94CA3fF51D00',
  [AaveAAssets.aKNC]: '0x9D91BE44C06d373a8a226E1f3b146956083803eB',
  [AaveAAssets.aLEND]: '0x7D2D3688Df45Ce7C552E19c27e007673da9204B8',
  [AaveAAssets.aLINK]: '0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84',
  [AaveAAssets.aMANA]: '0x6FCE4A401B6B80ACe52baAefE4421Bd188e76F6f',
  [AaveAAssets.aMKR]: '0x7deB5e830be29F91E298ba5FF1356BB7f8146998',
  [AaveAAssets.aREP]: '0x71010A9D003445aC60C4e6A7017c1E89A477B438',
  [AaveAAssets.aSNX]: '0x328C4c80BC7aCa0834Db37e6600A6c49E12Da4DE',
  [AaveAAssets.aWBTC]: '0xFC4B8ED459e00e5400be803A9BB3954234FD50e3',
  [AaveAAssets.aZRX]: '0x6Fb0855c404E09c47C3fBCA25f08d4E41f9F062f',
}

export const CTokenMapping = {
  [Assets.ETH]: [CompoundCAssets.cETH],
  [Assets.USDC]: [CompoundCAssets.cUSDC],
  [Assets.USDT]: [CompoundCAssets.cUSDT],
  [Assets.DAI]: [CompoundCAssets.cDAI],
  [Assets.WBTC]: [CompoundCAssets.cWBTC],
  [Assets.BAT]: [CompoundCAssets.cBAT],
  [Assets.REP]: [CompoundCAssets.cREP],
  [Assets.ZRX]: [CompoundCAssets.cZRX],
}

export const CTokenReverseMapping = Object.keys(CTokenMapping)
  .map((k) => {
    return {
      [CTokenMapping[k]]: k,
    }
  })
  .reduce((acc, x) => {
    return { ...acc, ...x }
  }, {})

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
  [CompoundCAssets.cETH]: 8,
  [CompoundCAssets.cBAT]: 8,
  [CompoundCAssets.cUSDC]: 8,
  [CompoundCAssets.cUSDT]: 8,
  [CompoundCAssets.cDAI]: 8,
  [CompoundCAssets.cWBTC]: 8,
  [CompoundCAssets.cREP]: 8,
  [CompoundCAssets.cZRX]: 8,
  [AaveAAssets.aETH]: 18,
  [AaveAAssets.aDAI]: 18,
  [AaveAAssets.aUSDC]: 18,
  [AaveAAssets.aSUSD]: 18,
  [AaveAAssets.aTUSD]: 18,
  [AaveAAssets.aUSDT]: 18,
  [AaveAAssets.aBUSD]: 18,
  [AaveAAssets.aBAT]: 18,
  [AaveAAssets.aKNC]: 18,
  [AaveAAssets.aLEND]: 18,
  [AaveAAssets.aLINK]: 18,
  [AaveAAssets.aMANA]: 18,
  [AaveAAssets.aMKR]: 18,
  [AaveAAssets.aREP]: 18,
  [AaveAAssets.aSNX]: 18,
  [AaveAAssets.aWBTC]: 18,
  [AaveAAssets.aZRX]: 18,
}

// ---- Uniswap V2 ----

export const UniswapV2Addresses = {
  RouterV2: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
}

export const AllAssets = Object.keys(AddressMapping).map((x) => {
  return {
    label: x,
    value: x,
  }
})

// ---- Coin Gecko ----

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
  [CompoundCAssets.cETH]: 'compound-ether',
  [CompoundCAssets.cBAT]: 'compound-basic-attention-token',
  [CompoundCAssets.cUSDC]: 'compound-usd-coin',
  [CompoundCAssets.cUSDT]: 'compound-usdt',
  [CompoundCAssets.cDAI]: 'cdai',
  [CompoundCAssets.cWBTC]: 'compound-wrapped-btc',
  [CompoundCAssets.cREP]: 'compound-augur',
  [CompoundCAssets.cZRX]: 'compound-0x',
  [AaveAAssets.aETH]: 'aave-eth',
  [AaveAAssets.aDAI]: 'aave-dai',
  [AaveAAssets.aUSDC]: 'aave-usdc',
  [AaveAAssets.aSUSD]: 'aave-susd',
  [AaveAAssets.aTUSD]: 'aave-tusd',
  [AaveAAssets.aUSDT]: 'aave-usdt',
  [AaveAAssets.aBUSD]: 'aave-busd',
  [AaveAAssets.aBAT]: 'aave-bat',
  [AaveAAssets.aKNC]: 'aave-knc',
  [AaveAAssets.aLEND]: 'aave-lend',
  [AaveAAssets.aLINK]: 'aave-link',
  [AaveAAssets.aMANA]: 'aave-mana',
  [AaveAAssets.aMKR]: 'aave-mkr',
  [AaveAAssets.aREP]: 'aave-rep',
  [AaveAAssets.aSNX]: 'aave-snx',
  [AaveAAssets.aWBTC]: 'aave-wbtc',
  [AaveAAssets.aZRX]: 'aave-zrx',
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
