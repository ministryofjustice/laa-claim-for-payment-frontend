import type { Request } from "express";
import type * as i18next from "#node_modules/i18next/index.js";
import type { AxiosInstanceWrapper } from "#src/types/axios-instance-wrapper.js";

export type MulterRequest = Request &
  WithTranslation & {
    file?: Express.Multer.File;
    axiosMiddleware: AxiosInstanceWrapper;
  };

export type DeleteFileRequest = Request<
  Record<string, string>,
  unknown,
  { delete: string; name: string }
> &
  WithTranslation & {
    axiosMiddleware: AxiosInstanceWrapper;
  };

interface WithTranslation {
  t: i18next.TFunction;
}
