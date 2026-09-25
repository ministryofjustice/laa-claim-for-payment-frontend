import type { Application, NextFunction, Request, Response } from "express";
import { Histogram, register } from "@prometheus-io/client";

const registeredRequestDuration = register.getSingleMetric(
  "http_request_duration_seconds",
);

const requestDuration =
  registeredRequestDuration instanceof Histogram
    ? registeredRequestDuration
    : new Histogram({
        name: "http_request_duration_seconds",
        help: "duration histogram of http responses labelled with: status_code, method",
        labelNames: ["status_code", "method"],
        buckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10],
      });

/**
 * Sets up Prometheus metrics for the main application without exposing /metrics on the public
 * port. The management app is responsible for serving the /metrics endpoint from the shared
 * registry.
 *
 * @param {Application} app - The main Express application instance.
 */
export const configureMetrics = (app: Application): void => {
  app.use((req: Request, res: Response, next: NextFunction): void => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
      const durationSeconds = Number(process.hrtime.bigint() - start) / 1_000_000_000;
      requestDuration.labels(String(res.statusCode), req.method).observe(durationSeconds);
    });

    next();
  });
};

/**
 * Keeps the public Express app instrumented with Prometheus metrics.
 *
 * @param {Application} app - The Express application instance to instrument.
 */
export const prometheusSetup = (app: Application): void => {
  configureMetrics(app);
};
