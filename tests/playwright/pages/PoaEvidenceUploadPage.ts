import type { Page } from "@playwright/test";
import type { UUID } from "uuidv7";
import { FileUploadInput } from "#tests/playwright/pages/Components.js";
import { EvidenceUploadPage } from "#tests/playwright/pages/EvidenceUploadPage.js";

/**
 * Page object for the POA evidence upload page.
 */
export class PoaEvidenceUploadPage extends EvidenceUploadPage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   */
  constructor(page: Page, claimId: UUID) {
    super(page, `claims/${claimId.toString()}/poa/evidence-upload`);
  }

  readonly fileUploadInput = new FileUploadInput(this.page, "documents");
}