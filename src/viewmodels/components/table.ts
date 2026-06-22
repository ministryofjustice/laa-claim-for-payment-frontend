import type { TableHeader } from "#src/viewmodels/components/tableHeader.js";
import type { TableCell } from "#src/viewmodels/components/tableCell.js";
import type { TextOrMessage } from "#src/viewmodels/components/message.js";

export interface Table {
  caption?: TextOrMessage;
  captionClasses?: string;
  firstCellIsHeader: boolean;
  head: TableHeader[];
  rows: TableCell[][];
  attributes?: { "data-module": string; };
}
