import config from '#config.js';
import { escapeHtml } from '#src/helpers/escapehtml.js';
import { formatFileSize } from '#src/helpers/fileSizeFormatter.js';
import type { UploadResponse } from '#src/types/api-types.js';


interface UploadEvidenceParams {
  axiosMiddleware: {
    post: (url: string, body: FormData) => Promise<{ data: unknown }>;
  };
  claimId: number;
  lineItemId: number;
  file: Express.Multer.File;
}

/**
 * Uploads evidence for a claim line item and returns a response for the multi-file upload component.
 *
 * @param {UploadEvidenceParams} params Upload evidence parameters.
 * @param {UploadEvidenceParams['axiosMiddleware']} params.axiosMiddleware Axios middleware used to call the backend API.
 * @param {number} params.claimId Claim ID.
 * @param {number} params.lineItemId Line item ID.
 * @param {object} params.file Uploaded file from multer.
 * @returns {Promise<object>} Upload response for the multi-file upload component.
 */
export async function uploadLineItemEvidence(
  params: UploadEvidenceParams,): Promise<UploadResponse> {
  const formData = new FormData();
  const { axiosMiddleware, claimId, lineItemId, file } = params;

  const arrayBuffer = new ArrayBuffer(file.buffer.byteLength);
  const view = new Uint8Array(arrayBuffer);

view.set(file.buffer);

  formData.append(
  'documents',
  new Blob([arrayBuffer], { type: file.mimetype }),
  file.originalname,
  );

  await axiosMiddleware.post(
    `${config.api.baseUrl}/api/v1/claims/${claimId}/line-items/${lineItemId}/upload-evidence`,
    formData,
  );

  return {
    success: {
      messageText: `${file.originalname} uploaded`,
      messageHtml: `
        <span class="uploaded-file-row">
          <a href="#" class="govuk-link uploaded-file-name">${escapeHtml(file.originalname)}</a>
          <span class="uploaded-file-size govuk-!-margin-left-2">${formatFileSize(file.size)}</span>
          <strong class="govuk-tag govuk-tag--green govuk-!-margin-left-4">Uploaded</strong>
        </span>
      `
    },
    file: {
      filename: file.originalname,
      originalname: file.originalname,
    },
  };
}