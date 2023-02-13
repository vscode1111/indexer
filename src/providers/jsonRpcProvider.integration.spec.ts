import { JsonRpcProvider } from "./jsonRpcProvider";
import { providerTests } from "./test.utils";

describe("JsonRpcProvider", () => {
  providerTests(new JsonRpcProvider());
});
