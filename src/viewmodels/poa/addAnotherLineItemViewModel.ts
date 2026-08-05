import type { ExpertCostLineItem, LineItem } from "#src/types/Claim.js";
import {
  buildSummaryList,
  buildSummaryListRowWithChangeAndRemoveLinks,
  type SummaryList,
} from "#src/viewmodels/components/summaryList.js";
import type { Message } from "#src/viewmodels/components/message.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import { RadioQuestionViewModel } from "#src/viewmodels/radioQuestionViewModel.js";
import { type BooleanChoice, booleanChoices } from "#src/models/booleanChoice.js";
import type { FieldValidationError } from "#src/helpers/validation.js";
import { addAnotherExpertCostFieldId, addAnotherExpertCostFieldName } from "#src/controllers/poa/addAnotherExpertCostController.js";
import { formatClaimed, formatDateReadable } from "#src/helpers/index.js";

interface AddAnotherLineItemViewModelParams<T extends LineItem> {
  claimId: string;
  lineItems: T[];
  prefix: string;
  getValue: (lineItem: T) => string;
  summaryListId: string;
  errors?: FieldValidationError[];
  selectedValue?: BooleanChoice;
}

export interface AddAnotherExpertCostViewModelParams {
  claimId: string;
  lineItems: ExpertCostLineItem[];
  errors?: FieldValidationError[];
}

/**
 * View model for the POA add another line item page.
 */
abstract class AddAnotherLineItemViewModel<T extends LineItem> {
  readonly title: Message;
  readonly lineItemsSummaryList: SummaryList;
  readonly radioQuestionViewModel: RadioQuestionViewModel<BooleanChoice>;

  /**
   * Creates a profit cost bill line page view model.
   *
   * @param {AddAnotherLineItemViewModelParams} params View model params.
   */
  constructor(params: AddAnotherLineItemViewModelParams<T>) {
    const { claimId, lineItems, prefix, getValue, summaryListId, errors } =
      params;

    if (lineItems.length === 1) {
      this.title = { key: `${prefix}.title.singular` };
    } else {
      this.title = {
        key: `${prefix}.title.multiple`,
        args: { count: lineItems.length },
      };
    }

    const rows = lineItems.map((lineItem) => buildSummaryListRowWithChangeAndRemoveLinks(
        formatDateReadable(lineItem.date),
        buildRoute(
          ROUTES.EXPERT_COST_DETAILS,
          { claimId },
          { lineItemId: lineItem.id },
        ),
        buildRoute(ROUTES.REMOVE_EXPERT_COST_DETAILS, {
          claimId,
          lineItemId: lineItem.id,
        }),
        {
          text: getValue(lineItem),
        },
      ));

    this.lineItemsSummaryList = buildSummaryList(summaryListId, rows);

    this.radioQuestionViewModel = new RadioQuestionViewModel({
      title: {
        key: `${prefix}.question`,
      },
      fieldName: addAnotherExpertCostFieldName,
      fieldId: addAnotherExpertCostFieldId,
      choices: booleanChoices,
      errors,
    });
  }
}

/**
 *
 */
export class AddAnotherExpertCostViewModel extends AddAnotherLineItemViewModel<ExpertCostLineItem> {

  /**
   * Creates an add another expert cost view model.
   *
   * @param {AddAnotherExpertCostViewModelParams} params View model params.
   */
  constructor(params: AddAnotherExpertCostViewModelParams) {
    super({
      ...params,
      prefix: "pages.poa.expertCostDetails.addAnother",
      getValue: (lineItem) => formatClaimed(lineItem.actualNetValue),
      summaryListId: "expert-cost",
    });
  }
}
