import 'module-alias/register'
import SynchronizationService from 'src/services/synchronization'
import NotificationService from 'src/services/notification'
import {
  DEPOSIT_EVENT, TRADE_EVENT, WITHDRAW_EVENT,

} from 'src/constants'
import web3 from 'src/provider'
import { DepositWithdrawal } from 'src/types/DepositWithdrawal'
import { Trade } from 'src/types/Trade'


class LiquidationMachine {
  private readonly synchronizer: SynchronizationService
  private readonly notificator: NotificationService

  constructor() {
    this.synchronizer = new SynchronizationService(web3)
    this.notificator = new NotificationService()


    this.synchronizer.on(DEPOSIT_EVENT, (deposit: DepositWithdrawal) => {
      this.notificator.notifyDeposit(deposit)
    })

    this.synchronizer.on(WITHDRAW_EVENT, (withdraw: DepositWithdrawal) => {
      this.notificator.notifyWithdraw(withdraw)
    })

    this.synchronizer.on(TRADE_EVENT, (trade: Trade) => {
      this.notificator.notifyTrade(trade)
    })
  }
}

new LiquidationMachine()
