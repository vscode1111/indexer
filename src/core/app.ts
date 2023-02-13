import fastify, { FastifyInstance } from "fastify";
import routers from "../routers";
import { Server } from "http";
import { config } from "../config";
import { scheduleJob } from "node-schedule";
import { Services } from "../services";

export class App {
  private server: FastifyInstance<Server>;

  constructor(private services: Services) {
    this.server = fastify({
      // Logger only for production
      // logger: !!(process.env.NODE_ENV !== "dev"),
    });
    this.server.register(routers);
  }

  public start(): void {
    const port = config.port;
    this.server.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`🚀 Fastify server is running on http://localhost:${port}`);
    if (config.scheduler.enable) {
      this.initSchedule();
    }
  }

  private initSchedule(): void {
    scheduleJob(config.scheduler.syncRule, async () => {
      await this.services.syncEngine.sync();
    });
    scheduleJob(config.scheduler.statsRule, async () => {
      await this.services.dataStorage.stats();
    });
  }
}
