import promBundle from "express-prom-bundle";
import type { Application } from "express";

/**
 * Sets up Prometheus middleware for the main application without exposing /metrics on the public
 * port. The management app is responsible for serving the /metrics endpoint from the shared
 * registry.
 *
 * @param {Application} app - The main Express application instance.
 */
/**
 * Configures Prometheus request metrics for the main Express app.
 *
 * @param {Application} app - The Express application instance to instrument.
 */
export const configureMetrics = (app: Application): void => {
  const bundle = promBundle({
    includeMethod: true,
    autoregister: false,
  });

  app.use(bundle);
};

/**
 * Keeps the public Express app instrumented with Prometheus metrics.
 *
 * @param {Application} app - The Express application instance to instrument.
 */
export const prometheusSetup = (app: Application): void => {
  configureMetrics(app);
};
