export type OnNewBlockFn = (blockNumber: number) => void | Promise<void>;

export interface ITransaction {
  hash: string;
  transactionIndex: number;
  from: string | null;
  fromBalance?: number;
  to: string | null;
  toBalance?: number;
  value: number;
}

export interface IBalance {
  address: string;
  value: number;
}

export interface IBlockTransactions {
  blockNumber: number;
  transactions: ITransaction[];
}

export interface IProvider {
  subscribe: () => Promise<any>;
  unsubscribe: () => void | Promise<void>;
  onNewBlock: (fn: OnNewBlockFn) => void;
  getBlockNumber: () => Promise<number>;
  getBlockTransactions: (blockNumber: number) => Promise<IBlockTransactions>;
  getBalance: (address: string, blockNumber: number) => Promise<number>;
}
