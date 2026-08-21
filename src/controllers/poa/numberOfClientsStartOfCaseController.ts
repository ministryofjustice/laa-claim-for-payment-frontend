import { buildRoute, ROUTES } from "#routes/helper.js";
import { createRadioQuestionController } from "#src/helpers/radioQuestionController.js";
import { Count } from "#src/types/Claim.js";
import { RadioField } from "#src/helpers/fields.js";
import { getId } from "#src/helpers/queryParsers.js";

const PREFIX = "pages.numberOfClientsStartOfCase" as const;

function buildField(): RadioField<Count, Count> {
  return new RadioField(
    PREFIX,
    "numberOfClientsStartOfCase",
    "numberOfClientsStartOfCase",
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
    ],
    (value: Count) => value,
  );
}

const controller = createRadioQuestionController({
  title: `${PREFIX}.title`,
  buildField: () => buildField(),
  renderErrorContext: "rendering number of clients start of case page",
  submitErrorContext: "submitting number of clients start of case page",
  getRedirectUrl: (req) =>
    buildRoute(ROUTES.MULTIPLE_CLIENT_HEARINGS, {
      claimId: getId(req.params.claimId),
    }),
  getValue: (claim) => claim.clientsStartCount,
  setValue: (claim, selectedChoice) =>
    claim.setClientsStartCount(selectedChoice),
});

export const {
  get: numberOfClientsStartOfCase,
  post: submitNumberOfClientsStartOfCase,
} = controller;
