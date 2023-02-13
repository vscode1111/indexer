import { FastifyInstance } from "fastify";
import { services } from "../..";
import { TRANSACTION_ROUTE_URL } from "../../constants/routes";
import { checkIfAddress } from "../../utils/checks";

export default async function createRoute(fastify: FastifyInstance) {
  fastify.get<{ Params: { address: string } }>(
    `/${TRANSACTION_ROUTE_URL}/:address/count`,
    async function (request) {
      const address = checkIfAddress(request.params.address);
      return services.dataStorage.getTransactionCountByAddress(address);
    },
  );
}
