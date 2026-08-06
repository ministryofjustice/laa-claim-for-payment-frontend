import { expect, test } from "../fixtures/index.js";
import { FileUploadForLineItemPage } from "#tests/playwright/pages/FileUploadForLineItemPage.js";
import path from "path";
import os from "os";
import fs from "fs";
import {
  claim1Id,
  lineItemId,
} from "#tests/playwright/factories/handlers/api.js";
import { delay } from "msw";

test("upload a file then delete the file", async ({
  page,
  checkAccessibility,
}) => {
  const fileName = "test.pdf";

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(page, claim1Id, lineItemId);

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const filePath = createFile(fileName, 1024);

  await expect(fileUploadForLineItemPage.uploadedFilesContainer).toHaveClass(/moj-hidden/);
  await expect(fileUploadForLineItemPage.uploadedFilesHeading).not.toBeVisible();
  await expect(fileUploadForLineItemPage.uploadedFilesHintText).not.toBeVisible();

  await page.setInputFiles("#documents", filePath);

  await expect(fileUploadForLineItemPage.uploadedFilesContainer).not.toHaveClass(/moj-hidden/);
  await expect(fileUploadForLineItemPage.uploadedFilesHeading).toBeVisible();
  await expect(fileUploadForLineItemPage.uploadedFilesHintText).toBeVisible();

  await fileUploadForLineItemPage.checkFileRow(fileName, "1KB", "Uploaded");

  await fileUploadForLineItemPage.deleteFile(fileName);

  await expect(fileUploadForLineItemPage.uploadedFilesContainer).toHaveClass(/moj-hidden/);
  await expect(fileUploadForLineItemPage.uploadedFilesHeading).not.toBeVisible();
  await expect(fileUploadForLineItemPage.uploadedFilesHintText).not.toBeVisible();

  await checkAccessibility();
});

test("upload a file of invalid type", async ({
  page,
  checkAccessibility,
}) => {
  const fileName = "test.mov";

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(page, claim1Id, lineItemId);

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const filePath = createFile(fileName, 1024);

  await fileUploadForLineItemPage.uploadFiles([filePath]);

  await delay(1000);

  await fileUploadForLineItemPage.checkFileRow(fileName, "Only PDF, Word, RTF or TIFF files can be uploaded", "Failed");

  await checkAccessibility();
});

test("upload a file of invalid size", async ({
 page,
 checkAccessibility,
}) => {
  const fileName = "test.pdf";

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(page, claim1Id, lineItemId);

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const filePath = createFile(fileName, 10 * 1024 * 1024);

  await page.setInputFiles("#documents", filePath);

  await delay(1000);

  await fileUploadForLineItemPage.checkFileRow(fileName, "File must not be larger than 10MB", "Failed");

  await checkAccessibility();
});

test("upload multiple files", async ({
  page,
  checkAccessibility,
}) => {
  const file1Name = "test1.pdf";
  const file2Name = "test2.pdf";

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(page, claim1Id, lineItemId);

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const file1Path = createFile(file1Name, 1024);
  const file2Path = createFile(file2Name, 1024);

  await fileUploadForLineItemPage.uploadFiles([file1Path, file2Path]);

  await fileUploadForLineItemPage.checkFileRow(file1Name, "1KB", "Uploaded");
  await fileUploadForLineItemPage.checkFileRow(file2Name, "0%", "Uploading");

  await delay(1000);

  await fileUploadForLineItemPage.checkFileRow(file2Name, "1KB", "Uploaded");

  await checkAccessibility();
});

function createFile(name: string, sizeInBytes: number): string {
  const filePath = path.join(os.tmpdir(), name);

  const header = Buffer.from(
    `%PDF-1.4
1 0 obj <<>> endobj
2 0 obj <<>> endobj
trailer <<>>
%%EOF`,
  );

  if (sizeInBytes < header.length) {
    throw new Error(`Minimum size is ${header.length} bytes`);
  }

  const padding = Buffer.alloc(sizeInBytes - header.length, 0);

  fs.writeFileSync(filePath, Buffer.concat([header, padding]));

  return filePath;
}
