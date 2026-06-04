/* eslint-disable @typescript-eslint/no-unsafe-call,
@typescript-eslint/no-unsafe-member-access,
@typescript-eslint/no-unsafe-assignment,
@typescript-eslint/explicit-function-return-type,
@typescript-eslint/strict-boolean-expressions,
@typescript-eslint/prefer-destructuring --
https://github.com/ministryofjustice/moj-frontend/blob/main/src/moj/components/multi-file-upload/multi-file-upload.mjs
This file patches the upstream MOJ MultiFileUpload component to add CSRF
header support for upload and delete XMLHttpRequests. The upstream component
is implemented as untyped JavaScript and relies on prototype overrides and
internal properties, which trigger TypeScript ESLint unsafe-access rules. */
import { MultiFileUpload } from '@ministryofjustice/frontend';

/**
 * Applies UI changes to the MOJ MultiFileUpload component.
 */
export function patchMultiFileUpload() {

  const originalSetupStatusBox = MultiFileUpload.prototype.setupStatusBox;
  MultiFileUpload.prototype.setupStatusBox = function (...args) {
    originalSetupStatusBox.apply(this, args);

    const originalExitHook = this.config.hooks.exitHook;
    this.config.hooks.exitHook = (...hookArgs) => {
      if (typeof originalExitHook === 'function') {
        originalExitHook.apply(this, hookArgs);
      }

      amendFeedbackContainer(this.$feedbackContainer);
    };

    amendFeedbackContainer(this.$feedbackContainer);
  };
  
  function amendFeedbackContainer(container) {
    showHintText(container);
    convertRows(container);
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

  function convertRows(root) {
    const rows = root.querySelectorAll('.moj-multi-file-upload__row');

    rows.forEach((row) => {
      if (row.dataset.converted === 'true') {
        return;
      }

      const fileLink = row.querySelector('.uploaded-file-name');
      const fileSize = row.querySelector('.uploaded-file-size');
      const uploadedTag = row.querySelector('.govuk-tag');
      const deleteButton = row.querySelector('.moj-multi-file-upload__delete');
      const value = row.querySelector('.govuk-summary-list__value');
      const actions = row.querySelector('.govuk-summary-list__actions');

      if (!fileLink || !fileSize || !uploadedTag || !deleteButton || !value || !actions) {
        return;
      }

      let key = row.querySelector('.govuk-summary-list__key');
      if (!key) {
        key = document.createElement('div');
        key.className = 'govuk-summary-list__key';
        row.prepend(key);
      }
      key.innerHTML = '';
      key.appendChild(fileLink);

      value.innerHTML = '';
      fileSize.classList.add('govuk-!-margin-right-2'); // spacing
      value.appendChild(fileSize);
      value.appendChild(uploadedTag);

      const link = document.createElement('a');
      link.href = '#';
      link.className = 'govuk-link';
      link.textContent = 'Delete';
      const hidden = document.createElement('span');
      hidden.className = 'govuk-visually-hidden';
      hidden.textContent = ` ${fileLink.textContent}`;
      link.appendChild(hidden);
      link.addEventListener('click', (e) => {
        e.preventDefault();
        deleteButton.click();
      });
      deleteButton.classList.add('govuk-visually-hidden');
      actions.appendChild(link);

      row.setAttribute('data-converted', 'true');
    });
  }
}