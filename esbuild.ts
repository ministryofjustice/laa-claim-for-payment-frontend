import { pathToFileURL } from "node:url";
import dotenv from "dotenv";
import fs from "fs-extra";
import path from "node:path";
import chokidar from "chokidar";
import { builtinModules } from "node:module";
import { sassPlugin } from "esbuild-sass-plugin";
import { getBuildNumber } from "./utils/buildHelper.js";
import type * as Esbuild from "esbuild"; // types only

dotenv.config();

/** Always load the Node build of esbuild (some loaders pick the browser field). */
async function getEsbuild(): Promise<typeof import("esbuild")> {
  const mod = await import("esbuild/lib/main.js");
  return mod as unknown as typeof import("esbuild");
}

const buildNumber = getBuildNumber();
const NO_MORE_ASYNC_OPERATIONS = 0;
const UNCAUGHT_FATAL_EXCEPTION = 1;

const externalModules: string[] = [
  ...builtinModules,
  "express",
  "nunjucks",
  "dotenv",
  "cookie-signature",
  "cookie-parser",
  "body-parser",
  "express-session",
  "morgan",
  "compression",
  "axios",
  "middleware-axios",
  "util",
  "path",
  "fs",
  "figlet",
  "csrf-sync",
  "http-errors",
  "*.node",
];

const exists = (p: string) => fs.pathExistsSync(p);

async function copyAssets(): Promise<void> {
  try {
    const dest = path.resolve("./public/assets");
    await fs.ensureDir(dest);
    await fs.emptyDir(dest);

    await fs.copy(
      path.resolve("./node_modules/govuk-frontend/dist/govuk/assets"),
      dest,
      { overwrite: true, errorOnExist: false }
    );

    await fs.copy(
      path.resolve("./node_modules/govuk-frontend/dist/govuk/assets/rebrand"),
      path.join(dest, "rebrand"),
      { overwrite: true, errorOnExist: false }
    );

    await fs.copy(
      path.resolve("./node_modules/@ministryofjustice/frontend/moj/assets/images"),
      path.join(dest, "images"),
      { overwrite: true, errorOnExist: false }
    );

    console.log("GOV.UK assets (including rebrand) & MOJ Frontend assets copied successfully.");
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      console.warn("Asset source missing; skipping copy:", err.path);
      return;
    }
    console.error("Failed to copy assets:", err);
    process.exit(UNCAUGHT_FATAL_EXCEPTION);
  }
}

async function buildScss(watch = false) {
  const entry = "src/scss/main.scss";
  if (!exists(entry)) {
    console.warn(`ℹ️  Skipping SCSS: ${entry} not found`);
    return;
  }
  const esbuild = await getEsbuild();
  const options: Esbuild.BuildOptions = {
    entryPoints: [entry],
    bundle: true,
    outfile: `public/css/main.${buildNumber}.css`,
    external: ["*.woff", "*.woff2", "*.svg", "*.png", "*.jpg", "*.jpeg", "*.gif"],
    plugins: [
      sassPlugin({
        loadPaths: [path.resolve("."), path.resolve("node_modules")],
        transform: (source: string): string =>
          source
            .replace(/url\(["']?\/assets\/fonts\/([^"')]+)["']?\)/g, 'url("/assets/fonts/$1")')
            .replace(/url\(["']?\/assets\/images\/([^"')]+)["']?\)/g, 'url("/assets/images/$1")'),
      }),
    ],
    loader: { ".scss": "css", ".css": "css" },
    minify: process.env.NODE_ENV === "production",
    sourcemap: process.env.NODE_ENV !== "production",
  };
  if (watch) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
    return ctx;
  }
  await esbuild.build(options);
}

async function buildAppJs(watch = false) {
  const entry = "src/app.ts";
  if (!exists(entry)) {
    console.warn(`ℹSkipping app: ${entry} not found`);
    return;
  }
  const esbuild = await getEsbuild();
  const options: Esbuild.BuildOptions = {
    entryPoints: [entry],
    bundle: true,
    platform: "node",
    target: "es2020",
    format: "esm",
    sourcemap: process.env.NODE_ENV !== "production",
    minify: process.env.NODE_ENV === "production",
    external: externalModules,
    outfile: "public/app.js",
  };
  if (watch) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
    return ctx;
  }
  await esbuild.build(options);
}

async function buildCustomJs(watch = false) {
  const entry = "src/scripts/custom.ts";
  if (!exists(entry)) {
    console.warn(`ℹ️  Skipping custom JS: ${entry} not found`);
    return;
  }
  const esbuild = await getEsbuild();
  const options: Esbuild.BuildOptions = {
    entryPoints: [entry],
    bundle: true,
    platform: "browser",
    target: "es2020",
    format: "esm",
    sourcemap: process.env.NODE_ENV !== "production",
    minify: process.env.NODE_ENV === "production",
    outfile: `public/js/custom.${buildNumber}.min.js`,
  };
  if (watch) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
    return ctx;
  }
  await esbuild.build(options);
}

async function buildFrontendPackages(watch = false) {
  const entry = "src/scripts/frontend-packages-entry.ts";
  if (!exists(entry)) {
    console.warn(`ℹ️  Skipping frontend packages: ${entry} not found`);
    return;
  }
  const esbuild = await getEsbuild();
  const options: Esbuild.BuildOptions = {
    entryPoints: [entry],
    bundle: true,
    platform: "browser",
    target: "es2020",
    format: "esm",
    sourcemap: process.env.NODE_ENV !== "production",
    minify: process.env.NODE_ENV === "production",
    treeShaking: false,
    outfile: `public/js/frontend-packages.${buildNumber}.min.js`,
  };
  if (watch) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
    return ctx;
  }
  await esbuild.build(options);
}

/** Exported so other files can reuse the build without spawning a separate process. */
export async function build(): Promise<void> {
  try {
    console.log("Starting build process...");
    await copyAssets();
    // run sequentially to avoid races
    await buildScss(false);
    await buildAppJs(false);
    await buildCustomJs(false);
    await buildFrontendPackages(false);
    console.log("Build completed successfully.");
  } catch (err) {
    console.error("Build process failed:", err);
    process.exit(UNCAUGHT_FATAL_EXCEPTION);
  }
}

export async function watchBuild(): Promise<void> {
  try {
    await copyAssets();
    const contexts = await Promise.all([
      buildScss(true),
      buildAppJs(true),
      buildCustomJs(true),
      buildFrontendPackages(true),
    ]);
    const assetWatcher = chokidar.watch(
      [
        "node_modules/govuk-frontend/dist/govuk/assets/**/*",
        "node_modules/@ministryofjustice/frontend/moj/assets/images/**/*",
      ],
      {
        ignored: /node_modules\/(?!govuk-frontend|@ministryofjustice)/,
        persistent: true,
      }
    );
    assetWatcher.on("change", () => {
      copyAssets().catch((err) =>
        console.error("Failed to copy assets on change:", err)
      );
    });
    console.log("Watch mode started successfully. Watching for file changes...");
    process.on("SIGINT", () => {
      console.log("\nStopping watch mode...");
      void Promise.all(
        contexts
          .filter((c): c is Esbuild.BuildContext => c !== undefined)
          .map((c) => c.dispose())
      ).then(() => {
        void assetWatcher.close();
        process.exit(NO_MORE_ASYNC_OPERATIONS);
      });
    });
  } catch (err) {
    console.error("Watch mode setup failed:", err);
    process.exit(UNCAUGHT_FATAL_EXCEPTION);
  }
}

/** CLI entrypoint when run directly (e.g. `tsx esbuild.ts [--watch]`). */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const isWatch = process.argv.includes("--watch");
  (isWatch ? watchBuild() : build()).catch((err) => {
    console.error("esbuild runner failed:", err);
    process.exit(1);
  });
}
