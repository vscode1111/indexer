import { expect } from "chai";
import { IGap } from "./dataStorage.types";
import { getFlattenGaps } from "./utils";

describe("utils", () => {
  it("check getFlattenGaps", async function () {
    const gaps: IGap[] = [
      { previd: 26074159, nextid: 26074161 }, //26074160
      { previd: 26074169, nextid: 26074174 }, //26074170, 26074171, 26074172, 26074173
      { previd: 26074442, nextid: 26074445 }, //26074443, 26074444
    ];

    const flattenGaps = getFlattenGaps(gaps);
    expect(flattenGaps).to.eql([
      26074160, 26074170, 26074171, 26074172, 26074173, 26074443, 26074444,
    ]);
  });
});
