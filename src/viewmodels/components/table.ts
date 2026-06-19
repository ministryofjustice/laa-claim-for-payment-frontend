import type { TableHeader } from "#src/viewmodels/components/tableHeader.js";
import type { TableCell } from "#src/viewmodels/components/tableCell.js";

export interface Table {
  head: TableHeader[];
  rows: TableCell[][];
}
