import type { Locator } from "@playwright/test";
import { BasePage } from "#tests/playwright/pages/base/BasePage.js";
import { expect } from "@playwright/test";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

/**
 * Base question page with shared navigation + utilities
 */
export abstract class EvidenceUploadPage extends BasePage {
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

  /**
   * create a file with a given name and size.
   * @param {string} name file name
   * @param {number} sizeInBytes file size in bytes
   * @returns {string} the path to the created file
   */
  static createFile(name: string, sizeInBytes: number): string {
    const filePath = path.join(os.tmpdir(), name);
    const buffer = Buffer.alloc(sizeInBytes);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  /**
   * Resets the promise gate
   */
  async resetGate(): Promise<void> {
    await this.page.request.post("http://localhost:8080/test/reset-upload");
  }

  /**
   * Releases the promise gate
   */
  async releaseGate(): Promise<void> {
    await this.page.request.post("http://localhost:8080/test/release-upload");
  }
}
