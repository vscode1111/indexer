import { IBlockTransactions } from "./types";

// const blockNumber = 26152384; //1 good
const blockNumber = 26146965; //3 good, no to

const transactionResponse: IBlockTransactions = {
  blockNumber,
  transactions: [
    {
      hash: "0xfb6573aa3a217bcf2e384da3d55376b2bd25f4e5b78dcf9b527516848678d499",
      transactionIndex: 0,
      from: "0x200354113fc39c4738fa53173b4ca4abce2c91ff",
      fromBalance: 0.2352796932151818,
      to: "0x2d052048fe7e4f59277e5e5ed5d21d35419fe747",
      toBalance: 0,
      value: 0,
    },
    {
      hash: "0x5aec918dff3cf868ff1230eedbdf2e33ee46655f85bd794509e914979842b654",
      transactionIndex: 1,
      from: "0x24e523fd8cee363a4d90c7c9c9ec5d2fc9a8b02a",
      fromBalance: 0.279176746597774,
      to: "0xdef171fe48cf0115b1d80b88dc8eab59176fee57",
      toBalance: 0,
      value: 0.29,
    },
    {
      hash: "0x2ceee2ecf948c950590f271b74b8b5403892e49113ba6eb20c2eb510430841bf",
      transactionIndex: 2,
      from: "0xf77eff67141540fcbabc150773211708723af6b2",
      fromBalance: 0.23170592423,
      to: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
      toBalance: 0,
      value: 0,
    },
  ],
};

export const testValue = {
  minBlockNumber: 26136608,
  blockNumber,
  transactionResponse,
  address: "0x272b4dd8e842be1012c9ccbb89b636996f9bae98",
  balance: 35.06785276539829,
};
