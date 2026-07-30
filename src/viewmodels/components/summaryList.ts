import type { TextOrMessage } from "#src/viewmodels/components/message.js";

export interface SummaryList {
  card?: SummaryCard;
  rows: SummaryListRow[];
  attributes: { id: string };
}

export interface SummaryListRow {
  key: { text: TextOrMessage };
  value: SummaryListRowValue;
  actions?: SummaryListRowActions;
}

interface SummaryListRowValue {
  text?: TextOrMessage;
  html?: TextOrMessage;
}

interface SummaryListRowActions {
  items: SummaryListRowActionItem[];
}

interface SummaryListRowActionItem {
  href: string;
  text: TextOrMessage;
  visuallyHiddenText: TextOrMessage;
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
 * @param {SummaryListRowActionItem[]} cardActions card actions
 * @returns {SummaryList} a summary list with card
 */
export function buildSummaryListWithCard(
  cardTitle: TextOrMessage,
  cardId: string,
  summaryListRows: Array<SummaryListRow | undefined>,
  cardActions?: SummaryListRowActionItem[],
): SummaryList {
  return {
    card: {
      title: {
        text: cardTitle,
      },
      actions:
        cardActions == null
          ? undefined
          : {
              items: cardActions,
            },
      attributes: {
        id: cardId,
      },
    },
    rows: summaryListRows.filter((row) => row !== undefined),
    attributes: {
      id: `${cardId}-rows`,
    },
  };
}

/**
 * Summary list row builder.
 * @param {string} key row key
 * @param {string} value row value
 * @returns {SummaryListRow} a summary list row
 */
export function buildSummaryListRow(
  key: TextOrMessage,
  value?: SummaryListRowValue,
): SummaryListRow | undefined {
  if (value == null) {
    return undefined;
  }
  return {
    key: {
      text: key,
    },
    value,
  };
}

/**
 * Summary list row with change link builder.
 * @param {string} key row key
 * @param {string} href row change link href
 * @param {string} value row value
 * @returns {SummaryListRow} a summary list row with change link
 */
export function buildSummaryListRowWithChangeLink(
  key: TextOrMessage,
  href: string,
  value?: SummaryListRowValue,
): SummaryListRow | undefined {
  const summaryListRow = buildSummaryListRow(key, value);
  if (summaryListRow == null) {
    return undefined;
  }
  return {
    ...summaryListRow,
    actions: {
      items: [
        {
          href,
          text: {
            key: "common.change",
          },
          visuallyHiddenText: key,
        },
      ],
    },
  };
}
