import { expect, test } from "../../fixtures/index.js";
import {
  claim1Id,
  claim3Id,
} from "#tests/playwright/factories/handlers/api.js";
import { PoaEvidenceUploadPage } from "#tests/playwright/pages/poa/PoaEvidenceUploadPage.js";
import { EvidenceUploadPage } from "#tests/playwright/pages/base/EvidenceUploadPage.js";

test("upload a file then delete the file", async ({
  page,
  checkAccessibility,
}) => {
  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 1024,
    },
  ]);

  await expect(poaEvidenceUploadPage.uploadedFilesContainer).toHaveClass(
    /moj-hidden/,
  );
  await expect(poaEvidenceUploadPage.uploadedFilesHeading).not.toBeVisible();
  await expect(poaEvidenceUploadPage.uploadedFilesHintText).not.toBeVisible();

  await poaEvidenceUploadPage.uploadFiles([file.path]);

  await expect(poaEvidenceUploadPage.uploadedFilesContainer).not.toHaveClass(
    /moj-hidden/,
  );
  await expect(poaEvidenceUploadPage.uploadedFilesHeading).toBeVisible();
  await expect(poaEvidenceUploadPage.uploadedFilesHintText).toBeVisible();

  await poaEvidenceUploadPage.checkFileRow(file.name, "1KB", "Uploaded");

  await poaEvidenceUploadPage.deleteFile(file.name);

  await expect(poaEvidenceUploadPage.uploadedFilesContainer).toHaveClass(
    /moj-hidden/,
  );
  await expect(poaEvidenceUploadPage.uploadedFilesHeading).not.toBeVisible();
  await expect(poaEvidenceUploadPage.uploadedFilesHintText).not.toBeVisible();

  await checkAccessibility();
});

test("upload a file of invalid type", async ({ page, checkAccessibility }) => {
  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "mov",
      size: 1024,
    },
  ]);

  await poaEvidenceUploadPage.resetGate();

  await poaEvidenceUploadPage.uploadFiles([file.path]);

  await poaEvidenceUploadPage.releaseGate();

  await poaEvidenceUploadPage.checkFileRow(
    file.name,
    "Only PDF, Word, RTF or TIFF files can be uploaded",
    "Failed",
  );

  await checkAccessibility();
});

test("upload a file of maximum size", async ({ page, checkAccessibility }) => {
  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 500 * 1024,
    },
  ]);

  await poaEvidenceUploadPage.uploadFiles([file.path]);

  await poaEvidenceUploadPage.checkFileRow(file.name, "500KB", "Uploaded");

  await checkAccessibility();
});

test("upload a file of invalid size", async ({ page, checkAccessibility }) => {
  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 500 * 1024 + 1,
    },
  ]);

  await poaEvidenceUploadPage.uploadFiles([file.path]);

  await poaEvidenceUploadPage.checkFileRow(
    file.name,
    "File must not be larger than 500KB",
    "Failed",
  );

  await checkAccessibility();
});

test("fail to upload a file", async ({ page, checkAccessibility }) => {
  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim3Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 1024,
    },
  ]);

  await poaEvidenceUploadPage.uploadFiles([file.path]);

  await poaEvidenceUploadPage.checkFileRow(
    file.name,
    "Upload failed",
    "Failed",
  );

  await checkAccessibility();
});

test("upload an empty file", async ({ page, checkAccessibility }) => {
  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const [file] = EvidenceUploadPage.createFiles([
    {
      type: "pdf",
      size: 0,
    },
  ]);

  await poaEvidenceUploadPage.uploadFiles([file.path]);

  await poaEvidenceUploadPage.checkFileRow(
    file.name,
    "The selected file is empty",
    "Failed",
  );

  await checkAccessibility();
});

test("upload multiple files", async ({ page, checkAccessibility }) => {
  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

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

  await poaEvidenceUploadPage.resetGate();

  await poaEvidenceUploadPage.uploadFiles(
    [file1.path, file2.path],
    async () => {
      await poaEvidenceUploadPage.checkFileRow(file1.name, "%", "Uploading");
      await poaEvidenceUploadPage.checkFileRow(file2.name, "%", "Uploading");
    },
  );

  await poaEvidenceUploadPage.releaseGate();

  await poaEvidenceUploadPage.checkFileRow(file1.name, "1KB", "Uploaded");
  await poaEvidenceUploadPage.checkFileRow(file2.name, "2KB", "Uploaded");

  await checkAccessibility();
});
