import chalk from "chalk";
import { DataStorage } from "../db/dataStorage";
import { getFlattenGaps } from "../db/utils";
import { IProvider } from "../providers/types";
import { IInitialize } from "../types/common";
import { printError } from "../utils/misc";
import { MultiSet } from "./myltiSet";
import { SpeedCounter } from "./speedCounter";
import { ISyncEngineConfig, ISyncEngineStats } from "./syncEngine.types";

const ONLINE_SYNC = true;
const SYNC = true;

export class SyncEngine implements IInitialize {
  private provider: IProvider;
  private dataStorage: DataStorage;
  private multiSet: MultiSet<number>;
  private unsyncSpeedCounter: SpeedCounter;
  private statsData: ISyncEngineStats;

  constructor(private config: ISyncEngineConfig) {
    this.provider = config.provider;
    this.dataStorage = config.dataStorage;
    this.multiSet = new MultiSet<number>(config.threadCount);
    this.unsyncSpeedCounter = new SpeedCounter();
    this.statsData = { errorCount: 0 };
  }

  async init() {
    if (ONLINE_SYNC) {
      this.provider.subscribe();
      this.provider.onNewBlock(async (blockNumber) => {
        const currentBlockNumber = blockNumber - this.config.onlineOffset;
        await this.tryToStore(currentBlockNumber);
      });
    }

    const blockCount = await this.dataStorage.blockCount();
    console.log(`We have ${blockCount} blocks in database`);
    if (blockCount < this.config.minBlocCount) {
      const lastBlock = await this.provider.getBlockNumber();
      await this.tryToStore(lastBlock - this.config.minBlocCount);
      await this.sync();
    }
  }

  private async tryToStore(blockNumber: number, type: "online" | "sync" = "online", attempts = 3) {
    try {
      const blockTransactions = await this.provider.getBlockTransactions(blockNumber);
      await this.dataStorage.saveBlockTransactions(blockTransactions);
      if (type === "online") {
        console.log(
          chalk.green(
            `${type}: stored block ${blockTransactions.blockNumber} with ${blockTransactions.transactions.length} transactions`,
          ),
        );
      }
    } catch (e) {
      this.statsData.errorCount++;
      console.log(`Error #${this.statsData.errorCount}: ${printError(e)}`);
      if (attempts > 0) {
        console.log(`${attempts} attempts left to get transactions from block ${blockNumber}`);
        await this.tryToStore(blockNumber, type, attempts - 1);
      } else {
        console.log(`Couldn't store block ${blockNumber}`);
      }
    }
  }

  public async sync() {
    try {
      if (!SYNC) {
        return;
      }

      const totalLenght = this.multiSet.totalLenght();

      if (totalLenght > 0) {
        this.unsyncSpeedCounter.store(totalLenght);
        const stats = this.unsyncSpeedCounter.stats();
        console.log(
          chalk.blue(
            `Sync stats: ${totalLenght} b, ${
              stats.counterDiff
            } b, ${stats.speed.toFixed()} b/s, [${this.multiSet.lenghts()}]`,
          ),
        );

        return;
      }

      const gaps = await this.dataStorage.findGaps();
      const flattenGaps = getFlattenGaps(gaps);
      const unsyncBlocks = flattenGaps.length;
      if (unsyncBlocks > 0) {
        console.log(chalk.red(`Found ${unsyncBlocks} unsync blocks`));

        for (const flattenGap of flattenGaps) {
          this.multiSet.add(flattenGap);
        }

        for (let i = 0; i < this.config.threadCount; i++) {
          this.syncBlock(i);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async syncBlock(index: number) {
    if (this.multiSet.lenght(index) === 0) {
      return;
    }

    const blockNumber = this.multiSet.getValue(index);
    if (blockNumber === undefined) {
      return;
    }
    await this.tryToStore(blockNumber, "sync");
    this.multiSet.deleteValue(index);
    await this.syncBlock(index);
  }

  getStats(): ISyncEngineStats {
    return this.statsData;
  }
}
