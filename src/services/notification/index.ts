const TelegramBot = require("node-telegram-bot-api");
import Logger from 'src/logger'
import { DepositWithdrawal } from 'src/types/DepositWithdrawal'
import { lpByAddress, tokenByAddress } from 'src/constants/tokens'
import { formatNumber } from 'src/utils'
import { Trade } from 'src/types/Trade'


export default class NotificationService {
  private readonly bot
  private readonly logger
  private readonly defaultChatId
  private processed

  constructor() {
    this.logger = Logger(NotificationService.name)
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    this.defaultChatId = process.env.TELEGRAM_CHAT_ID
    this.bot = new TelegramBot(botToken, { polling: false });
    this.processed = []
  }

  async notifyDeposit(deposit: DepositWithdrawal) {
    if (!this._preNotify(this.notifyDeposit.name + ' ' +  deposit.txHash)) return
    const lp = lpByAddress(deposit.pool)

    const depositText = Object.keys(deposit.tokens).map(tokenAddress => {
      const token = tokenByAddress(tokenAddress)
      return `\n${formatNumber(displayAssetAmount(deposit.tokens[tokenAddress], tokenAddress))} ${token && token.symbol || 'XYZ'}`
    }).join('')

    const lpAmount = displayAssetAmount(deposit.lp, deposit.pool)
    const donutCount = lpAmount < 1_000 ? 1 : (lpAmount < 5_000 ? 2 : (Math.round(lpAmount / 5_000) + 2))

    if (lpAmount < 1_000) return

    const text = '#deposit_xdai'
      + depositText
      + `\n${formatNumber(lpAmount)} ${lp.symbol} minted ${'🍩'.repeat(donutCount)}`
      + '\n' + `<a href="https://blockscout.com/poa/xdai/tx/${deposit.txHash}">Blockscout</a>`

    this.sendMessage(text)
  }

  async notifyWithdraw(withdrawal: DepositWithdrawal) {
    if (!this._preNotify(this.notifyWithdraw.name + ' ' +  withdrawal.txHash)) return
    const lp = lpByAddress(withdrawal.pool)

    const withdrawalText = Object.keys(withdrawal.tokens).map(tokenAddress => {
      const token = tokenByAddress(tokenAddress)
      return `\n${formatNumber(displayAssetAmount(withdrawal.tokens[tokenAddress], tokenAddress))} ${token && token.symbol || 'XYZ'}`
    }).join('')

    const lpAmount = displayAssetAmount(withdrawal.lp, withdrawal.pool)

    if (lpAmount < 1_000) return

    const text = '#withdrawal_xdai'
      + withdrawalText
      + `\n${formatNumber(lpAmount)} ${lp.symbol} burned`
      + '\n' + `<a href="https://blockscout.com/poa/xdai/tx/${withdrawal.txHash}">Blockscout</a>`

    this.sendMessage(text)
  }

  async notifyTrade(trade: Trade) {
    if (!this._preNotify(this.notifyTrade.name + ' ' +  trade.txHash)) return

    const originAmount = displayAssetAmount(trade.originAmount, trade.origin)
    const originSymbol = tokenByAddress(trade.origin).symbol

    const targetAmount = displayAssetAmount(trade.targetAmount, trade.target)
    const targetSymbol = tokenByAddress(trade.target).symbol

    if (targetAmount < 1_000) return

    const text = '#trade_xdai'
      + `\n${formatNumber(originAmount)} ${originSymbol} -> ${formatNumber(targetAmount)} ${targetSymbol}`
      + `\n<a href="https://blockscout.com/poa/xdai/tx/${trade.txHash}">Blockscout</a>`

    this.sendMessage(text)
  }

  private async sendMessage(text, chatId = this.defaultChatId, form = { parse_mode: 'HTML', disable_web_page_preview: true }) {
    return this.bot.sendMessage(chatId, text, form).catch((e) => {
      this.error('error', e);
    });
  }

  private _preNotify(id: string): boolean {
    if (this.processed.includes(id)) {
      this.log('._preNotify', 'already processed', id)
      return false
    }
    if (this.processed.length >= 100) {
      this.processed = this.processed.slice(90)
    }
    this.processed.push(id)
    return true
  }

  private log(...args) {
    this.logger.info(args)
  }

  private error(...args) {
    this.logger.error(args)
  }
}

function displayAssetAmount(atomic: bigint, address: string): number {
  const decimals = tokenByAddress(address) && tokenByAddress(address).decimals || lpByAddress(address) && lpByAddress(address).decimals || 18
  return  Number(atomic / BigInt(10 ** (decimals - 4))) / 1e4
}