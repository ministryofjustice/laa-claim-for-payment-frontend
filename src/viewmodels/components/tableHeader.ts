import type { TableCell } from "#src/viewmodels/components/index.js";

export interface TableHeader extends TableCell {
  attributes: { "aria-sort": "ascending" | "none" | "descending" };
}
