import { createRadioQuestionController } from "#src/helpers/radioQuestionController.js";
import { Count } from "#src/types/Claim.js";
import { RadioField } from "#src/helpers/fields.js";
import { PoaNavigator } from "#src/navigation/poaNavigator.js";
import { getMode } from "#src/helpers/queryParsers.js";

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
        disabled: true,
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
  getRedirectUrl: (req, claim) => {
    const navigator = new PoaNavigator(claim, getMode(req));
    return navigator.redirectFromNumberOfClientStartOfCase();
  },
  getValue: (claim) => claim.clientsStartCount,
  setValue: (claim, selectedChoice) =>
    claim.setClientsStartCount(selectedChoice),
});

export const {
  get: numberOfClientsStartOfCase,
  post: submitNumberOfClientsStartOfCase,
} = controller;
