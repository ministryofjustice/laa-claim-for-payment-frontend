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

const PREFIX = "pages.chooseUpload" as const;

enum FileUploadChoice {
  AllAtOnce = "all-at-once",
  AssociatedToLineItems = "associated-to-line-items",
}

const FILE_UPLOAD_CHOICES: ReadonlyArray<
  RadioQuestionOptions<FileUploadChoice>
> = [
  {
    value: FileUploadChoice.AllAtOnce,
    text: {
      key: `${PREFIX}.allAtOnce.text`,
    },
    hint: {
      text: {
        key: `${PREFIX}.allAtOnce.hint`,
      },
    },
  },
  {
    value: FileUploadChoice.AssociatedToLineItems,
    text: {
      key: `${PREFIX}.associatedToLineItems.text`,
    },
    hint: {
      text: {
        key: `${PREFIX}.associatedToLineItems.hint`,
      },
    },
  },
] as const;

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
  return new RadioField(
    PREFIX,
    "fileUploadChoice",
    "fileUploadChoice",
    FILE_UPLOAD_CHOICES,
    (value: FileUploadChoice) => value,
  );
}

function buildViewModel(
  form: RadioQuestionForm<FileUploadChoice, FileUploadChoice>,
): RadioQuestionViewModel<FileUploadChoice, FileUploadChoice> {
  return new RadioQuestionViewModel({
    title: `${PREFIX}.title`,
    form,
    isLegendPageHeading: true,
  });
}
