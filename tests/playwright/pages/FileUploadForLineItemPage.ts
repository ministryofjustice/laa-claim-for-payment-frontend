import type { Page, Locator } from '@playwright/test';
import { BasePage } from "#tests/playwright/pages/BasePage.js";

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
   * @param {string} name the file name to delete
   */
  async deleteFile(name: string): Promise<void> {
    const link = this.page
      .locator(".moj-multi-file-upload__row", {
        hasText: name,
      })
      .getByRole("link", { name: /delete/i });

    await link.click();
  }
}