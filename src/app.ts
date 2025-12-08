import type { Request, Response, NextFunction } from "express";
import express from "express";
import chalk from "chalk";
import morgan from "morgan";
import compression from "compression";
import { setupCsrf, setupMiddlewares, setupConfig, setupLocaleMiddleware } from "#middleware/index.js";
import session from "express-session";
import {
  nunjucksSetup,
  rateLimitSetUp,
  helmetSetup,
  axiosMiddleware,
  displayAsciiBanner,
  oidcSetup,
  setupRedisSession,
  buildRedisClient
} from "#utils/index.js";
import config from "#config.js";
import indexRouter from "#routes/index.js";
import livereload from "connect-livereload";
import { requiresAuth } from "#utils/openidSetup.js";
import { initializeI18nextSync } from "./scripts/helpers/i18nLoader.js";




const TRUST_FIRST_PROXY = 1;
const SUCCESSFUL_REQUEST = 200;
const UNSUCCESSFUL_REQUEST = 500;

/**
 * Creates and configures an Express application.
 * Then starts the server listening on the configured port.
 *
 * @returns {import('express').Application} The configured Express application
 */
const createApp = (): express.Application => {
  // Initialise i18next synchronously before setting up the app
  initializeI18nextSync();

  const app = express();

  // Set up common middleware for handling cookies, body parsing, etc.
  setupMiddlewares(app);

  if (process.env.REDIS_ENABLED === 'true') {

    const redisClient = buildRedisClient();
    await initRedis(redisClient);
    setupRedisSession(app, redisClient);
  }
  else {
    app.use(
      session(config.session));
  }

  app.use(axiosMiddleware);

	app.use(setupLocaleMiddleware);

  // Response compression setup
  app.use(
    compression({
      /**
       * Custom filter for compression.
       * Prevents compression if the 'x-no-compression' header is set in the request.
       *
       * @param {import('express').Request} req - The Express request object
       * @param {import('express').Response} res - The Express response object
       * @returns {boolean} True if compression should be applied, false otherwise
       */
      filter: (req: Request, res: Response): boolean => {
        if ("x-no-compression" in req.headers) {
          return false;
        }
        return compression.filter(req, res);
      },
    })
  );

  // Set up security headers
  helmetSetup(app);

  // Reducing fingerprinting by removing the 'x-powered-by' header
  app.disable("x-powered-by");

  // Set up cookie security for sessions
  app.set("trust proxy", TRUST_FIRST_PROXY);


  // Set up Cross-Site Request Forgery (CSRF) protection
  setupCsrf(app);

  // Set up Nunjucks as the template engine
  nunjucksSetup(app);

  // Set up rate limiting
  rateLimitSetUp(app, config);

  // Set up application-specific configurations
  setupConfig(app);

  if (process.env.AUTH_ENABLED === 'true') {
    // Set up the OIDC authentication
    oidcSetup(app);

  }

  // Set up request logging based on environment
  if (process.env.NODE_ENV === 'production') {
    // Use combined format for production (more structured, less verbose)
    app.use(morgan('combined'));
  } else {
    // Use dev format for development (colored, more readable)
    app.use(morgan('dev'));
  }

  // This middleware copies the OIDC user into res.locals for views
  function injectUser(req: Request, res: Response, next: NextFunction): void {
    res.locals.user = req.session.oidc?.userinfo;
    next();
  }

  // liveness and readiness probes for Helm deployments. Has to happen before the main router
  app.get("/status", function (req: Request, res: Response): void {
    res.status(SUCCESSFUL_REQUEST).send("OK");
  });

  app.get("/health", function (req: Request, res: Response): void {
    res.status(SUCCESSFUL_REQUEST).send("Healthy");
  });

  app.get("/error", function (req: Request, res: Response): void {
    // Simulate an error
    res
      .set("X-Error-Tag", "TEST_500_ALERT")
      .status(UNSUCCESSFUL_REQUEST)
      .send("Internal Server Error");
  });

  // Register the main router
  app.use('/', requiresAuth(), injectUser, indexRouter);

  // Enable live-reload middleware in development mode
  if (process.env.NODE_ENV === "development") {
    app.use(livereload());
  }

  // Display ASCII Art banner
  displayAsciiBanner(config);

  // Starts the Express server on the specified port
  app.listen(config.app.port, () => {
    console.log(chalk.yellow(`Listening on port ${config.app.port}...`));
  });

  return app;
};

// Self-execute the app directly to allow app.js to be executed directly
createApp();

// Export the createApp function for testing/import purposes
export default createApp;
