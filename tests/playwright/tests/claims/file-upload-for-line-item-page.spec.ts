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
  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 1024,
    },
  ]);

  await expect(fileUploadForLineItemPage.uploadedFilesContainer).toHaveClass(
    /moj-hidden/,
  );
  await expect(
    fileUploadForLineItemPage.uploadedFilesHeading,
  ).not.toBeVisible();
  await expect(
    fileUploadForLineItemPage.uploadedFilesHintText,
  ).not.toBeVisible();

  await fileUploadForLineItemPage.uploadFiles([file.path]);

  await expect(
    fileUploadForLineItemPage.uploadedFilesContainer,
  ).not.toHaveClass(/moj-hidden/);
  await expect(fileUploadForLineItemPage.uploadedFilesHeading).toBeVisible();
  await expect(fileUploadForLineItemPage.uploadedFilesHintText).toBeVisible();

  await fileUploadForLineItemPage.checkFileRow(file.name, "1KB", "Uploaded");

  await fileUploadForLineItemPage.deleteFile(file.name);

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
  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "mov",
      size: 1024,
    },
  ]);

  await fileUploadForLineItemPage.uploadFiles([file.path]);

  await fileUploadForLineItemPage.checkFileRow(
    file.name,
    "Only PDF, Word, RTF or TIFF files can be uploaded",
    "Failed",
  );

  await checkAccessibility();
});

test("upload a file of maximum size", async ({ page, checkAccessibility }) => {
  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 500 * 1024,
    },
  ]);

  await fileUploadForLineItemPage.uploadFiles([file.path]);

  await fileUploadForLineItemPage.checkFileRow(file.name, "500KB", "Uploaded");

  await checkAccessibility();
});

test("upload a file of invalid size", async ({ page, checkAccessibility }) => {
  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 500 * 1024 + 1,
    },
  ]);

  await fileUploadForLineItemPage.uploadFiles([file.path]);

  await fileUploadForLineItemPage.checkFileRow(
    file.name,
    "File must not be larger than 500KB",
    "Failed",
  );

  await checkAccessibility();
});

test("fail to upload a file", async ({ page, checkAccessibility }) => {
  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim3Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 1024,
    },
  ]);

  await fileUploadForLineItemPage.uploadFiles([file.path]);

  await fileUploadForLineItemPage.checkFileRow(
    file.name,
    "Upload failed",
    "Failed",
  );

  await checkAccessibility();
});

test("upload an empty file", async ({ page, checkAccessibility }) => {
  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 0,
    },
  ]);

  await fileUploadForLineItemPage.uploadFiles([file.path]);

  await fileUploadForLineItemPage.checkFileRow(
    file.name,
    "The selected file is empty",
    "Failed",
  );

  await checkAccessibility();
});

test("upload multiple files", async ({ page, checkAccessibility }) => {
  const fileUploadForLineItemPage = new FileUploadForLineItemPage(
    page,
    claim1Id,
    lineItemId,
  );

  await fileUploadForLineItemPage.navigate();
  await fileUploadForLineItemPage.waitForLoad();

  const [file1, file2] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 1024,
    },
    {
      type: "pdf",
      size: 2 * 1024,
    },
  ]);

  await fileUploadForLineItemPage.uploadFiles(
    [file1.path, file2.path],
    async () => {
      await fileUploadForLineItemPage.checkFileRow(
        file1.name,
        "%",
        "Uploading",
      );
      await fileUploadForLineItemPage.checkFileRow(
        file2.name,
        "%",
        "Uploading",
      );
    },
  );

  await fileUploadForLineItemPage.checkFileRow(file1.name, "1KB", "Uploaded");
  await fileUploadForLineItemPage.checkFileRow(file2.name, "2KB", "Uploaded");

  await checkAccessibility();
});
