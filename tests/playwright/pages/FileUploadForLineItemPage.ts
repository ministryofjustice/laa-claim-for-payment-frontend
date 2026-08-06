import type { Page, Locator } from '@playwright/test';
import { BasePage } from "#tests/playwright/pages/BasePage.js";
import { expect } from "#tests/playwright/fixtures/index.js";
import type { UUID } from "uuidv7";

/**
 * Page object for the choose upload page.
 */
export class FileUploadForLineItemPage extends BasePage {
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

  /**
   * get the uploaded files container
   * @returns {Locator} The uploaded files container
   */
  get uploadedFilesContainer(): Locator {
    return this.page.locator(".moj-multi-file__uploaded-files");
  }

  /**
   * get the uploaded files h2
   * @returns {Locator} The uploaded files h2
   */
  get uploadedFilesHeading(): Locator {
    return this.page.getByRole("heading", {
      name: "Uploaded files",
    });
  }

  /**
   * get the uploaded files hint text
   * @returns {Locator} The uploaded files hint text
   */
  get uploadedFilesHintText(): Locator {
    return this.page.getByText(
      "Select the file name to open a copy in a new tab.",
    );
  }

  /**
   * upload a file or files
   * @param {string[]} fileNames the files to upload
   */
  async uploadFiles(fileNames: string[]): Promise<void> {
    await this.page.setInputFiles("#documents", fileNames);
  }

  /**
   * click the delete link for a given file name
   * @param {string} fileName the file name to delete
   */
  async deleteFile(fileName: string): Promise<void> {
    const row = this.getFileRow(fileName);
    const link = row.getByRole("link", { name: "Delete" });
    await link.click();
  }

  /**
   * get the file row
   * @param {string} fileName The file name
   * @returns {Locator} The file row
   */
  private getFileRow(fileName: string): Locator {
    return this.page.locator(".moj-multi-file-upload__row", {
      hasText: fileName,
    });
  }

  /**
   * check the values in the file row
   * @param {string} key The row key
   * @param {string} value The row value
   * @param {string} status The file upload status
   */
  async checkFileRow(key: string, value: string, status: string): Promise<void> {
    const row = this.getFileRow(key);

    await expect(
      row.locator(".moj-multi-file-upload__key")
    ).toContainText(key);

    await expect(
      row.locator(".moj-multi-file-upload__value")
    ).toContainText(value);

    await expect(
      row.locator(".govuk-tag")
    ).toHaveText(status);
  }
}