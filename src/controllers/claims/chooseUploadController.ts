import { buildRoute, ROUTES } from "#routes/helper.js";
import { processError } from "#src/helpers/index.js";
import type { NextFunction, Request, Response } from "express";
import { RadioField } from "#src/helpers/fields.js";
import { RadioQuestionForm } from "#src/helpers/radioQuestionValidation.js";
import {
  type RadioQuestionOptions,
  RadioQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import { UUID } from "uuidv7";

enum FileUploadChoice {
  AllAtOnce = "all-at-once",
  AssociatedToLineItems = "associated-to-line-items",
}

function buildChoices(
  messagePrefix: string,
): ReadonlyArray<RadioQuestionOptions<FileUploadChoice>> {
  return [
    {
      value: FileUploadChoice.AllAtOnce,
      text: {
        key: `${messagePrefix}.allAtOnce.text`,
      },
      hint: {
        text: {
          key: `${messagePrefix}.allAtOnce.hint`,
        },
      },
    },
    {
      value: FileUploadChoice.AssociatedToLineItems,
      text: {
        key: `${messagePrefix}.associatedToLineItems.text`,
      },
      hint: {
        text: {
          key: `${messagePrefix}.associatedToLineItems.hint`,
        },
      },
    },
  ];
}

/**
 * Display choose file upload page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export function chooseFileUpload(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const form = new RadioQuestionForm(buildField());

    res.render("main/radioQuestionPage.njk", {
      csrfToken: res.locals.csrfToken,
      vm: buildViewModel(form),
    });
  } catch (error) {
    next(processError(error, "rendering choose file upload page"));
  }
}

/**
 * Submit choose file upload page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export function submitChooseFileUpload(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const field = buildField();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[field.name];
    const form = new RadioQuestionForm(field);
    form.validate(selectedChoice);

    if (form.isNotValid()) {
      res.status(400).render("main/radioQuestionPage.njk", {
        csrfToken: res.locals.csrfToken,
        vm: buildViewModel(form),
      });
      return;
    }

    const claimId = UUID.parse(req.params.claimId);

    const redirectByChoice: Record<FileUploadChoice, string> = {
      [FileUploadChoice.AllAtOnce]: "/all-at-once-file-upload",
      [FileUploadChoice.AssociatedToLineItems]: buildRoute(
        ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY,
        { claimId },
      ),
    };

    res.redirect(redirectByChoice[form.getValue()]);
  } catch (error) {
    next(processError(error, "submitting choose file upload page"));
  }
}

function buildField(): RadioField<FileUploadChoice, FileUploadChoice> {
  const messagePrefix = "pages.chooseUpload";
  return new RadioField(
    messagePrefix,
    "fileUploadChoice",
    "fileUploadChoice",
    buildChoices(messagePrefix),
    (value: FileUploadChoice) => value,
  );
}

function buildViewModel(
  form: RadioQuestionForm<FileUploadChoice, FileUploadChoice>,
): RadioQuestionViewModel<FileUploadChoice, FileUploadChoice> {
  return new RadioQuestionViewModel({
    title: `${form.messagePrefix}.title`,
    form,
    isLegendPageHeading: true,
  });
}
