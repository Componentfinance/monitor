import { EventEmitter } from 'events';
import Web3 from 'web3'
import fs from 'fs'
import {
  DEPOSIT_EVENT,
  POOLS,
  TRADE_EVENT,
  WITHDRAW_EVENT,
  BLOCKTIME,
  TRANSFER_TOPIC,
  ZERO_TOPIC,
  TRADE_TOPIC, APP_STATE_FILENAME,
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

    try {
      const lastBlockData = fs.readFileSync(APP_STATE_FILENAME, 'utf8');
      this.lastProcessedBlock = +JSON.parse(lastBlockData).lastProcessedBlock
      this.log(`Loaded last synced block: ${this.lastProcessedBlock}`)

    } catch (e) {

      console.log(e)
      try {
        this.lastProcessedBlock = await this.web3.eth.getBlockNumber()
        this.log(`RPC now at ${this.lastProcessedBlock} block`)
      } catch (e) {
        this.logError('web3 RPC is unreachable', e)
        process.exit()
      }

    }

    while (true) {
      try {
        const nextBlock = await this.waitForTheNextBlock()
        await this.loadEvents(nextBlock)
      } catch (e) {
        this.logError(e)
      }
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
          this.logError(`${log.transactionHash} unexpected topics ${log.topics}`)
        }

      }


    }

    this.setProcessedBlock(toBlock)

  }

  private setProcessedBlock(block) {
    this.lastProcessedBlock = block
    try {
      fs.writeFileSync(APP_STATE_FILENAME, JSON.stringify(this.getAppState()))
    } catch (e) {
      this.logError(e)
    }
    this.log(`Synchronized to block ${this.lastProcessedBlock}`)
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
    return topics[1] === ZERO_TOPIC;

  }

  private static isBurn(topics: string[]) {
    if (topics.length !== 3) {
      return false
    }
    if (topics[0] !== TRANSFER_TOPIC) {
      return false
        }
    return topics[2] === ZERO_TOPIC;

  }

  private static isTrade(topics: string[]) {
    if (topics.length !== 4) {
      return false
    }
    return topics[0] === TRADE_TOPIC;

  }

  private getAppState() {
    return { lastProcessedBlock: this.lastProcessedBlock }
  }

  private log(...args) {
    this.logger.info(args)
  }

  private logError(...args) {
    this.logger.error(args)
  }
}

export default SynchronizationService
