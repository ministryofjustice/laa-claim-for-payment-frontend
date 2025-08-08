// ESM helper that works with NunJucks (CJS) + GOV.UK/MOJ templates
import * as path from 'path';
import * as fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const nunjucks = require('nunjucks');

function pkgRoot(pkg) {
  // Start from the exported entry file (e.g. dist/.../all.bundle.js), then walk up
  let dir = path.dirname(require.resolve(pkg));
  // climb until we find package.json
  for (;;) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    const up = path.dirname(dir);
    if (up === dir) throw new Error(`Cannot locate root for ${pkg}`);
    dir = up;
  }
}

// Return the parent dir that contains a given folder (e.g. 'govuk' or 'moj').
// Handles both <root>/<folder> and <root>/dist/<folder>.
function containerDir(root, folder) {
  if (fs.existsSync(path.join(root, folder))) return root;
  const dist = path.join(root, 'dist');
  if (fs.existsSync(path.join(dist, folder))) return dist;
  throw new Error(`Cannot find '${folder}/' under ${root} or ${dist}`);
}

export function setupNunjucksForGovUk() {
  const appViews = path.resolve(process.cwd(), 'views');
  const govuk = containerDir(pkgRoot('govuk-frontend'), 'govuk');
  const moj   = containerDir(pkgRoot('@ministryofjustice/frontend'), 'moj');

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader([appViews, govuk, moj], { noCache: true }),
    { autoescape: true }
  );

  // Minimal global your base.njk needed
  env.addGlobal('getAsset', (p) => `/assets/${p}`);

  return env;
}
