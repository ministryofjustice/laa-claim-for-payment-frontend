export interface Message {
  key: string;
  args?: Record<string, unknown>;
}

export type TextOrMessage = string | Message;