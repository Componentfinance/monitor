import { EventEmitter } from 'events';
import Web3 from 'web3'
import {
  BURN_TOPICS,
  DEPOSIT_EVENT,
  MINT_TOPICS,
  POOLS,
  TRADE_EVENT,
  TRADE_TOPICS,
  WITHDRAW_EVENT,
} from 'src/constants'
import Logger from 'src/logger'
import { processDeposit, parseTrade, processWithdraw } from 'src/utils'

declare interface SynchronizationService {
  on(event: string, listener: Function): this;
  emit(event: string, payload: any): boolean;
}

class SynchronizationService extends EventEmitter {
  private readonly web3: Web3
  private readonly logger

  constructor(web3) {
    super();
    this.web3 = web3
    this.logger = Logger(SynchronizationService.name)
    this.trackEvents()
  }

  private trackEvents() {
    POOLS.forEach(({ address, tokens}) => {
      this.web3.eth.subscribe('logs', {
        address,
        topics: MINT_TOPICS
      }, async (error, log ) =>{
        if (!error) {
          this.emit(DEPOSIT_EVENT, await processDeposit(log, this.web3, tokens))
        }
      })
      this.web3.eth.subscribe('logs', {
        address,
        topics: BURN_TOPICS
      }, async (error, log ) =>{
        if (!error) {
          this.emit(WITHDRAW_EVENT, await processWithdraw(log, this.web3, tokens))
        }
      })
      this.web3.eth.subscribe('logs', {
        address,
        topics: TRADE_TOPICS
      }, async (error, log ) =>{
        if (!error) {
          this.emit(TRADE_EVENT, parseTrade(log))
        }
      })
    });
  }
}

export default SynchronizationService
