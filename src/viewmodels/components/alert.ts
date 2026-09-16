import type { Message } from "#src/viewmodels/components/message.js";

export interface Alert {
  variant: "information" | "success" | "warning" | "error";
  title: Message;
  showTitleAsHeading: boolean;
  dismissable: boolean;
  text: Message;
}