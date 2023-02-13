import { expect } from "chai";
import { MultiSet } from "./myltiSet";

describe("MultiSet", () => {
  it("check constructor", async function () {
    const multiSet = new MultiSet(5);
    expect(multiSet.lenght(0)).to.eql(0);
    expect(multiSet.lenght(1)).to.eql(0);
    expect(multiSet.lenght(2)).to.eql(0);
    expect(multiSet.lenght(3)).to.eql(0);
    expect(multiSet.lenght(4)).to.eql(0);
    expect(multiSet.lenghts()).to.eql([0, 0, 0, 0, 0]);
    expect(multiSet.totalLenght()).to.eql(0);
  });

  it("add and delete should be done correctly", async function () {
    const multiSet = new MultiSet(5);
    multiSet.add(1); //0
    multiSet.add(2); //1
    multiSet.add(3); //2
    multiSet.add(4); //3
    multiSet.add(5); //4
    multiSet.add(6); //0
    multiSet.add(7); //1
    expect(multiSet.lenght(0)).to.eql(2);
    expect(multiSet.lenght(1)).to.eql(2);
    expect(multiSet.lenght(2)).to.eql(1);
    expect(multiSet.lenght(3)).to.eql(1);
    expect(multiSet.lenght(4)).to.eql(1);
    expect(multiSet.lenghts()).to.eql([2, 2, 1, 1, 1]);
    expect(multiSet.totalLenght()).to.eql(7);

    expect(multiSet.getValue(0)).to.eql(6);
    multiSet.deleteValue(0);
    expect(multiSet.getValue(0)).to.eql(1);
    expect(multiSet.lenghts()).to.eql([1, 2, 1, 1, 1]);
    expect(multiSet.totalLenght()).to.eql(6);
    multiSet.deleteValue(0);
    expect(multiSet.getValue(0)).to.eql(undefined);
    expect(multiSet.lenghts()).to.eql([0, 2, 1, 1, 1]);
    expect(multiSet.totalLenght()).to.eql(5);
    multiSet.deleteValue(0);
    expect(multiSet.getValue(0)).to.eql(undefined);
    expect(multiSet.lenghts()).to.eql([0, 2, 1, 1, 1]);
    expect(multiSet.totalLenght()).to.eql(5);

    expect(multiSet.getValue(1)).to.eql(7);
    multiSet.deleteValue(1);
    expect(multiSet.getValue(1)).to.eql(2);
    expect(multiSet.lenghts()).to.eql([0, 1, 1, 1, 1]);
    expect(multiSet.totalLenght()).to.eql(4);
    multiSet.deleteValue(1);
    expect(multiSet.getValue(1)).to.eql(undefined);
    expect(multiSet.lenghts()).to.eql([0, 0, 1, 1, 1]);
    expect(multiSet.totalLenght()).to.eql(3);
    multiSet.deleteValue(1);
    expect(multiSet.getValue(1)).to.eql(undefined);
    expect(multiSet.lenghts()).to.eql([0, 0, 1, 1, 1]);
    expect(multiSet.totalLenght()).to.eql(3);
  });

  it("check dublicates", async function () {
    const multiSet = new MultiSet(5);
    multiSet.add(1); //0
    multiSet.add(2); //1
    multiSet.add(3); //2
    multiSet.add(3); //skip
    multiSet.add(3); //skip
    multiSet.add(4); //3
    multiSet.add(5); //4
    multiSet.add(6); //0
    expect(multiSet.lenghts()).to.eql([2, 1, 1, 1, 1]);
    expect(multiSet.totalLenght()).to.eql(6);
  });
});
