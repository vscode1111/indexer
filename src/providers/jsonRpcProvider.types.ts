export interface IJsonRpcResponseBase<T = string> {
  jsonrpc: string;
  id: string;
  result: T;
}

export interface ITransactionResult {
  blockHash: string;
  blockNumber: string;
  from: string | null;
  gas: string;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  hash: string;
  input: string;
  nonce: string;
  to: string | null;
  transactionIndex: string;
  value: string;
  type: string;
  accessList: any[];
  chainId: string;
  v: string;
  r: string;
  s: string;
}
