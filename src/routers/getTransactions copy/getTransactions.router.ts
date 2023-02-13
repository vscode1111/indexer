import { FastifyInstance } from "fastify";
import { services } from "../..";
import { TRANSACTION_ROUTE_URL } from "../../constants/routes";
import { checkIfAddress } from "../../utils/checks";

export default async function createRoute(fastify: FastifyInstance) {
  fastify.get<{ Params: { arg: string } }>(
    `/${TRANSACTION_ROUTE_URL}/:arg`,
    async function (request) {
      const rawArg = request.params.arg;
      if (rawArg === "top-values") {
        return services.dataStorage.fetchTopValueTransactions();
      }

      const address = checkIfAddress(request.params.arg);
      return services.dataStorage.fetchTransactionByAddress(address);
    },
  );
}
