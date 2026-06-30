import { config as chaiConfig, expect } from "chai";
import { CheerioAPI } from "cheerio";
import { renderView } from "#tests/unit/src/views/base/renderView.js";

chaiConfig.truncateThreshold = 0;

describe("views/main/poa/submissionSuccessfulView.njk", () => {
  let $: CheerioAPI;

  beforeEach(async () => {
    $ = await renderView("main/poa/submissionSuccessfulView.njk", {
      claimId: "1",
    });
  });

  it("doesn't render a Back link", () => {
    const back = $("a.govuk-back-link");

    expect(back).to.have.length(0);
  });

  it("renders a confirmation panel", () => {
    const panel = $(".govuk-panel--confirmation");

    expect(panel).to.have.length(1);

    const title = panel.find(".govuk-panel__title");
    expect(title).to.have.length(1);
    expect(title.text().trim()).to.equal("pages.poa.submissionSuccessful.title");
  });

  it("renders an h2", () => {
    const h2s = $("#main-content h2");
    const h2 = h2s.first();
    expect(h2.text().trim()).to.equal("pages.poa.submissionSuccessful.h2");
  });

  it("renders the 'processing' paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.first();
    expect(p.text().trim()).to.equal(
      "pages.poa.submissionSuccessful.p1",
    );
  });

  it("renders the 'guidance' paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.eq(1);
    expect(p.text().trim()).to.match(
      /^pages\.poa\.submissionSuccessful\.p2\.1.*/
    );

    const link = p.find(".govuk-link");
    expect(link).to.have.length(1);
    expect(link.text().trim()).to.include("pages.poa.submissionSuccessful.p2.link");
    expect(link.attr("href")).to.equal("https://www.gov.uk/guidance/civil-processing-dates");
    expect(link.attr("rel")).to.equal("noreferrer noopener");
    expect(link.attr("target")).to.equal("_blank");

    const visuallyHiddenText = link.find("span");
    expect(visuallyHiddenText).to.have.length(1);
    expect(visuallyHiddenText.text().trim()).to.equal("(common.opensInNewTab)")

    expect(p.text().trim()).to.match(
      /.*pages\.poa\.submissionSuccessful\.p2\.2$/
    );
  });

  it("renders the 'updated' paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.eq(2);
    expect(p.text().trim()).to.equal(
      "pages.poa.submissionSuccessful.p3",
    );
  });

  it("renders the 'return to claim' paragraph", () => {
    const ps = $("#main-content p");
    const p = ps.eq(3);
    const link = p.find(".govuk-link");
    expect(link).to.have.length(1);
    expect(link.text().trim()).to.equal("pages.poa.submissionSuccessful.link");
    expect(link.attr("href")).to.equal("/claims/1/summary");
  });
});