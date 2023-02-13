export async function sleep(ms: number): Promise<number> {
  return new Promise((resolve) => setTimeout(resolve as any, ms));
}

export function printError(error: any) {
  if ("message" in error) {
    return error.message;
  }

  return error;
}
