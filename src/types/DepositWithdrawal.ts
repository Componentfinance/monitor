export type DepositWithdrawal = {
  pool: string,
  user: string,
  lp: bigint,
  tokens: {
    [token: string]: bigint
  },
  txHash: string,
}
