import { EvmProvider } from "./evmProvider";
import { providerTests } from "./test.utils";

describe("evmProvider", () => {
  providerTests(new EvmProvider("https://rpc.ankr.com/avalanche"));
});
