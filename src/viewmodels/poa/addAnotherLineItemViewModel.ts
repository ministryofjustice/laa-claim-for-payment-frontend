import type { ExpertCostLineItem, LineItem } from "#src/types/Claim.js";
import {
  buildSummaryList,
  buildSummaryListRowWithChangeAndRemoveLinks,
  type SummaryList,
} from "#src/viewmodels/components/summaryList.js";
import type { Message } from "#src/viewmodels/components/message.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import {
  RadioQuestionViewModel,
  type YesNoQuestionForm,
  type YesNoQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import { formatClaimed, formatDateReadable } from "#src/helpers/index.js";
import { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";

interface AddAnotherLineItemViewModelParams<T extends LineItem> {
  claimId: string;
  lineItems: T[];
  form: YesNoQuestionForm;
  prefix: string;
  getValue: (lineItem: T) => string;
  summaryListId: string;
}

export interface AddAnotherExpertCostViewModelParams {
  claimId: string;
  lineItems: ExpertCostLineItem[];
  form: YesNoQuestionForm;
}

/**
 * View model for the POA add another line item page.
 */
abstract class AddAnotherLineItemViewModel<T extends LineItem> {
  readonly title: Message;
  readonly lineItemsSummaryList: SummaryList;
  readonly radioQuestionViewModel: YesNoQuestionViewModel;

  /**
   * Creates a profit cost bill line page view model.
   *
   * @param {AddAnotherLineItemViewModelParams} params View model params.
   */
  constructor(params: AddAnotherLineItemViewModelParams<T>) {
    const { claimId, lineItems, form, prefix, getValue, summaryListId } =
      params;

    if (lineItems.length === 1) {
      this.title = { key: `${prefix}.title.singular` };
    } else {
      this.title = {
        key: `${prefix}.title.multiple`,
        args: { count: lineItems.length },
      };
    }

    const rows = lineItems.map((lineItem) =>
      buildSummaryListRowWithChangeAndRemoveLinks(
        formatDateReadable(lineItem.date.toDate()),
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
      ),
    );

    this.lineItemsSummaryList = buildSummaryList(summaryListId, rows);

    this.radioQuestionViewModel = new RadioQuestionViewModel({
      title: `${prefix}.question`,
      form,
      isLegendPageHeading: false,
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
