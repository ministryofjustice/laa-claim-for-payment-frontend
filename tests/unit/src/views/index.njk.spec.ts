import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { expect, config as chaiConfig } from "chai";
import { load, CheerioAPI } from "cheerio";

// Show full strings in diffs if something fails
chaiConfig.truncateThreshold = 0;

describe("views/main/index.njk", () => {
  let $: CheerioAPI;

  const context = {
    subNavigation: {
      items: [
        { text: "Submitted", href: "#1", active: true },
        { text: "In progress", href: "#2" },
      ],
    },
    data: { getClaimsResponseData: getClaimsSuccessResponseData },
  };

  beforeEach(async () => {
    // Import the JS helper at runtime to avoid TS/ESLint project faff
    const { setupNunjucksForGovUk } = await import("../../../support/nunjucks-govuk.js");
    const env = setupNunjucksForGovUk();

    const html = env.render("main/index.njk", context);
    $ = load(html);
  });

  it("renders the status in the main H1", () => {
    const h1 = $("h1.govuk-heading-xl").text().trim();
    expect(h1).to.equal("Your Claims");
  });

  it("renders the create claim buttons", () => {
    const importButton = $(".govuk-button").first().text().trim();
    const createButton = $(".govuk-button--secondary").text().trim();

    expect(importButton).to.equal("Import claim");
    expect(createButton).to.equal("Create a new claim");
  });

  it("renders the sub navigation", () => {
    const subNav = $("Sub navigation");

    expect(subNav).to.exist;
    expect(subNav).to.have.include;
  });
});
