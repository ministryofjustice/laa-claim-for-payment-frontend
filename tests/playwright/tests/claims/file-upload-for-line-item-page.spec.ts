import { expect, test } from "../../fixtures/index.js";
import { FileUploadForLineItemPage } from "#tests/playwright/pages/claims/FileUploadForLineItemPage.js";
import {
  claim1Id,
  claim3Id,
  lineItemId,
} from "#tests/playwright/factories/handlers/api.js";
import { EvidenceUploadPage } from "#tests/playwright/pages/base/EvidenceUploadPage.js";

test("upload a file then delete the file", async ({
  page,
  checkAccessibility,
}) => {
  const fileName = `${crypto.randomUUID()}.pdf`;

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const filePath = EvidenceUploadPage.createFile(fileName, 1024);

  await expect(fileUploadForLineItemPage.uploadedFilesContainer).toHaveClass(
    /moj-hidden/,
  );
  await expect(
    fileUploadForLineItemPage.uploadedFilesHeading,
  ).not.toBeVisible();
  await expect(
    fileUploadForLineItemPage.uploadedFilesHintText,
  ).not.toBeVisible();

  await fileUploadForLineItemPage.uploadFiles([filePath]);

  await expect(
    fileUploadForLineItemPage.uploadedFilesContainer,
  ).not.toHaveClass(/moj-hidden/);
  await expect(fileUploadForLineItemPage.uploadedFilesHeading).toBeVisible();
  await expect(fileUploadForLineItemPage.uploadedFilesHintText).toBeVisible();

  await fileUploadForLineItemPage.checkFileRow(fileName, "1KB", "Uploaded");

  await fileUploadForLineItemPage.deleteFile(fileName);

  await expect(fileUploadForLineItemPage.uploadedFilesContainer).toHaveClass(
    /moj-hidden/,
  );
  await expect(
    fileUploadForLineItemPage.uploadedFilesHeading,
  ).not.toBeVisible();
  await expect(
    fileUploadForLineItemPage.uploadedFilesHintText,
  ).not.toBeVisible();

  await checkAccessibility();
});

test("upload a file of invalid type", async ({ page, checkAccessibility }) => {
  const fileName = `${crypto.randomUUID()}.mov`;

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const filePath = EvidenceUploadPage.createFile(fileName, 1024);

  await fileUploadForLineItemPage.uploadFiles([filePath]);

  await fileUploadForLineItemPage.checkFileRow(
    fileName,
    "Only PDF, Word, RTF or TIFF files can be uploaded",
    "Failed",
  );

  await checkAccessibility();
});

test("upload a file of maximum size", async ({ page, checkAccessibility }) => {
  const fileName = `${crypto.randomUUID()}.pdf`;

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const bytes = 10 * 1024 * 1024;
  const filePath = EvidenceUploadPage.createFile(fileName, bytes);

  await fileUploadForLineItemPage.uploadFiles([filePath], async () => {
    await fileUploadForLineItemPage.checkFileRow(fileName, /\d{1,3}%/, "Uploading");
  });

  await fileUploadForLineItemPage.checkFileRow(fileName, "10MB", "Uploaded");

  await checkAccessibility();
});

test("upload a file of invalid size", async ({ page, checkAccessibility }) => {
  const fileName = `${crypto.randomUUID()}.pdf`;

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const bytes = 10 * 1024 * 1024;
  const filePath = EvidenceUploadPage.createFile(fileName, bytes + 1);

  await fileUploadForLineItemPage.uploadFiles([filePath]);

  await fileUploadForLineItemPage.checkFileRow(
    fileName,
    "File must not be larger than 10MB",
    "Failed",
  );

  await checkAccessibility();
});

test("fail to upload a file", async ({ page, checkAccessibility }) => {
  const fileName = `${crypto.randomUUID()}.pdf`;

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim3Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const filePath = EvidenceUploadPage.createFile(fileName, 1024);

  await fileUploadForLineItemPage.uploadFiles([filePath]);

  await fileUploadForLineItemPage.checkFileRow(
    fileName,
    "Upload failed",
    "Failed",
  );

  await checkAccessibility();
});

test("upload an empty file", async ({ page, checkAccessibility }) => {
  const fileName = `${crypto.randomUUID()}.pdf`;

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const filePath = EvidenceUploadPage.createFile(fileName, 0);

  await fileUploadForLineItemPage.uploadFiles([filePath]);

  await fileUploadForLineItemPage.checkFileRow(
    fileName,
    "The selected file is empty",
    "Failed",
  );

  await checkAccessibility();
});

test("upload multiple files", async ({ page, checkAccessibility }) => {
  const file1Name = `${crypto.randomUUID()}.pdf`;
  const file2Name = `${crypto.randomUUID()}.pdf`;

  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const file1Path = EvidenceUploadPage.createFile(file1Name, 1024);
  const file2Path = EvidenceUploadPage.createFile(file2Name, 2 * 1024);

  await fileUploadForLineItemPage.uploadFiles(
    [file1Path, file2Path],
    async () => {
      await fileUploadForLineItemPage.checkFileRow(file1Name, /\d{1,3}%/, "Uploading");
      await fileUploadForLineItemPage.checkFileRow(file2Name, /\d{1,3}%/, "Uploading");
    },
  );

  await fileUploadForLineItemPage.checkFileRow(file1Name, "1KB", "Uploaded");
  await fileUploadForLineItemPage.checkFileRow(file2Name, "2KB", "Uploaded");

  await checkAccessibility();
});
