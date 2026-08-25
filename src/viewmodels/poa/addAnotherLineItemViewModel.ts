import type { DisbursementLineItem, LineItem } from "#src/types/Claim.js";
import {
  buildSummaryList,
  buildSummaryListRowWithChangeAndRemoveLinks,
  type SummaryList,
} from "#src/viewmodels/components/summaryList.js";
import type { Message } from "#src/viewmodels/components/message.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import {
  RadioQuestionViewModel,
  type YesNoQuestionViewModel,
} from "#src/viewmodels/radioQuestionViewModel.js";
import { formatClaimed, formatDateReadable } from "#src/helpers/index.js";
import type { YesNoQuestionForm } from "#src/helpers/radioQuestionValidation.js";

interface AddAnotherLineItemViewModelParams<T extends LineItem> {
  claimId: string;
  lineItems: T[];
  form: YesNoQuestionForm;
  getValue: (lineItem: T) => string;
  summaryListId: string;
}

export interface AddAnotherDisbursementViewModelParams {
  claimId: string;
  lineItems: DisbursementLineItem[];
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
    const { claimId, lineItems, form, getValue, summaryListId } = params;

    if (lineItems.length === 1) {
      this.title = { key: `${form.messagePrefix}.title.singular` };
    } else {
      this.title = {
        key: `${form.messagePrefix}.title.multiple`,
        args: { count: lineItems.length },
      };
    }

    const rows = lineItems.map((lineItem) =>
      buildSummaryListRowWithChangeAndRemoveLinks(
        formatDateReadable(lineItem.date.toDate()),
        buildRoute(
          ROUTES.POA.DISBURSEMENTS.DETAILS,
          { claimId },
          { lineItemId: lineItem.id },
        ),
        buildRoute(ROUTES.POA.DISBURSEMENTS.REMOVE, {
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
      title: `${form.messagePrefix}.question`,
      form,
      isLegendPageHeading: false,
    });
  }
}

/**
 *
 */
export class AddAnotherDisbursementViewModel extends AddAnotherLineItemViewModel<DisbursementLineItem> {
  /**
   * Creates an add another disbursement view model.
   *
   * @param {AddAnotherDisbursementViewModelParams} params View model params.
   */
  constructor(params: AddAnotherDisbursementViewModelParams) {
    super({
      ...params,
      getValue: (lineItem) => formatClaimed(lineItem.actualNetValue),
      summaryListId: "disbursement",
    });
  }
}
