import { FastifyInstance } from "fastify";
import { HEALTH_CHECK_ROUTE_URL } from "../../constants/routes";

export default async function createRoute(fastify: FastifyInstance) {
  fastify.get(`/${HEALTH_CHECK_ROUTE_URL}`, async function () {
    return {
      uptime: `${process.uptime().toFixed()} s`,
      message: "OK",
      timestamp: new Date(),
    };
  });
}
