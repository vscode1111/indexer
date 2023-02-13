import { ethers } from "ethers";
import { toNumber } from "../utils/converts";
import { IProvider, IBlockTransactions, OnNewBlockFn, ITransaction } from "./types";
import { getNullTransactionText } from "./utils";

export class EvmProvider implements IProvider {
  private rpcUrl: string;
  private provider: ethers.providers.JsonRpcProvider;
  private onNewBlockFn: OnNewBlockFn | undefined;

  constructor() {
    this.rpcUrl = "https://rpc.ankr.com/avalanche";
    // this.rpcUrl = "https://avalanche-mainnet.infura.io/v3/1ec00a3205f14397a8c259f2e0b908df";
    this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
  }

  onNewBlock(fn: OnNewBlockFn) {
    this.onNewBlockFn = fn;
  }

  async subscribe() {
    this.provider.on("block", async (blockNumber: number) => {
      if (blockNumber !== undefined && this.onNewBlockFn) {
        await this.onNewBlockFn(blockNumber);
      }
    });
  }

  unsubscribe() {
    this.provider.off("block");
  }

  async getBlockNumber() {
    return this.provider.getBlockNumber();
  }

  async getBlockTransactions(blockNumber: number) {
    const block = await this.provider.getBlock(blockNumber);

    const rawTransactions = await Promise.all(
      block.transactions.map(async (tr) => {
        const response = await this.provider.getTransaction(tr);
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
      blockNumber: block.number,
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
          value: toNumber(raw.value),
        } as ITransaction;
      }),
    };
  }

  async getBalance(address: string, blockNumber: number): Promise<number> {
    const response = await this.provider.getBalance(address, blockNumber);
    return toNumber(response);
  }
}
