export interface IGap {
  previd: number;
  nextid: number;
}

export interface IDataStorageStats {
  blockCount: number;
  blockSpeed: number;
  transactionCount: number;
  transactionSpeed: number;
  balanceCount: number;
  balanceSpeed: number;
}
