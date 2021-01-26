export type Trade = {
  pool: string,
  trader: string,
  origin: string,
  target: string,
  originAmount: bigint,
  targetAmount: bigint,
  txHash: string,
}
