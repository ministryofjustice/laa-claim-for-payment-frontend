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
import { formatFileSize } from '#src/helpers/fileSizeFormatter.js';
import { MultiFileUpload } from '@ministryofjustice/frontend';

/**
 * Applies CSRF-aware patches to the MOJ MultiFileUpload component.
 *
 * @param {string} csrfToken
 */
export function patchMultiFileUpload(csrfToken) {
  if (csrfToken === '') {
    return;
  }

  MultiFileUpload.prototype.getDeleteButton = function (file) {
    const $link = document.createElement('a');

    $link.setAttribute('href', '#');
    $link.setAttribute('role', 'button');
    $link.setAttribute('data-delete-file-id', file.filename);

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
    // const $actions = $item.querySelector('.moj-multi-file-upload__actions');
    const $progress = $item.querySelector('.moj-multi-file-upload__progress');

    const formData = new FormData();
    formData.append('documents', file);

    // this.$feedbackContainer
    //   .querySelector('.moj-multi-file-upload__list')
    //   .append($item);

    const xhr = new XMLHttpRequest();

        const onLoad = () => {
      if (
        xhr.status < 200 ||
        xhr.status >= 300 ||
        !('success' in xhr.response)
      ) {
        onError(); return;
      }

      // $message.innerHTML = xhr.response.success.messageHtml;
      // this.$status.textContent = xhr.response.success.messageText;

      showUploadedFilesHeading(file);

      // $actions.append(this.getDeleteButton(xhr.response.file))
      // this.config.hooks.exitHook(this, file, xhr, xhr.statusText)
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
    xhr.setRequestHeader('x-csrf-token', csrfToken);
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
    xhr.setRequestHeader('x-csrf-token', csrfToken);
    xhr.responseType = 'json';

    xhr.send(
      JSON.stringify({
        delete: $button.dataset.deleteFileId,
      }),
    );
  };

   function showUploadedFilesHeading(file) {
    const container = document.querySelector('.moj-multi-file__uploaded-files');

    if (container === null) {
      return;
    }

    const heading = document.getElementById('uploaded-files-heading');

    if (heading === null) {
      addSummaryListRow(file, file.name, file.size, "Delete", "#");
    }
  }

  function hideUploadedFilesHeadingIfEmpty() {
    const uploadedRows = document.querySelectorAll('.moj-multi-file-upload__row');

    if (uploadedRows.length === 0) {
      document
        .getElementById('uploaded-files-heading')
        ?.classList.add('moj-hidden');
    }
  }

  function addSummaryListRow(file, keyText, actionText, actionHref) 
  {

    const summaryList = document.getElementById("uploaded-files");

    if (!summaryList) {
      // console.error("Summary list with id 'uploaded-files' not found");
      return; // If there is no summary list create one with H2
    }

    // Create row
    const row = document.createElement("div");
    row.className = "govuk-summary-list__row";

    // Key
    const key = document.createElement("dt");
    key.className = "govuk-summary-list__key";
    key.textContent = keyText;

    const value = document.createElement("dd");
    value.className = "govuk-summary-list__value";

    // Append real DOM instead of HTML string
    value.appendChild(createUploadedFileValue(file));

    // Actions (optional)
    const actions = document.createElement("dd");
    actions.className = "govuk-summary-list__actions";

    if (actionText && actionHref) {
      const link = document.createElement("a");
      link.className = "govuk-link";
      link.href = actionHref;
      link.textContent = actionText;

      actions.appendChild(link);
    }

    // Append elements to row
    row.appendChild(key);
    row.appendChild(value);
    row.appendChild(actions);

    // Append row to summary list
    summaryList.prepend(row);
  }

  function createUploadedFileValue(file) {
  const wrapper = document.createElement("span");
  wrapper.className = "uploaded-file-row";

  // // File name (text node)
  // wrapper.appendChild(document.createTextNode(file.name));

  // File size
  const size = document.createElement("span");
  size.className = "uploaded-file-size govuk-!-margin-left-2";
  size.textContent = formatFileSize(file.size);

  // Tag
  const tag = document.createElement("strong");
  tag.className = "govuk-tag govuk-tag--green govuk-!-margin-left-4";
  tag.textContent = "Uploaded";

  // Assemble
  wrapper.appendChild(size);
  wrapper.appendChild(tag);

  return wrapper;
}
}