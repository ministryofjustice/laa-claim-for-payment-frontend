import express from "express";
import { expect } from "chai";
import { register } from "@prometheus-io/client";
import { configureMetrics } from "#utils/prometheusSetup.js";

describe("prometheusSetup", () => {
  it("records HTTP request metrics without exposing /metrics on the public app", async () => {
    const app = express();
    configureMetrics(app);

    app.get("/ping", (_req, res) => {
      res.status(204).send();
    });

    const server = app.listen(0);
    await new Promise<void>((resolve) => {
      server.once("listening", () => resolve());
    });

    const port = Number((server.address() as { port: number }).port);

    try {
      const pingResponse = await fetch(`http://localhost:${port}/ping`);
      expect(pingResponse.status).to.equal(204);

      const metricsResponse = await fetch(`http://localhost:${port}/metrics`);
      expect(metricsResponse.status).to.equal(404);

      const metricsText = await register.metrics();
      expect(metricsText).to.include("http_request_duration_seconds");
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error != null) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  });
});
