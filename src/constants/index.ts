import web3 from 'src/provider'

export const ZERO_TOPIC = '0x' + '0'.repeat(64)

export const MINT_TOPICS = [web3.utils.sha3('Transfer(address,address,uint256)'), ZERO_TOPIC]
export const BURN_TOPICS = [web3.utils.sha3('Transfer(address,address,uint256)'), [], ZERO_TOPIC]
export const TRADE_TOPICS = [web3.utils.sha3('Trade(address,address,address,uint256,uint256)')]

export const TRANSFER_TOPIC = web3.utils.sha3('Transfer(address,address,uint256)')

export const POOLS: {
  address: string
  tokens: string[]
}[] = [
  {
    address: '0x49519631b404e06ca79c9c7b0dc91648d86f08db',
    tokens: [
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '0x1456688345527be1f37e9e627da0837d6f08c925',
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
    ],
  },
  {
    address: '0x6477960dd932d29518d7e8087d5ea3d11e606068',
    tokens: [
      '0x1456688345527be1f37e9e627da0837d6f08c925',
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
    ],
  },
]

export const DEPOSIT_EVENT = 'deposit'
export const WITHDRAW_EVENT = 'withdraw'
export const TRADE_EVENT = 'trade'
