import { FastifyInstance } from "fastify";
import { services } from "../..";
import { STAT_ROUTE_URL } from "../../constants/routes";

export default async function createRoute(fastify: FastifyInstance) {
  fastify.get(`/${STAT_ROUTE_URL}`, async function () {
    const dataStats = services.dataStorage.getStats();
    const syncStats = services.syncEngine.getStats();
    return {
      blockCount: dataStats.blockCount,
      blockSpeed: Math.round(dataStats.blockSpeed),
      transactionCount: dataStats.transactionCount,
      transactionSpeed: Math.round(dataStats.transactionSpeed),
      balanceCount: dataStats.balanceCount,
      balanceSpeed: Math.round(dataStats.balanceSpeed),
      syncErrorCount: syncStats.errorCount,
    };
  });
}
