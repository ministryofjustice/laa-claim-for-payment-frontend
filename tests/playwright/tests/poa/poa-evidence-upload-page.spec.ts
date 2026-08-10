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
  const fileName = `${crypto.randomUUID()}.pdf`;

  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const filePath = EvidenceUploadPage.createFile(fileName, 1024);

  await expect(poaEvidenceUploadPage.uploadedFilesContainer).toHaveClass(
    /moj-hidden/,
  );
  await expect(poaEvidenceUploadPage.uploadedFilesHeading).not.toBeVisible();
  await expect(poaEvidenceUploadPage.uploadedFilesHintText).not.toBeVisible();

  await poaEvidenceUploadPage.resetGate();

  await poaEvidenceUploadPage.fileUploadInput.uploadFiles([filePath]);

  await poaEvidenceUploadPage.releaseGate();

  await expect(poaEvidenceUploadPage.uploadedFilesContainer).not.toHaveClass(
    /moj-hidden/,
  );
  await expect(poaEvidenceUploadPage.uploadedFilesHeading).toBeVisible();
  await expect(poaEvidenceUploadPage.uploadedFilesHintText).toBeVisible();

  await poaEvidenceUploadPage.checkFileRow(fileName, "1KB", "Uploaded");

  await poaEvidenceUploadPage.deleteFile(fileName);

  await expect(poaEvidenceUploadPage.uploadedFilesContainer).toHaveClass(
    /moj-hidden/,
  );
  await expect(poaEvidenceUploadPage.uploadedFilesHeading).not.toBeVisible();
  await expect(poaEvidenceUploadPage.uploadedFilesHintText).not.toBeVisible();

  await checkAccessibility();
});

test("upload a file of invalid type", async ({ page, checkAccessibility }) => {
  const fileName = `${crypto.randomUUID()}.mov`;

  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const filePath = EvidenceUploadPage.createFile(fileName, 1024);

  await poaEvidenceUploadPage.resetGate();

  await poaEvidenceUploadPage.fileUploadInput.uploadFiles([filePath]);

  await poaEvidenceUploadPage.releaseGate();

  await poaEvidenceUploadPage.checkFileRow(
    fileName,
    "Only PDF, Word, RTF or TIFF files can be uploaded",
    "Failed",
  );

  await checkAccessibility();
});

test("upload a file of invalid size", async ({ page, checkAccessibility }) => {
  const fileName = `${crypto.randomUUID()}.pdf`;

  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const filePath = EvidenceUploadPage.createFile(fileName, 10 * 1024 * 1024);

  await poaEvidenceUploadPage.resetGate();

  await poaEvidenceUploadPage.fileUploadInput.uploadFiles([filePath]);

  await poaEvidenceUploadPage.releaseGate();

  await poaEvidenceUploadPage.checkFileRow(
    fileName,
    "File must not be larger than 10MB",
    "Failed",
  );

  await checkAccessibility();
});

test("fail to upload a file", async ({ page, checkAccessibility }) => {
  const fileName = `${crypto.randomUUID()}.pdf`;

  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim3Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const filePath = EvidenceUploadPage.createFile(fileName, 1024);

  await poaEvidenceUploadPage.resetGate();

  await poaEvidenceUploadPage.fileUploadInput.uploadFiles([filePath]);

  await poaEvidenceUploadPage.releaseGate();

  await poaEvidenceUploadPage.checkFileRow(fileName, "Upload failed", "Failed");

  await checkAccessibility();
});

test("upload an empty file", async ({ page, checkAccessibility }) => {
  const fileName = `${crypto.randomUUID()}.pdf`;

  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const filePath = EvidenceUploadPage.createFile(fileName, 0);

  await poaEvidenceUploadPage.resetGate();

  await poaEvidenceUploadPage.fileUploadInput.uploadFiles([filePath]);

  await poaEvidenceUploadPage.releaseGate();

  await poaEvidenceUploadPage.checkFileRow(
    fileName,
    "The selected file is empty",
    "Failed",
  );

  await checkAccessibility();
});

test("upload multiple files", async ({ page, checkAccessibility }) => {
  const file1Name = `${crypto.randomUUID()}.pdf`;
  const file2Name = `${crypto.randomUUID()}.pdf`;

  const poaEvidenceUploadPage = new PoaEvidenceUploadPage(page, claim1Id);

  await poaEvidenceUploadPage.navigate();
  await poaEvidenceUploadPage.waitForLoad();

  const file1Path = EvidenceUploadPage.createFile(file1Name, 1024);
  const file2Path = EvidenceUploadPage.createFile(file2Name, 2 * 1024);

  await poaEvidenceUploadPage.resetGate();

  await poaEvidenceUploadPage.fileUploadInput.uploadFiles([
    file1Path,
    file2Path,
  ]);

  await poaEvidenceUploadPage.checkFileRow(file1Name, "%", "Uploading");
  await poaEvidenceUploadPage.checkFileRow(file2Name, "%", "Uploading");

  await poaEvidenceUploadPage.releaseGate();

  await poaEvidenceUploadPage.checkFileRow(file1Name, "1KB", "Uploaded");
  await poaEvidenceUploadPage.checkFileRow(file2Name, "2KB", "Uploaded");

  await checkAccessibility();
});
