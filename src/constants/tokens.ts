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
  '0x6b175474e89094c44da98b954eedeac495271d0f': {
    symbol: 'DAI',
    decimals: 18,
  },
  '0x57ab1ec28d129707052df4df418d58a2d46d5f51': {
    symbol: 'sUSD',
    decimals: 18,
  },
  '0xfe7ed09c4956f7cdb54ec4ffcb9818db2d7025b8': {
    symbol: 'USDP',
    decimals: 18,
  },
  '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d': {
    symbol: 'WXDAI',
    decimals: 18,
  },
  '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83': {
    symbol: 'USDC',
    decimals: 6,
  },
}

const lps = {
  '0x49519631b404e06ca79c9c7b0dc91648d86f08db': {
    symbol: 'CMP-LP',
    decimals: 18,
  },
  '0x6477960dd932d29518d7e8087d5ea3d11e606068': {
    symbol: 'CMP-LP',
    decimals: 18,
  },
  '0x53de001bbfae8cecbbd6245817512f8dbd8eef18': {
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
