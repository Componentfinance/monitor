const tokens = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
    symbol: 'USDC',
    decimals: 6,
  },
  '0x1456688345527be1f37e9e627da0837d6f08c925': {
    symbol: 'USDP',
    decimals: 18,
  },
  '0xdac17f958d2ee523a2206206994597c13d831ec7': {
    symbol: 'USDT',
    decimals: 6,
  },
}

const lps = {
  '0x49519631b404e06ca79c9c7b0dc91648d86f08db': {
    symbol: 'CMP-LP',
    decimals: 18,
  },
}

export function lpByAddress(address) {
  return lps[address.toLowerCase()]
}

export function tokenByAddress(address) {
  return tokens[address.toLowerCase()]
}
