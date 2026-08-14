import { buildRoute, ROUTES } from "#routes/helper.js";
import { createRadioQuestionController } from "#src/helpers/radioQuestionController.js";
import type { RadioQuestionOptions } from "#src/viewmodels/radioQuestionViewModel.js";
import { UUID } from "uuidv7";
import { Count } from "#src/types/Claim.js";

const PREFIX = "pages.numberOfClientsStartOfCase" as const;

export const NUMBER_OF_CLIENTS_START_OF_CASE_FIELD = {
  name: "numberOfClientsStartOfCase",
  id: "numberOfClientsStartOfCase",
  messagePrefix: PREFIX,
} as const;

const numberOfClientsStartOfCaseChoices: ReadonlyArray<RadioQuestionOptions<Count>> =
  [
    {
      value: Count.ZERO,
      text: {
        key: `${PREFIX}.ZERO.text`,
      },
    },
    {
      value: Count.ONE,
      text: {
        key: `${PREFIX}.ONE.text`,
      },
    },
    {
      value: Count.TWO_OR_MORE,
      text: {
        key: `${PREFIX}.TWO_OR_MORE.text`,
      },
    },
  ];

const controller = createRadioQuestionController({
  title: `${PREFIX}.title`,
  field: NUMBER_OF_CLIENTS_START_OF_CASE_FIELD,
  choices: numberOfClientsStartOfCaseChoices,
  renderErrorContext: "rendering number of clients start of case page",
  submitErrorContext: "submitting number of clients start of case page",
  getRedirectUrl: (req) =>
    buildRoute(ROUTES.MULTIPLE_CLIENT_HEARINGS, {
      claimId: UUID.parse(req.params.claimId),
    }),
  getValue: (claim) => claim.clientsStartCount,
  setValue: (claim, selectedChoice) => claim.setClientsStartCount(selectedChoice),
});

export const {
  get: numberOfClientsStartOfCase,
  post: submitNumberOfClientsStartOfCase,
} = controller;
