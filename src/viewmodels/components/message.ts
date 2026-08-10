export interface Message {
  key: string;
  args?: Record<string, Arg>;
}

export type LocalizedText = ((language: string) => string);

export type Arg = string | number | LocalizedText;

export type TextOrMessage = string | Message | LocalizedText;
