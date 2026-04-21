import promBundle from "express-prom-bundle";
import type { Application } from "express";

/**
 * Sets up Prometheus middleware for the Express application to expose metrics for prometheus.
 *
 * @param {Application} app - The Express application instance.
 */
export const prometheusSetup = (app: Application): void => {
  const bundle = promBundle({ includeMethod: true });
  app.use(bundle);
};
