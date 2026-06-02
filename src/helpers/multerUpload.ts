import createHttpError from 'http-errors';
import multer from 'multer';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const PDF_MIME_TYPE = 'application/pdf';

/**
 * Multer configuration for uploading evidence files.
 */
export const evidenceUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== PDF_MIME_TYPE) {
      callback(
        new createHttpError.UnsupportedMediaType(
          'Only PDF files can be uploaded',
        ),
      );

      return;
    }

    callback(null, true);
  },
});