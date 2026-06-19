import { TextOrMessage } from "#src/viewmodels/components/message.js";

export interface TableCell {
  text?: TextOrMessage;
  html?: string;
  attributes?: Record<string, string | number | undefined>;
  classes?: string;
}
