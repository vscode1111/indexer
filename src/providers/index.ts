import { EvmProvider } from "./evmProvider";
import { JsonRpcProvider } from "./jsonRpcProvider";
import { IProvider } from "./types";

export function createProvider(type: "rpc" | "evm" = "rpc"): IProvider {
  const provider = type === "rpc" ? new JsonRpcProvider() : new EvmProvider();
  return provider;
}
