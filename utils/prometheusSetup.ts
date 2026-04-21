import type { Application } from "express";
import prometheus from "express-prometheus-middleware";

/**
 * Sets up Prometheus middleware for the Express application to expose metrics for prometheus.
 *
 * @param {Application} app - The Express application instance.
 */
export const prometheusSetup = (app: Application): void => {
  app.use(
    prometheus({
      metricsPath: "/metrics",
      collectDefaultMetrics: true,
      requestDurationBuckets: [0.1, 0.5, 1, 1.5],
      requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    }),
  );
};
