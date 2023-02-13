import { IGap } from "./dataStorage.types";

export function getFlattenGaps(gaps: IGap[]): number[] {
  const result: number[] = [];

  for (const gap of gaps) {
    for (var i = gap.previd + 1; i < gap.nextid; i++) {
      result.push(i);
    }
  }

  return result;
}
