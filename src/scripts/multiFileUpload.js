import { MultiFileUpload } from '@ministryofjustice/frontend';

const UPLOAD_URL_ARGUMENT_INDEX = 1;

const $multiFileUpload = document.querySelector(
  '[data-module="moj-multi-file-upload"]',
);

const configEl = document.getElementById('multi-file-upload-config');

const uploadUrl = configEl?.dataset.uploadUrl;
const deleteUrl = configEl?.dataset.deleteUrl;
const csrfToken = configEl?.dataset.csrfToken;

if (
  $multiFileUpload !== null &&
  uploadUrl !== undefined &&
  deleteUrl !== undefined &&
  csrfToken !== undefined
) {
  const originalOpen = XMLHttpRequest.prototype.open.bind(
    XMLHttpRequest.prototype,
  );

  XMLHttpRequest.prototype.open = function (...args) {
    const urlArgument = /** @type {unknown} */ (
      args.at(UPLOAD_URL_ARGUMENT_INDEX)
    );

    const url = typeof urlArgument === 'string' ? urlArgument : '';

    originalOpen.apply(this, args);

    if (url.includes(uploadUrl) || url.includes(deleteUrl)) {
      this.setRequestHeader('x-csrf-token', csrfToken);
    }

    return undefined;
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-new -- Constructor initialises MOJ component; package has weak typings.
  new MultiFileUpload($multiFileUpload, {
    uploadUrl,
    deleteUrl,
    hooks: {
       
      entryHook: (upload) => {
        const errorRows = document.querySelectorAll(
          '.moj-multi-file-upload__error',
        );

        errorRows.forEach((error) => {
          error.closest('.moj-multi-file-upload__row')?.remove();
        });
      },
    },
  });
}