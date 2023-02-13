import { BigNumber, ethers } from "ethers";

export const DECIMAL_FACTOR = 1e18;

export function toNumber(value: BigNumber | undefined, factor = 1): number {
  if (!value) {
    return 0;
  }
  return Number(ethers.utils.formatEther(value)) * factor;
}

export function toNumberFromHex(value: string, factor = DECIMAL_FACTOR): number {
  if (!value) {
    return 0;
  }
  return parseInt(value) / factor;
}

export function toHex(value: number | undefined): string {
  if (!value) {
    return "0x0";
  }
  return `0x${value.toString(16)}`;
}
