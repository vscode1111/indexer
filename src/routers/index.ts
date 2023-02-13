import getBlocks from "./getBlocks/getBlocks.router";
import getHealthCheck from "./getHealthCheck/getHealthCheck.router";
import getStats from "./getStats/getStats.router";
import getTopBalances from "./getTopBalances/getTopBalances.router";
import getTransactions from "./getTransactions/getTransactions.router";
import getTransactionsCount from "./getTransactionsCount/getTransactionsCount.router";
import { FastifyInstance } from "fastify";

export default async function router(fastify: FastifyInstance) {
  fastify.register(getBlocks);
  fastify.register(getHealthCheck);
  fastify.register(getStats);
  fastify.register(getTopBalances);
  fastify.register(getTransactions);
  fastify.register(getTransactionsCount);
}
