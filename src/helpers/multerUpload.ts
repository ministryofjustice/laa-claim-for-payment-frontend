import createHttpError from "http-errors";
import multer from "multer";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/tiff",
  "application/rtf",
  "text/rtf",
]);

/**
 * Returns whether a MIME type is supported for evidence uploads.
 *
 * @param {string} mimeType MIME type to validate.
 * @returns {boolean} True if the MIME type is supported.
 */
export function isAllowedEvidenceMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType);
}

/**
 * Multer configuration for uploading evidence files.
 */
export const evidenceUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, callback) => {
    if (!isAllowedEvidenceMimeType(file.mimetype)) {
      callback(
        new createHttpError.UnsupportedMediaType(
          "Only PDF, TIFF and RTF files can be uploaded",
        ),
      );
      return;
    }

    callback(null, true);
  },
});