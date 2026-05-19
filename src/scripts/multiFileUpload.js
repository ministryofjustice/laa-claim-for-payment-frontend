import { MultiFileUpload } from '@ministryofjustice/frontend';
import { patchMultiFileUpload } from './multiFileUploadPatched.js';

const $multiFileUpload = document.querySelector(
  '[data-module="moj-multi-file-upload"]',
);

const configEl = document.getElementById('multi-file-upload-config');
const { uploadUrl, deleteUrl, csrfToken } = configEl?.dataset ?? {};

if (
  $multiFileUpload !== null &&
  uploadUrl !== undefined &&
  deleteUrl !== undefined &&
  csrfToken !== undefined
) {
  patchMultiFileUpload(csrfToken);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-new -- Constructor initialises MOJ component; package has weak typings.
  new MultiFileUpload($multiFileUpload, {
    uploadUrl,
    deleteUrl,
    hooks: {
      entryHook: () => {
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