import nunjucks from "nunjucks";
import path from "node:path";
import type { Application } from "express";
import { getLatestBuildFile } from "./buildHelper.js";
import type { TFunction } from "#node_modules/i18next/index.js";
import type { Message } from "#src/viewmodels/components/message.js";

/**
 * Sets up Nunjucks as the template engine for the given Express application.
 * This function configures the view engine, sets the asset path, and specifies
 * the directories where Nunjucks should look for template files.
 *
 * @param {Application} app - The Express application instance.
 * @returns {void} This function does not return a value; it configures Nunjucks for the provided app.
 */
export const nunjucksSetup = (app: Application): void => {
  const appInstance = app;
  appInstance.set("view engine", "njk");

  // Set asset path in locals
  const locals = appInstance.locals as Record<string, unknown>;
  locals.asset_path = "/assets/";

  /**
   * Retrieves the latest build file for the given prefix and extension.
   *
   * @param {string} prefix - The prefix of the asset file.
   * @param {string} ext - The extension of the asset file (e.g., 'js' or 'css').
   * @returns {string} The path to the latest build file.
   */
  locals.getAsset = (prefix: string, ext: string): string => {
    const directory = ext === "js" || ext === "min.js" ? "public/js" : "public/css";
    return getLatestBuildFile(directory, prefix, ext);
  };

  // Tell Nunjucks where to look for njk files
  nunjucks.configure(
    [
      path.join(path.resolve(), "src/views"), // Main views directory
      "node_modules/govuk-frontend/dist", // GOV.UK Frontend templates
      "node_modules/govuk-frontend/dist/components/", // GOV.UK components
      "node_modules/@ministryofjustice/frontend", // MoJ Design System components
    ],
    {
      autoescape: true, // Enable auto escaping to prevent XSS attacks
      express: appInstance, // Bind Nunjucks to the Express app instance
      watch: true, // Watch for changes in template files during development
    }
  );

  app.use((req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
    const env = app.get("nunjucksEnv") as nunjucks.Environment;

    // add custom filters here
    env.addFilter("translate", (value: unknown) => translate(value, req.t));

    next();
  });
};

/**
 * Recursive translation of object
 * @param {unknown} value the value to resolve
 * @param {TFunction} t the translation function
 * @returns {unknown} the resolved object
 */
export function translate(value: unknown, t: TFunction): unknown {
  if (isMessage(value)) {
    return t(value.key, value.args);
  }

  if (Array.isArray(value)) {
    return value.map(v => translate(v, t));
  }

  if (value != null && typeof value === "object") {
    const out: Record<string, unknown> = {};

    for (const [k, v] of Object.entries(value)) {
      out[k] = translate(v, t);
    }

    return out;
  }

  return value;
}

function isMessage(value: unknown): value is Message {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
  const record = value as Record<string, unknown>;

  return (
    typeof record.key === "string" &&
    (record.args === undefined || typeof record.args === "object")
  );
}
