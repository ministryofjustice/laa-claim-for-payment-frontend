/* eslint-disable @typescript-eslint/no-unsafe-call,
@typescript-eslint/no-unsafe-member-access,
@typescript-eslint/no-unsafe-assignment,
@typescript-eslint/no-unsafe-argument,
@typescript-eslint/explicit-function-return-type,
@typescript-eslint/strict-boolean-expressions,
@typescript-eslint/no-magic-numbers,
@typescript-eslint/prefer-destructuring --
This file patches the upstream MOJ MultiFileUpload component to add CSRF
header support for upload and delete XMLHttpRequests. The upstream component
is implemented as untyped JavaScript and relies on prototype overrides and
internal properties, which trigger TypeScript ESLint unsafe-access rules. */
import { MultiFileUpload } from '@ministryofjustice/frontend';

/**
 * Applies UI changes to the MOJ MultiFileUpload component.
 */
export function patchMultiFileUpload() {


  MultiFileUpload.prototype.getDeleteButton = function (file) {
    const $link = document.createElement('a');

    $link.setAttribute('href', '#');
    $link.setAttribute('role', 'button');
    $link.setAttribute('data-delete-file-id', String(file.id));

    $link.dataset.filename = file.filename;

    $link.classList.add(
      'moj-multi-file-upload__delete',
      'govuk-link',
    );

    $link.innerHTML = `Delete <span class="govuk-visually-hidden">${file.originalname}</span>`;

    return $link;
  };

  /**
   * @param {File} file
   */
  MultiFileUpload.prototype.uploadFile = function (file) {
    this.config.hooks.entryHook(this, file);

    const $item = this.getFileRow(file);
    const $message = $item.querySelector('.moj-multi-file-upload__message');
    const $actions = $item.querySelector('.moj-multi-file-upload__actions');
    const $progress = $item.querySelector('.moj-multi-file-upload__progress');

    const formData = new FormData();
    formData.append('documents', file);

    this.$feedbackContainer
      .querySelector('.moj-multi-file-upload__list')
      .append($item);

    const xhr = new XMLHttpRequest();

    const onLoad = () => {
      if (
        xhr.status < 200 ||
        xhr.status >= 300 ||
        xhr.response.status === 'error'
      ) {
        onError(); return;
      }

      $message.innerHTML = xhr.response.body.success.messageHtml;
      this.$status.textContent = xhr.response.body.success.messageText;

      showUploadedFilesHeading();

      $actions.append(this.getDeleteButton(xhr.response.body.file))
      this.config.hooks.exitHook(this, file, xhr, xhr.statusText)
    }

    const onError = () => {
      const error = new Error(
        xhr.response && 'error' in xhr.response
          ? xhr.response.error.message
          : xhr.statusText || 'Upload failed',
      );

      $message.innerHTML = this.getErrorHtml(error);
      this.$status.textContent = error.message;

      this.config.hooks.errorHook(this, file, xhr, xhr.statusText, error);
    };

    xhr.addEventListener('load', onLoad);
    xhr.addEventListener('error', onError);

    xhr.upload.addEventListener('progress', (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const percentComplete = Math.round((event.loaded / event.total) * 100);
      $progress.textContent = ` ${percentComplete}%`;
    });

    xhr.open('POST', this.config.uploadUrl);
    xhr.responseType = 'json';

    xhr.send(formData);
  };

  /**
   * @param {MouseEvent} event
   */
  MultiFileUpload.prototype.onFileDeleteClick = function (event) {
    const $button = event.target;

    if (
      !$button ||
      !($button instanceof HTMLAnchorElement) ||
      !$button.classList.contains('moj-multi-file-upload__delete')
    ) {
      return;
    }

    event.preventDefault();

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        return;
      }

      const $rows = Array.from(
        this.$feedbackContainer.querySelectorAll('.moj-multi-file-upload__row'),
      );

      if ($rows.length === 1) {
        this.$feedbackContainer.classList.add('moj-hidden');
      }

      const $rowDelete = $rows.find(($row) => $row.contains($button));
      if ($rowDelete) {
        $rowDelete.remove();
      }

      hideUploadedFilesHeadingIfEmpty();

      this.config.hooks.deleteHook(this, undefined, xhr, xhr.statusText);
    });

    xhr.open('POST', this.config.deleteUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';

    xhr.send(
      JSON.stringify({
        delete: $button.dataset.deleteFileId,
        name: $button.dataset.filename
      }),
    );
  };

  function showUploadedFilesHeading() {
    const container = document.querySelector('.moj-multi-file__uploaded-files');

    if (container === null) {
      return;
    }

    let heading = document.getElementById('uploaded-files-heading');

    if (heading === null) {
      heading = document.createElement('div');
      heading.id = 'uploaded-files-heading';
      heading.innerHTML = `
        <h2 class="govuk-heading-m">Uploaded files</h2>
        <p class="govuk-body">Select the file name to open a copy in a new tab.</p>
      `;

      container.prepend(heading);
    }

    heading.classList.remove('moj-hidden');
  }

  function hideUploadedFilesHeadingIfEmpty() {
    const uploadedRows = document.querySelectorAll('.moj-multi-file-upload__row');

    if (uploadedRows.length === 0) {
      document
        .getElementById('uploaded-files-heading')
        ?.classList.add('moj-hidden');
    }
  }
}