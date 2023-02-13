import axios from "axios";
import { Index } from "typeorm";
import WebSocket from "ws";
import { toHex, toNumberFromHex } from "../utils/converts";
import { IJsonRpcResponseBase, ITransactionResult } from "./jsonRpcProvider.types";
import { IProvider, ITransaction, OnNewBlockFn } from "./types";
import { getNullTransactionText } from "./utils";

function getRequestBody(method: string, params: string[] = []) {
  return {
    jsonrpc: "2.0",
    method,
    params,
    id: "1",
  };
}

export class JsonRpcProvider implements IProvider {
  private rpcUrl: string;
  private wsUrl: string;
  private client: WebSocket | undefined;
  private onNewBlockFn: OnNewBlockFn | undefined;

  constructor() {
    this.rpcUrl = "https://api.avax.network/ext/bc/C/rpc";
    this.wsUrl = "wss://api.avax.network/ext/bc/C/ws";
  }

  onNewBlock(fn: OnNewBlockFn) {
    this.onNewBlockFn = fn;
  }

  async subscribe() {
    this.client = new WebSocket(this.wsUrl);

    return new Promise((resolve, reject) => {
      if (!this.client) {
        reject();
        return;
      }

      this.client.on("open", () => {
        this.client?.send(JSON.stringify(getRequestBody("eth_subscribe", ["newHeads"])));
        resolve(0);
      });

      this.client.on("message", async (message) => {
        const data = JSON.parse(message.toString());
        const number = data?.params?.result?.number;
        if (number && this.onNewBlockFn) {
          await this.onNewBlockFn(parseInt(number));
        }
      });
    });
  }

  unsubscribe() {
    if (this.client?.readyState === 1) {
      this.client.close();
    }
  }

  async getBlockNumber() {
    const response = await axios.post(this.rpcUrl, getRequestBody("eth_blockNumber"));
    return parseInt(response.data.result);
  }

  private async getBlockTransactionCountByNumber(blockNumber: number) {
    const response = await axios.post<IJsonRpcResponseBase>(
      this.rpcUrl,
      getRequestBody("eth_getBlockTransactionCountByNumber", [toHex(blockNumber)]),
    );
    return parseInt(response.data.result);
  }

  private async getTransactionByBlockNumberAndIndex(blockNumber: number, transactionIndex: number) {
    const response = await axios.post<IJsonRpcResponseBase<ITransactionResult>>(
      this.rpcUrl,
      getRequestBody("eth_getTransactionByBlockNumberAndIndex", [
        toHex(blockNumber),
        toHex(transactionIndex),
      ]),
    );
    return response.data.result;
  }

  async getBlockTransactions(blockNumber: number) {
    const transactionCount = await this.getBlockTransactionCountByNumber(blockNumber);

    const transactionPromises: Promise<ITransactionResult>[] = [];

    for (let i = 0; i < transactionCount; i++) {
      transactionPromises.push(this.getTransactionByBlockNumberAndIndex(blockNumber, i));
    }

    const rawTransactions = await Promise.all(
      transactionPromises.map(async (tr, index) => {
        const response = await tr;
        if (!response) {
          throw Error(getNullTransactionText(blockNumber, index));
        }

        let fromBalance;
        if (typeof response.from === "string") {
          fromBalance = await this.getBalance(response.from, blockNumber);
        }
        let toBalance;
        if (typeof response.to === "string") {
          toBalance = await this.getBalance(response.to, blockNumber);
        }

        return { ...response, fromBalance, toBalance };
      }),
    );

    return {
      blockNumber,
      transactions: rawTransactions.map((raw, index) => {
        if (!raw) {
          throw Error(getNullTransactionText(blockNumber, index));
        }

        return {
          hash: raw.hash,
          transactionIndex: index,
          from: raw.from?.toLowerCase() ?? null,
          fromBalance: raw.fromBalance,
          to: raw.to?.toLowerCase() ?? null,
          toBalance: raw.toBalance,
          value: toNumberFromHex(raw.value),
        } as ITransaction;
      }),
    };
  }

  async getBalance(address: string, blockNumber: number): Promise<number> {
    const response = await axios.post<IJsonRpcResponseBase>(
      this.rpcUrl,
      getRequestBody("eth_getBalance", [address, toHex(blockNumber)]),
    );

    return toNumberFromHex(response.data.result);
  }
}
