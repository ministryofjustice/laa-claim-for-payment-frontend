import { expect, config as chaiConfig } from 'chai';
import { load, CheerioAPI } from 'cheerio';

// Show full strings in diffs if something fails
chaiConfig.truncateThreshold = 0;

describe('views/main/error.njk', () => {
  let $: CheerioAPI;

  before(async () => {
    // Import the JS helper at runtime to avoid TS/ESLint project faff
    const { setupNunjucksForGovUk } = await import('../../../support/nunjucks-govuk.js');
    const env = setupNunjucksForGovUk();

    const html = env.render('main/error.njk', {
      status: 'The service is not available at this time',
      error: 'Please try again later.'
    });

    $ = load(html);
  });

  it('renders the page <title> from the pageTitle block', () => {
    const title = $('head > title').text().trim();
    expect(title).to.equal("Sorry, there is a problem with the service – 'SERVICE_NAME' – GOV.UK");
  });

  it('renders the status in the main H1', () => {
    const h1 = $('.govuk-grid-row .govuk-grid-column-two-thirds h1.govuk-heading-l').text().trim();
    expect(h1).to.equal('The service is not available at this time');
  });

  it('renders the error message paragraph', () => {
    const p = $('.govuk-grid-row .govuk-grid-column-two-thirds p.govuk-body').text().trim();
    expect(p).to.equal('Please try again later.');
  });

  // Optional: if base.njk uses `mainClasses`, verify the class is present
  it('applies the large main wrapper class (from mainClasses)', () => {
    // This is a light-touch check; adjust the selector if your base wraps differently
    const hasClass = $('.govuk-main-wrapper--l').length > 0;
    expect(hasClass, 'expected .govuk-main-wrapper--l to be present').to.be.true;
  });
});
