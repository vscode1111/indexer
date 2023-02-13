import { DataSource, DataSourceOptions, EntityManager } from "typeorm";
import { Transaction } from "./entities/Transaction";
import { Block } from "./entities/Block";
import { createDatabase } from "typeorm-extension";
import { IBlockTransactions } from "../providers/types";
import { IGap, IDataStorageStats } from "./dataStorage.types";
import { IInitialize } from "../types/common";
import { SpeedCounter } from "../core/speedCounter";
import { Balance } from "./entities/Balance";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export class DataStorage implements IInitialize {
  private dataSource: DataSource;
  private dataSourceOptions: PostgresConnectionOptions;
  private blockSpeedCounter: SpeedCounter;
  private transactionSpeedCounter: SpeedCounter;
  private balanceSpeedCounter: SpeedCounter;
  private statsData: IDataStorageStats;

  constructor(options?: Partial<PostgresConnectionOptions>) {
    this.dataSourceOptions = {
      ...options,
      type: "postgres",
      synchronize: true,
      logging: false,
      entities: [Block, Transaction, Balance],
      migrations: [],
      subscribers: [],
    };

    this.dataSource = new DataSource(this.dataSourceOptions);

    this.blockSpeedCounter = new SpeedCounter();
    this.transactionSpeedCounter = new SpeedCounter();
    this.balanceSpeedCounter = new SpeedCounter();
    this.statsData = {
      blockCount: 0,
      blockSpeed: 0,
      transactionCount: 0,
      transactionSpeed: 0,
      balanceCount: 0,
      balanceSpeed: 0,
    };
  }

  async init(): Promise<void> {
    console.log(`Connecting to database...`);
    await createDatabase({ options: this.dataSourceOptions, ifNotExist: true });
    await this.dataSource.initialize();
  }

  async saveBalance(
    address: string,
    value: number,
    block: Block,
    transactionalEntityManager: EntityManager,
  ) {
    const balance = new Balance();
    balance.block = block;
    balance.address = address;
    balance.value = value;
    await transactionalEntityManager.save(balance);
  }

  async saveBlockTransactions(data: IBlockTransactions): Promise<void> {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const block = new Block();
      block.blockNumber = data.blockNumber;
      await transactionalEntityManager.save(block);

      for (const tr of data.transactions) {
        const transaction = new Transaction();
        transaction.block = block;
        transaction.hash = tr.hash;
        transaction.transactionIndex = tr.transactionIndex;
        transaction.from = tr.from;
        transaction.to = tr.to;
        transaction.value = tr.value;
        await transactionalEntityManager.save(transaction);

        if (transaction.value > 0) {
          if (tr.from !== null && tr.fromBalance !== undefined) {
            await this.saveBalance(tr.from, tr.fromBalance, block, transactionalEntityManager);
          }

          if (tr.to !== null && tr.toBalance !== undefined) {
            await this.saveBalance(tr.to, tr.toBalance, block, transactionalEntityManager);
          }
        }
      }
    });
  }

  async findGaps(): Promise<IGap[]> {
    return this.dataSource.query(`
      select prevId, "blockNumber" nextId from (
        select "blockNumber", lag("blockNumber", 1) over (order by "blockNumber") as prevId from block
        ) list
      where "blockNumber" - prevId > 1
      limit 50;
    `);
  }

  async blockCount(): Promise<number> {
    return this.dataSource.createQueryBuilder(Block, "block").getCount();
  }

  async transactionCount(): Promise<number> {
    return this.dataSource.createQueryBuilder(Transaction, "transaction").getCount();
  }

  async balanceCount(): Promise<number> {
    return this.dataSource.createQueryBuilder(Balance, "balance").getCount();
  }

  async fetchTransactionByAddress(address: string): Promise<Transaction[]> {
    return this.dataSource
      .createQueryBuilder(Transaction, "transaction")
      .select("*")
      .where('"from" = :address or "to" = :address', { address })
      .orderBy("transaction.blockNumber", "ASC")
      .addOrderBy("transaction.transactionIndex", "ASC")
      .getRawMany();
  }

  async getTransactionCountByAddress(address: string): Promise<number> {
    return this.dataSource
      .createQueryBuilder(Transaction, "transaction")
      .select("*")
      .where('"from" = :address or "to" = :address', { address })
      .getCount();
  }

  async fetchTopValueTransactions(): Promise<Transaction[]> {
    return this.dataSource
      .createQueryBuilder(Transaction, "transaction")
      .select("*")
      .where('"value" > 0')
      .addOrderBy("transaction.value", "DESC")
      .limit(1000)
      .getRawMany();
  }

  async fetchTopValueBalances(): Promise<Transaction[]> {
    // return this.dataSource
    //   .createQueryBuilder(Balance, "balance")
    //   .select("*")
    //   .where('"value" > 0')
    //   .addOrderBy("balance.value", "DESC")
    //   .limit(100)
    //   .getRawMany();
    return this.dataSource.query(`
      select gr.address, gr.blockNumber, b.value, b."createdAt", b."updatedAt" from (
        select address, max("blockNumber") blockNumber from balance
        group by address
      ) gr
      left join balance b on gr.address=b.address and gr.blockNumber=b."blockNumber"
      order by b.value desc
      limit 100;
    `);
  }

  async stats(): Promise<void> {
    this.statsData.blockCount = await this.blockCount();
    this.blockSpeedCounter.store(this.statsData.blockCount);
    this.statsData.blockSpeed = this.blockSpeedCounter.stats().speed;

    this.statsData.transactionCount = await this.transactionCount();
    this.transactionSpeedCounter.store(this.statsData.transactionCount);
    this.statsData.transactionSpeed = this.transactionSpeedCounter.stats().speed;

    this.statsData.balanceCount = await this.balanceCount();
    this.balanceSpeedCounter.store(this.statsData.balanceCount);
    this.statsData.balanceSpeed = this.balanceSpeedCounter.stats().speed;
  }

  getStats(): IDataStorageStats {
    return this.statsData;
  }
}
