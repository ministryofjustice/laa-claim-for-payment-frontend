import type { TableCell } from "#src/viewmodels/components/index.js";

export interface TableHeader extends TableCell {}

export interface SortedTableHeader extends TableHeader {
  attributes: { "aria-sort": "ascending" | "none" | "descending" };
}
