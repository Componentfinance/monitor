import { Log } from 'web3-core/types'
import { DepositWithdrawal } from 'src/types/DepositWithdrawal'
import { TRANSFER_TOPIC } from 'src/constants'
import { Trade } from 'src/types/Trade'
import Web3 from 'web3'

export async function processDeposit(depositEvent: Log, web3Instance: Web3, poolTokens: string[]): Promise<DepositWithdrawal> {
  const poolAddress = depositEvent.address.toLowerCase()
  const user = topicToAddr(depositEvent.topics[2])
  depositEvent.data = depositEvent.data.substr(2)
  const lp = hexToBN(depositEvent.data.substr(0, 64))

  const tokens = {}
  const txHash = depositEvent.transactionHash

  try {
    const receipt = await web3Instance.eth.getTransactionReceipt(txHash)
    receipt.logs.forEach(event => {
      if (_isTokenDeposit(event, depositEvent.topics[2], poolAddress, poolTokens)) {
        tokens[event.address.toLowerCase()] = hexToBN(event.data.substr(2))
      }
    })
  } catch (e) {
    console.error(e)
  }
  return {
    pool: poolAddress,
    user,
    lp,
    tokens,
    txHash,
  }
}

export async function processWithdrawal(withdrawEvent: Log, web3Instance: Web3, poolTokens: string[]): Promise<DepositWithdrawal> {
  const poolAddress = withdrawEvent.address.toLowerCase()
  const user = topicToAddr(withdrawEvent.topics[1])
  withdrawEvent.data = withdrawEvent.data.substr(2)
  const lp = hexToBN(withdrawEvent.data.substr(0, 64))

  const tokens = {}
  const txHash = withdrawEvent.transactionHash

  try {
    const receipt = await web3Instance.eth.getTransactionReceipt(txHash)
    receipt.logs.forEach(event => {
      if (_isTokenWithdraw(event, withdrawEvent.topics[1], poolAddress, poolTokens)) {
        tokens[event.address.toLowerCase()] = hexToBN(event.data.substr(2))
      }
    })
  } catch (e) {
    console.error(e)
  }
  return {
    pool: poolAddress,
    user,
    lp,
    tokens,
    txHash,
  }
}

export function parseTrade(tradeEvent: Log): Trade {
  const pool = tradeEvent.address.toLowerCase()
  const trader = topicToAddr(tradeEvent.topics[1])
  const origin = topicToAddr(tradeEvent.topics[2])
  const target = topicToAddr(tradeEvent.topics[3])
  tradeEvent.data = tradeEvent.data.substr(2)
  const originAmount = hexToBN(tradeEvent.data.substr(0, 64))
  const targetAmount = hexToBN(tradeEvent.data.substr(64, 64))
  const txHash = tradeEvent.transactionHash

  return {
    pool,
    trader,
    origin,
    target,
    originAmount,
    targetAmount,
    txHash,
  }
}

function _isTokenDeposit(event: Log, userTopic: string, pool: string, allowedTokens: string[]) {
  if (!allowedTokens.includes(event.address.toLowerCase())) {
    return false
  }
  if (event.topics[0] !== TRANSFER_TOPIC) {
    return false
  }
  if (event.topics[1] !== userTopic) {
    return false
  }
  return event.topics[2] === addrToTopic(pool);

}

function _isTokenWithdraw(event: Log, userTopic: string, poolAddress: string, allowedTokens: string[]) {
  if (!allowedTokens.includes(event.address.toLowerCase())) {
    return false
  }
  if (event.topics[0] !== TRANSFER_TOPIC) {
    return false
  }
  if (event.topics[1] !== addrToTopic(poolAddress)) {
    return false
  }
  return event.topics[2] === userTopic;

}

export function topicToAddr(topic) {
  return '0x' + topic.substr(26)
}

export function addrToTopic(addr) {
  return '0x' + '0'.repeat(24) + addr.substr(2)
}

export function hexToBN(str) {
  return BigInt('0x' + str)
}

export function formatNumber(x) {
  if (x > 1_000_000) {
    return `${Math.floor(x / 10_000) / 100}M`
  }
  if (x > 1_000) {
    return `${Math.floor(x / 10) / 100}K`
  }
  let y = x.toString()
  const dotIndex = y.indexOf('.')
  if (dotIndex !== -1) {
    let a = y.substr(0, y.indexOf('.'))
    let b = y.substr(y.indexOf('.'))
    return a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + b
  }
  return y.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
