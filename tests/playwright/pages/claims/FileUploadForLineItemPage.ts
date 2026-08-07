import type { Page } from "@playwright/test";
import type { UUID } from "uuidv7";
import { FileUploadInput } from "#tests/playwright/pages/base/Components.js";
import { EvidenceUploadPage } from "#tests/playwright/pages/base/EvidenceUploadPage.js";

/**
 * Page object for the choose upload page.
 */
export class FileUploadForLineItemPage extends EvidenceUploadPage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   * @param {UUID} claimId The claim ID.
   * @param {UUID} lineItemId The line item ID.
   */
  constructor(page: Page, claimId: UUID, lineItemId: UUID) {
    super(page, `claims/${claimId.toString()}/upload-evidence-individually/${lineItemId.toString()}/file-upload`);
  }

  readonly fileUploadInput = new FileUploadInput(this.page, "documents");
}