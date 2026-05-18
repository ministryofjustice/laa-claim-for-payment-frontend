import { MultiFileUpload } from '@ministryofjustice/frontend';

const $multiFileUpload = document.querySelector(
  '[data-module="moj-multi-file-upload"]',
);

if ($multiFileUpload !== null) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-new -- Constructor initialises the MOJ multi-file-upload component; package has weak typings.
  new MultiFileUpload($multiFileUpload, {
    uploadUrl: '/ajax-upload',
    deleteUrl: '/ajax-delete',
  });
}