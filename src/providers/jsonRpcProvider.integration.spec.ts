import { JsonRpcProvider } from "./jsonRpcProvider";
import { providerTests } from "./test.utils";

describe("JsonRpcProvider", () => {
  providerTests(
    new JsonRpcProvider(
      "https://api.avax.network/ext/bc/C/rpc",
      "wss://api.avax.network/ext/bc/C/ws",
    ),
  );
});
