import { DataStorage } from "../db/dataStorage";
import { IProvider } from "../providers/types";

export interface ISyncEngineStats {
  errorCount: number;
}

export interface ISyncEngineConfig {
  provider: IProvider;
  dataStorage: DataStorage;
  onlineOffset: number;
  threadCount: number;
  minBlocCount: number;
}
