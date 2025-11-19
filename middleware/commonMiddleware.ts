import type { Application } from 'express';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import config from '../config.js';
import i18next, { type i18n } from "i18next";
import { handle } from "i18next-http-middleware";

/**
 * Sets up common middlewares for the given Express application.
 *
 * @param {Application} app - The Express application instance.
 * @returns {void} Sets up various middleware on the provided app instance.
 */
export const setupMiddlewares = (app: Application): void => {
  // Parses cookies and adds them to req.cookies
  app.use(cookieParser());

  // Parses URL-encoded bodies (form submissions)
  app.use(bodyParser.urlencoded({ extended: true }));

  // Serve static files from the specified public directory
  app.use(express.static(config.paths.static));

  // Parses JSON request bodies
  app.use(express.json());

  // Parses URL-encoded bodies
  app.use(express.urlencoded({ extended: false }));

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- i18next default export becomes the singleton i18n instance after init(), so narrowing is correct */
  const i18nInstance = i18next as unknown as i18n;
  app.use(handle(i18nInstance));
};
