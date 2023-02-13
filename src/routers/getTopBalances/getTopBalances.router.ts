import { FastifyInstance } from "fastify";
import { services } from "../..";
import { TOP_BALANCE_ROUTE_URL } from "../../constants/routes";

export default async function createRoute(fastify: FastifyInstance) {
  fastify.get(`/${TOP_BALANCE_ROUTE_URL}`, async function () {
    return services.dataStorage.fetchTopValueBalances();
  });
}
