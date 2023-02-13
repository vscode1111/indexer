import { expect } from "chai";
import { commonTestValue } from "../utils/test";
import { testValue } from "./testValue";
import { IBlockTransactions, IProvider } from "./types";

export function providerTests(provider: IProvider) {
  afterEach(async function () {
    provider?.unsubscribe();
  });

  it("check getBlockNumber", async function () {
    const response = await provider.getBlockNumber();
    expect(response).to.greaterThan(testValue.minBlockNumber);
  }).timeout(commonTestValue.timeout);

  it("check getBlockTransactions", async function () {
    const response = await provider.getBlockTransactions(testValue.blockNumber);
    // console.log(111, response);
    expect(response).to.eql(testValue.transactionResponse);
  }).timeout(commonTestValue.timeout);

  it("check getBalance", async function () {
    const response = await provider.getBalance(testValue.address, testValue.blockNumber);
    expect(response).to.closeTo(testValue.balance, 0.001);
  }).timeout(commonTestValue.timeout);

  it.skip("check performance getBlockTransactions", async function () {
    async function test(index: number) {
      const response = await provider.getBlockTransactions(testValue.blockNumber + index);
      expect(response.transactions.length).to.be.greaterThan(0);
      return response;
    }

    const transactionPromises: Promise<IBlockTransactions>[] = [];

    const count = 100;

    for (let i = 0; i < count; i++) {
      transactionPromises.push(test(i));
    }

    const result = await Promise.all(transactionPromises);
    expect(result.length).to.eq(count);
  }).timeout(commonTestValue.timeout);

  it("check subscription", async function () {
    await provider.subscribe();

    return new Promise((resolve) => {
      provider.onNewBlock((blockNumber) => {
        expect(blockNumber).to.greaterThan(testValue.minBlockNumber);
        resolve();
      });
    });
  }).timeout(commonTestValue.timeout);
}
