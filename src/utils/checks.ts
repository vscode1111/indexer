import { ethers } from "ethers";

class ApiError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export function checkIfNumber(value: string | undefined, errorMessage = "Id is not a number") {
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue)) {
    throw new ApiError(errorMessage, 404);
  }
  return numberValue;
}

export function checkIfAddress(
  value: string | undefined,
  errorMessage = `${value} is not a address`,
) {
  if (typeof value !== "string" || !ethers.utils.isAddress(value)) {
    throw new ApiError(errorMessage, 404);
  }
  return value;
}
