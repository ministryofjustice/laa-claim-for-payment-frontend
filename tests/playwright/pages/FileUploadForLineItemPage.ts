import type { Page, Locator } from '@playwright/test';
import { BasePage } from "#tests/playwright/pages/BasePage.js";
import { expect } from "#tests/playwright/fixtures/index.js";

/**
 * Page object for the choose upload page.
 */
export class FileUploadForLineItemPage extends BasePage {
  /**
   * Creates a page object.
   *
   * @param {Page} page The Playwright page instance.
   */
  constructor(page: Page) {
    super(page, "claims/1/upload-evidence-individually/1/file-upload");
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
   * @param {string} fileName The file name
   * @param {string} fileSize The file size
   */
  async checkFileRow(fileName: string, fileSize: string): Promise<void> {
    const row = this.getFileRow(fileName);

    await expect(
      row.locator(".uploaded-file-name")
    ).toHaveText(fileName);

    await expect(
      row.locator(".uploaded-file-size")
    ).toHaveText(fileSize);

    await expect(
      row.locator(".govuk-tag")
    ).toHaveText("Uploaded");
  }
}