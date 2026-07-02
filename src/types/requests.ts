import type { Request } from "express";
import type * as i18next from "#node_modules/i18next/index.js";

export type MulterRequest = Request &
  WithTranslation & {
    file?: Express.Multer.File;
  };

export type DeleteFileRequest = Request<
  Record<string, string>,
  unknown,
  { delete: string; name: string }
> &
  WithTranslation;

interface WithTranslation {
  t: i18next.TFunction;
}