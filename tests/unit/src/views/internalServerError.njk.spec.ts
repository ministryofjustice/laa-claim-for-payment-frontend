import { expect, config as chaiConfig } from 'chai';
import { load, CheerioAPI } from 'cheerio';
import { renderView } from "#tests/unit/src/views/base/renderView.js";

// Show full strings in diffs if something fails
chaiConfig.truncateThreshold = 0;

describe('views/main/internalServerError.njk', () => {
  let $: CheerioAPI;

  before(async () => {
    $ = await renderView('main/internalServerError.njk');
  });

  it('renders the page <title> from the pageTitle block', () => {
    const title = $('head > title').text().trim();
    expect(title).to.equal("common.title");
  });

  it('renders the title in the main H1', () => {
    const h1 = $("h1.govuk-heading-l");
    expect(h1).to.have.length(1);
    expect(h1.text().trim()).to.equal("pages.error.internalServerError.title");
  });

  it("renders the first paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.first();
    expect(p).to.have.length(1);
    expect(p.text().trim()).to.equal("pages.error.internalServerError.p1");
  });
});
