import { EventEmitter } from 'events';
import Web3 from 'web3'
import {
  DEPOSIT_EVENT,
  POOLS,
  TRADE_EVENT,
  WITHDRAW_EVENT,
  BLOCKTIME, TRANSFER_TOPIC, ZERO_TOPIC, TRADE_TOPIC,
} from 'src/constants'
import Logger from 'src/logger'
import { processDeposit, parseTrade, processWithdrawal } from 'src/utils'

declare interface SynchronizationService {
  on(event: string, listener: Function): this;
  emit(event: string, payload: any): boolean;
}

class SynchronizationService extends EventEmitter {
  private readonly web3: Web3
  private readonly logger
  private lastProcessedBlock: number

  constructor(web3) {
    super();
    this.web3 = web3
    this.logger = Logger(SynchronizationService.name)
    this.trackEvents()
  }

  private async trackEvents() {
    this.lastProcessedBlock = await this.web3.eth.getBlockNumber()

    while (true) {
      const nextBlock = await this.waitForTheNextBlock()
      await this.loadEvents(nextBlock)
    }

  }

  private async loadEvents(toBlock) {

    for (const { address, tokens } of POOLS) {

      const logs = await this.web3.eth.getPastLogs({
        address,
        fromBlock: this.lastProcessedBlock,
        toBlock: toBlock,
      })

      for (const log of logs) {

        if (SynchronizationService.isMint(log.topics)) {
          this.emit(DEPOSIT_EVENT, await processDeposit(log, this.web3, tokens))
        } else if (SynchronizationService.isBurn(log.topics)) {
          this.emit(WITHDRAW_EVENT, await processWithdrawal(log, this.web3, tokens))
        } else if (SynchronizationService.isTrade(log.topics)) {
          this.emit(TRADE_EVENT, parseTrade(log))
        } else {
          console.error(`${log.transactionHash} unexpected topics ${log.topics}`)
        }

      }

    }

    this.lastProcessedBlock = toBlock

  }

  private async waitForTheNextBlock(): Promise<number> {
    await (new Promise(resolve => setTimeout(resolve, BLOCKTIME)))
    const block = await this.web3.eth.getBlockNumber()
    if (block > this.lastProcessedBlock) {
      return block
    } else {
      return this.waitForTheNextBlock()
    }
  }

  private static isMint(topics: string[]) {
    if (topics.length !== 3) {
      return false
    }
    if (topics[0] !== TRANSFER_TOPIC) {
      return false
    }
    if (topics[1] !== ZERO_TOPIC) {
      return false
    }
    return true
  }

  private static isBurn(topics: string[]) {
    if (topics.length !== 3) {
      return false
    }
    if (topics[0] !== TRANSFER_TOPIC) {
      return false
    }
    if (topics[2] !== ZERO_TOPIC) {
      return false
    }
    return true
  }

  private static isTrade(topics: string[]) {
    if (topics.length !== 4) {
      return false
    }
    if (topics[0] !== TRADE_TOPIC) {
      return false
    }
    return true
  }
}

export default SynchronizationService
