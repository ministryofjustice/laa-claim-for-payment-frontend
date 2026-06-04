import { expect, test } from "../fixtures/index.js";
import { FileUploadForLineItemPage } from "#tests/playwright/pages/FileUploadForLineItemPage.js";
import path from "path";
import os from "os";
import fs from "fs";

test("upload a file then delete the file", async ({
  page,
  checkAccessibility,
}) => {
  const fileName = "test.pdf";

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(page);

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const filePath = createTempPdf(fileName);

  await expect(fileUploadForLineItemPage.uploadedFilesContainer).toHaveClass(/moj-hidden/);
  await expect(fileUploadForLineItemPage.uploadedFilesHeading).not.toBeVisible();
  await expect(fileUploadForLineItemPage.uploadedFilesHintText).not.toBeVisible();

  await page.setInputFiles("#documents", filePath);

  await expect(fileUploadForLineItemPage.uploadedFilesContainer).not.toHaveClass(/moj-hidden/);
  await expect(fileUploadForLineItemPage.uploadedFilesHeading).toBeVisible();
  await expect(fileUploadForLineItemPage.uploadedFilesHintText).toBeVisible();

  await fileUploadForLineItemPage.checkFileRow(fileName, "1KB");

  await fileUploadForLineItemPage.deleteFile(fileName);

  await expect(fileUploadForLineItemPage.uploadedFilesContainer).toHaveClass(/moj-hidden/);
  await expect(fileUploadForLineItemPage.uploadedFilesHeading).not.toBeVisible();
  await expect(fileUploadForLineItemPage.uploadedFilesHintText).not.toBeVisible();

  await checkAccessibility();
});

function createTempPdf(name: string) {
  const filePath = path.join(os.tmpdir(), name);

  const pdfContent = Buffer.from(
    `%PDF-1.4
1 0 obj <<>> endobj
2 0 obj <<>> endobj
trailer <<>> 
%%EOF`,
  );

  fs.writeFileSync(filePath, pdfContent);
  return filePath;
}
