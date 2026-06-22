import type { TextOrMessage } from "#src/viewmodels/components/message.js";
import type { Tag } from "#src/viewmodels/components/tag.js";

export interface TaskList {
  idPrefix: string;
  items: TaskListItem[];
  attributes: { id: string };
}

export interface TaskListItem {
  title: { text: TextOrMessage };
  href: string;
  status: TaskListItemStatus;
}

export interface TaskListItemStatus {
  tag: Tag;
}

export interface ReusableDocument {
  id: number;
  name: string;
  size: string;
}
