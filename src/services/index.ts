import { createProvider } from "../providers";
import { SyncEngine } from "../core/syncEngine";
import { IProvider } from "../providers/types";
import { DataStorage } from "../db/dataStorage";
import { IInitialize } from "../types/common";
import { config } from "../config";

export class Services implements IInitialize {
  public provider: IProvider;
  public syncEngine!: SyncEngine;
  public dataStorage!: DataStorage;

  constructor() {
    this.provider = createProvider("rpc");
    this.dataStorage = new DataStorage({
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
    });
    this.syncEngine = new SyncEngine({
      provider: this.provider,
      dataStorage: this.dataStorage,
      onlineOffset: config.sync.onlineOffset,
      threadCount: config.sync.threadCount,
      minBlocCount: config.sync.minBlocCount,
    });
  }

  async init() {
    await this.dataStorage.init();
    await this.syncEngine.init();
  }
}
