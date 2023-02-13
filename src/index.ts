import { App } from "./core/app";
import { Services } from "./services";

export const services = new Services();
const app = new App(services);

services.init().then(() => {
  app.start();
});
