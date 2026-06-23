import type { Page } from "@playwright/test";
import { HomePage } from "./HomePage.js";
import { ViewClaimPage } from "./ViewClaimPage.js";
import { NotFoundPage } from "#tests/playwright/pages/NotFoundPage.js";
import { InternalServerErrorPage } from "#tests/playwright/pages/InternalServerErrorPage.js";
import { PoaSubmissionSuccessfulPage } from "#tests/playwright/pages/PoaSubmissionSuccessfulPage.js";
import { PoaCheckDetailsPage } from "#tests/playwright/pages/PoaCheckDetailsPage.js";

/**
 * Factory class for creating page objects
 */
export class PageFactory {
  private readonly page: Page;

  /**
   * Creates a new page factory instance
   * @param {Page} page - The Playwright page instance
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * gets the home page for test
   * @returns { HomePage } the home page
   */
  get homePage(): HomePage {
    return new HomePage(this.page);
  }

  /**
   * gets the view claim page for test
   * @param { number } id the claim id
   * @returns { ViewClaimPage } the claim page for given id
   */
  viewClaimPage(id: number): ViewClaimPage {
    return new ViewClaimPage(this.page, id);
  }

  /**
   * gets the not found page for test
   * @param { string } route the route
   * @returns { NotFoundPage } the not found page
   */
  notFoundPage(route: string): NotFoundPage {
    return new NotFoundPage(this.page, route);
  }

  /**
   * gets the internal server error page for test
   * @returns { InternalServerErrorPage } the internal server error page
   */
  internalServerErrorPage(): InternalServerErrorPage {
    return new InternalServerErrorPage(this.page);
  }

  /**
   * gets the successful POA submission page for test
   * @param { number } claimId the claim id
   * @returns { PoaSubmissionSuccessfulPage } the successful POA submission page for the given claim ID
   */
  poaSubmissionSuccessfulPage(claimId: number): PoaSubmissionSuccessfulPage {
    return new PoaSubmissionSuccessfulPage(this.page, claimId);
  }

  /**
   * gets the POA check details page for test
   * @param { number } claimId the claim id
   * @returns { PoaCheckDetailsPage } the successful POA submission page for the given claim ID
   */
  poaCheckDetailsPage(claimId: number): PoaCheckDetailsPage {
    return new PoaCheckDetailsPage(this.page, claimId);
  }
}