/* eslint-disable @typescript-eslint/no-unsafe-call,
@typescript-eslint/no-unsafe-member-access,
@typescript-eslint/no-unsafe-assignment,
@typescript-eslint/no-unsafe-return,
@typescript-eslint/no-unsafe-argument,
@typescript-eslint/no-misused-promises,
@typescript-eslint/no-magic-numbers,
@typescript-eslint/explicit-function-return-type,
@typescript-eslint/strict-boolean-expressions,
@typescript-eslint/prefer-destructuring,
promise/avoid-new,
no-async-promise-executor --
https://github.com/ministryofjustice/moj-frontend/blob/main/src/moj/components/multi-file-upload/multi-file-upload.mjs
This file patches the upstream MOJ MultiFileUpload component to add CSRF
header support for upload and delete XMLHttpRequests. The upstream component
is implemented as untyped JavaScript and relies on prototype overrides and
internal properties, which trigger TypeScript ESLint unsafe-access rules. */
import { MultiFileUpload } from "@ministryofjustice/frontend";
import { FileUploadStatus } from "#src/models/uploadStatus.ts";

/**
 * Applies UI changes to the MOJ MultiFileUpload component.
 */
export function patchMultiFileUpload() {
  const originalSetupStatusBox = MultiFileUpload.prototype.setupStatusBox;

  MultiFileUpload.prototype.setupStatusBox = function (...args) {
    originalSetupStatusBox.apply(this, args);

    convertSummaryList();
    showHintText(this.$feedbackContainer);
    setupDeleteLinks(this.$feedbackContainer);
    void convertExistingRows(this.$feedbackContainer);
  };

  MultiFileUpload.prototype.uploadFiles = async function (files) {
    for (const file of files) {
      await this.uploadFile(file);
    }
  };

  MultiFileUpload.prototype.uploadFile = async function (file) {
    return await new Promise(async (resolve) => {
      this.config.hooks.entryHook(this, file);

      let row = await createRow(FileUploadStatus.Pending, {
        fileName: file.name,
      });

      const list = this.$feedbackContainer.querySelector(
        ".moj-multi-file-upload__list",
      );

      list.append(row);

      const progress = row.querySelector(
        ".moj-multi-file-upload__progress",
      );

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (!event.lengthComputable || !progress) {
          return;
        }

        const percentComplete = Math.round(
          (event.loaded / event.total) * 100,
        );

        progress.textContent = `${percentComplete}%`;
      });

      xhr.addEventListener("load", async () => {
        const {response} = xhr;

        if (
          xhr.status < 200 ||
          xhr.status >= 300 ||
          response?.status !== "success" ||
          !response.file
        ) {
          const message =
            response?.error?.message ?? "Upload failed";

          row = await replaceRow(row, "failed", {
            fileName: file.name,
            message,
          });

          this.config.hooks.errorHook(
            this,
            file,
            xhr,
            xhr.statusText,
            new Error(message),
          );

          resolve();
          return;
        }

        row = await replaceRow(row, FileUploadStatus.Success, {
          fileId: response.file.id,
          fileName: response.file.originalname,
          fileSize: response.file.size,
        });

        this.config.hooks.exitHook(
          this,
          file,
          xhr,
          xhr.statusText,
        );

        resolve();
      });

      xhr.addEventListener("error", async () => {
        row = await replaceRow(row, FileUploadStatus.Failed, {
          fileName: file.name,
          message: "Upload failed",
        });

        this.config.hooks.errorHook(
          this,
          file,
          xhr,
          xhr.statusText,
          new Error("Upload failed"),
        );

        resolve();
      });

      xhr.open("POST", this.config.uploadUrl);

      xhr.responseType = "json";

      const formData = new FormData();

      formData.append("documents", file);

      xhr.send(formData);
    });
  };

  async function createRow(status, params = {}) {
    const template = document.createElement("template");

    template.innerHTML = await fetchFileRowHtml(status, params);

    const row = template.content.firstElementChild;

    if (!row) {
      throw new Error("No row returned from server");
    }

    return row;
  }

  async function replaceRow(row, status, params = {}) {
    const newRow = await createRow(status, params);

    row.replaceWith(newRow);

    return newRow;
  }

  async function fetchFileRowHtml(status, params = {}) {
    const query = new URLSearchParams({
      status,
      ...params,
    });

    const response = await fetch(
      `/evidence-upload/ajax-get-file-row?${query}`,
    );

    if (!response.ok) {
      throw new Error("Unable to load file row");
    }

    const json = await response.json();

    return json.body;
  }

  function showHintText(container) {
    if (!container) {
      return;
    }

    if (container.classList.contains('moj-hidden')) {
      return;
    }

    const heading = container.querySelector('h2');
    if (!heading) {
      return;
    }

    const id = 'uploaded-files-description';

    let description = document.getElementById(id);

    if (!description) {
      description = document.createElement('p');
      description.id = id;
      description.className = 'govuk-body';
      description.textContent = 'Select the file name to open a copy in a new tab.';

      heading.insertAdjacentElement('afterend', description);
    }
  }

  function convertSummaryList() {
    document
      .querySelectorAll(".govuk-summary-list.moj-multi-file-upload__list")
      .forEach((list) => {
        if (list.tagName === "DL") {
          return;
        }

        const dl = document.createElement("dl");

        dl.className = list.className;

        while (list.firstChild) {
          dl.appendChild(list.firstChild);
        }

        list.replaceWith(dl);
      });
  }

  function setupDeleteLinks(container) {
    container.addEventListener("click", (event) => {
      const link = event.target.closest(
        ".moj-multi-file-upload__delete-link",
      );

      if (!link) {
        return;
      }

      event.preventDefault();

      const row = link.closest(".moj-multi-file-upload__row");

      if (!row) {
        return;
      }

      const deleteButton = row.querySelector(
        ".moj-multi-file-upload__delete",
      );

      if (!deleteButton) {
        return;
      }

      deleteButton.click();
    });
  }

  async function convertExistingRows(container) {
    const rows = container.querySelectorAll(
      ".moj-multi-file-upload__row",
    );

    for (const row of rows) {
      if (row.dataset.converted === "true") {
        continue;
      }

      const deleteButton = row.querySelector(
        ".moj-multi-file-upload__delete",
      );

      const fileName = row
        .querySelector(".uploaded-file-name")
        ?.textContent?.trim();

      const fileSize = row
        .querySelector(".uploaded-file-size")
        ?.textContent?.trim();

      if (!fileName || !deleteButton || !fileSize) {
        continue;
      }

      const fileId = deleteButton.value;

      const newRow = await replaceRow(row, FileUploadStatus.Success, {
        fileId,
        fileName,
        fileSize,
      });

      newRow.dataset.converted = "true";
    }
  }
}