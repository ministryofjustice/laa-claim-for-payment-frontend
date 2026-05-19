import { load, type CheerioAPI } from 'cheerio';

/**
 * Render a Nunjucks view.
 * @param {string} view path to view file e.g. main/index.njk.
 * @param {object} context params to pass into the view.
 * @returns {Promise<CheerioAPI>} a Cheerio instance for querying the output.
 */
export async function renderView(view: string, context: object = {}): Promise<CheerioAPI> {
  const { setupNunjucksForGovUk } = await import('../../../../support/nunjucks-govuk.js');
  const env = setupNunjucksForGovUk();

  const html = env.render(view, context);
  return load(html);
}