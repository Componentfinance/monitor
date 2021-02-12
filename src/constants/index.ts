import web3 from 'src/provider'

export const ZERO_TOPIC = '0x' + '0'.repeat(64)

export const TRANSFER_TOPIC = web3.utils.sha3('Transfer(address,address,uint256)')
export const MINT_TOPICS = [TRANSFER_TOPIC, ZERO_TOPIC]
export const BURN_TOPICS = [TRANSFER_TOPIC, [], ZERO_TOPIC]
export const TRADE_TOPIC = web3.utils.sha3('Trade(address,address,address,uint256,uint256)')


export const POOLS: {
  address: string
  tokens: string[]
}[] = [
  {
    address: '0x53de001bbfae8cecbbd6245817512f8dbd8eef18',
    tokens: [
      '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
      '0xfe7ed09c4956f7cdb54ec4ffcb9818db2d7025b8',
      '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
    ],
  },
]

export const DEPOSIT_EVENT = 'deposit'
export const WITHDRAW_EVENT = 'withdraw'
export const BLOCKTIME = 5000
export const TRADE_EVENT = 'trade'
