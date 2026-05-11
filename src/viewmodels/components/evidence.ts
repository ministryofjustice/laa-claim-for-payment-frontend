import type { TextOrMessage } from "#src/viewmodels/components/message.js";

export interface EvidenceTask {
  link: { text: TextOrMessage; href: string };
  tag: { text: TextOrMessage; classes: string };
}
