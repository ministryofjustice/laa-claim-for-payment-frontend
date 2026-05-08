import { UploadStatus } from "#src/models/uploadStatus.js";

export const UploadStatusTagClass: Record<UploadStatus, string> = {
  [UploadStatus.NotUploaded]: "govuk-tag--blue",
  [UploadStatus.Uploaded]: "govuk-tag--green",
};
