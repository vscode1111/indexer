import { FastifyInstance } from "fastify";
import { services } from "../..";
import { BLOCK_ROUTE_URL } from "../../constants/routes";

export default async function createRoute(fastify: FastifyInstance) {
  fastify.get(`/${BLOCK_ROUTE_URL}`, async function () {
    return services.provider.getBlockNumber();
  });
}
