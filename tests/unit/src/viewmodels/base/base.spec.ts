import type {
  Arg,
  LocalizedText,
  TextOrMessage,
} from "#src/viewmodels/components/message.js";
import { expect } from "chai";

export function expectLocalizedText(
  value: TextOrMessage | Arg,
  expected: string,
): void {
  expect(value).to.be.a("function");
  expect((value as LocalizedText)("en")).to.equal(expected);
}
