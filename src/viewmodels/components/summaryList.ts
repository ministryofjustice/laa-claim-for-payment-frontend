import type {
  Message,
  TextOrMessage,
} from "#src/viewmodels/components/message.js";

export interface SummaryList {
  card?: SummaryCard;
  rows: SummaryListRow[];
  attributes: { id: string };
}

export interface SummaryListRow {
  key: { text: TextOrMessage };
  value: { text?: string; html?: string };
  actions?: SummaryListRowActions;
}

interface SummaryListRowActions {
  items: SummaryListRowActionItem[];
}

interface SummaryListRowActionItem {
  href: string;
  text: TextOrMessage;
  visuallyHiddenText: Message;
}

interface SummaryCard {
  title: { text: TextOrMessage };
  actions?: SummaryListRowActions;
  attributes: { id: string };
}

/**
 * Summary list with card builder.
 * @param {string} cardTitle card title
 * @param {string} cardId card ID
 * @param {SummaryListRow[]} summaryListRows summary list rows
 * @param {SummaryListRowActionItem} cardAction card action
 * @returns {SummaryList} a summary list with card
 */
export function buildSummaryListWithCard(
  cardTitle: string,
  cardId: string,
  summaryListRows: SummaryListRow[],
  cardAction?: SummaryListRowActionItem
): SummaryList{
  return {
    card: {
      title: {
        text: {
          key: cardTitle
        }
      },
      actions: cardAction == null ? undefined : {
        items: [ cardAction ]
      },
      attributes: {
        id: cardId
      }
    },
    rows: summaryListRows,
    attributes: {
      id: `${cardId}-rows`
    }
  };
}
