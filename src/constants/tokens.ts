const tokens = {
  '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': {
    symbol: 'USDC',
    decimals: 18,
  },
  '0xdacd011a71f8c9619642bf482f1d4ceb338cffcf': {
    symbol: 'USDP',
    decimals: 18,
  },
  '0x55d398326f99059ff775485246999027b3197955': {
    symbol: 'USDT',
    decimals: 18,
  },
  '0xe9e7cea3dedca5984780bafc599bd69add087d56': {
    symbol: 'BUSD',
    decimals: 18,
  }
}

const lps = {
  '0xcf76a0cedf50da184fdef08a9d04e6829d7fefdf': {
    symbol: 'CMP-LP',
    decimals: 18,
  },
  '0x3bb6bf6ecbc71f8f78d1eec9c91de4f8fd5c891c': {
    symbol: 'CMP-LP',
    decimals: 18,
  }
}

export function lpByAddress(address) {
  return lps[address.toLowerCase()]
}

export function tokenByAddress(address) {
  return tokens[address.toLowerCase()]
}
