import { buildRoute, ROUTES } from "#routes/helper.js";
import { createRadioQuestionController } from "#src/helpers/radioQuestionController.js";
import { Count } from "#src/types/Claim.js";
import { RadioField } from "#src/helpers/fields.js";

function buildField(): RadioField<Count, Count> {
  const messagePrefix = "pages.numberOfClientsStartOfCase";
  return new RadioField(
    messagePrefix,
    "numberOfClientsStartOfCase",
    "numberOfClientsStartOfCase",
    [
      {
        value: Count.ZERO,
        text: {
          key: `${messagePrefix}.ZERO.text`,
        },
      },
      {
        value: Count.ONE,
        text: {
          key: `${messagePrefix}.ONE.text`,
        },
      },
      {
        value: Count.TWO_OR_MORE,
        text: {
          key: `${messagePrefix}.TWO_OR_MORE.text`,
        },
      },
    ],
    (value: Count) => value,
  );
}

const controller = createRadioQuestionController({
  buildField: () => buildField(),
  renderErrorContext: "rendering number of clients start of case page",
  submitErrorContext: "submitting number of clients start of case page",
  getRedirectUrl: (claim) =>
    buildRoute(ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS, {
      claimId: claim.id,
    }),
  getValue: (claim) => claim.clientsStartCount,
  setValue: (claim, selectedChoice) =>
    claim.setClientsStartCount(selectedChoice),
});

export const {
  get: numberOfClientsStartOfCase,
  post: submitNumberOfClientsStartOfCase,
} = controller;
