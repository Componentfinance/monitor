import web3 from 'src/provider'

export const ZERO_TOPIC = '0x' + '0'.repeat(64)

export const TRANSFER_TOPIC = web3.utils.sha3('Transfer(address,address,uint256)')
export const TRADE_TOPIC = web3.utils.sha3('Trade(address,address,address,uint256,uint256)')


export const POOLS: {
  address: string
  tokens: string[]
}[] = [
  {
    address: '0xcf76a0cedf50da184fdef08a9d04e6829d7fefdf',
    tokens: [
      '0xdacd011a71f8c9619642bf482f1d4ceb338cffcf',
      '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      '0x55d398326f99059ff775485246999027b3197955',
    ],
  },
]

export const DEPOSIT_EVENT = 'deposit'
export const WITHDRAW_EVENT = 'withdraw'
export const CHECKING_INTERVAL = 60_000
export const TRADE_EVENT = 'trade'
export const APP_STATE_FILENAME = 'app.dat'
