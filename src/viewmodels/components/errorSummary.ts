import type {
  Message,
  TextOrMessage,
} from "#src/viewmodels/components/message.js";

export interface ErrorSummary {
  titleText: Message;
  errorList: ErrorSummaryError[];
}

export interface ErrorSummaryError {
  text: TextOrMessage;
  href: string;
}