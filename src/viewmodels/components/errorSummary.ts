import type { Message } from "#src/viewmodels/components/message.js";

export interface ErrorSummary {
  titleText: Message;
  errorList: ErrorSummaryError[];
}

export interface ErrorSummaryError {
  text: Message;
  href: string;
}