import { buildRoute, ROUTES } from "#routes/helper.js";
import { createRadioQuestionController } from "#src/helpers/radioQuestionController.js";
import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";

const numberOfClientsStartOfCaseFieldName =
  "numberOfClientsStartOfCase" as const;

const NumberOfClientsStartOfCaseChoice = {
  None: "none",
  One: "one",
  MoreThanTwo: "more-than-two",
} as const;

type NumberOfClientsStartOfCaseChoice =
  (typeof NumberOfClientsStartOfCaseChoice)[keyof typeof NumberOfClientsStartOfCaseChoice];

const numberOfClientsStartOfCaseChoices: Array<RadioQuestionOptions<NumberOfClientsStartOfCaseChoice>> =
  [
    {
      value: NumberOfClientsStartOfCaseChoice.None,
      text: {
        key: "pages.numberOfClientsStartOfCase.none.text",
      },
    },
    {
      value: NumberOfClientsStartOfCaseChoice.One,
      text: {
        key: "pages.numberOfClientsStartOfCase.one.text",
      },
    },
    {
      value: NumberOfClientsStartOfCaseChoice.MoreThanTwo,
      text: {
        key: "pages.numberOfClientsStartOfCase.moreThanTwo.text",
      },
    },
  ];

const controller = createRadioQuestionController({
  title: "pages.numberOfClientsStartOfCase.title",
  fieldName: numberOfClientsStartOfCaseFieldName,
  choices: numberOfClientsStartOfCaseChoices,
  errorText: "pages.numberOfClientsStartOfCase.error.empty",
  renderErrorContext: "rendering number of clients start of case page",
  submitErrorContext: "submitting number of clients start of case page",
  getRedirectUrl: (req) =>
    buildRoute(ROUTES.MULTIPLE_CLIENT_HEARINGS, {
      claimId: Number(req.params.claimId),
    }),
});

export const {
  get: numberOfClientsStartOfCase,
  post: submitNumberOfClientsStartOfCase,
} = controller;
