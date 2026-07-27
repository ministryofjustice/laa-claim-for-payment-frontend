import { buildRoute, ROUTES } from "#routes/helper.js";
import { createRadioQuestionController } from "#src/helpers/radioQuestionController.js";
import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";
import { UUID } from "uuidv7";
import { Count } from "#src/types/Claim.js";

const numberOfClientsStartOfCaseFieldName =
  "numberOfClientsStartOfCase" as const;

const numberOfClientsStartOfCaseChoices: ReadonlyArray<RadioQuestionOptions<Count>> =
  [
    {
      value: Count.ZERO,
      text: {
        key: "pages.numberOfClientsStartOfCase.none.text",
      },
    },
    {
      value: Count.ONE,
      text: {
        key: "pages.numberOfClientsStartOfCase.one.text",
      },
    },
    {
      value: Count.TWO_OR_MORE,
      text: {
        key: "pages.numberOfClientsStartOfCase.moreThanTwo.text",
      },
    },
  ];

const controller = createRadioQuestionController({
  title: {
    key: "pages.numberOfClientsStartOfCase.title",
  },
  fieldName: numberOfClientsStartOfCaseFieldName,
  choices: numberOfClientsStartOfCaseChoices,
  messagePrefix: "pages.numberOfClientsStartOfCase",
  renderErrorContext: "rendering number of clients start of case page",
  submitErrorContext: "submitting number of clients start of case page",
  getRedirectUrl: (req) =>
    buildRoute(ROUTES.MULTIPLE_CLIENT_HEARINGS, {
      claimId: UUID.parse(req.params.claimId),
    }),
});

export const {
  get: numberOfClientsStartOfCase,
  post: submitNumberOfClientsStartOfCase,
} = controller;
