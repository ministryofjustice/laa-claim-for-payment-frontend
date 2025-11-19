import { expect } from "chai";
import en from "#locales/en.json" with { type: "json" };
import cy from "#locales/cy.json" with { type: "json" };

function collectKeys(obj: any, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return collectKeys(value, fullKey);
    }

    return [fullKey];
  });
}

describe("i18n consistency", () => {
  it("cy.json contains all keys from en.json", () => {
    const enKeys = collectKeys(en);
    const cyKeys = collectKeys(cy);

    const missing = enKeys.filter(k => !cyKeys.includes(k));

    expect(
      missing,
      `The following keys exist in en.json but are missing from cy.json:\n${missing.join("\n")}`
    ).to.deep.equal([]);
  });
});

function extractPlaceholders(text: any): string[] {
  if (typeof text !== "string") return [];
  const matches = text.match(/\{[^}]+\}/g);
  return matches ? matches.map(m => m.slice(1, -1)) : [];
}

function comparePlaceholders(
  enObj: any,
  cyObj: any,
  prefix = "",
  errors: string[] = []
) {
  for (const key of Object.keys(enObj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (enObj[key] && typeof enObj[key] === "object" && !Array.isArray(enObj[key])) {
      // Recurse into nested objects
      comparePlaceholders(enObj[key], cyObj[key] ?? {}, fullKey, errors);
      continue;
    }

    const enText = enObj[key];
    const cyText = cyObj[key];

    const enVars = extractPlaceholders(enText);
    const cyVars = extractPlaceholders(cyText);

    const missing = enVars.filter(v => !cyVars.includes(v));

    if (missing.length > 0) {
      errors.push(
        `${fullKey} → missing placeholders in cy.json: ${missing.join(", ")}`
      );
    }
  }

  return errors;
}

describe("i18n interpolation consistency", () => {
  it("cy.json contains all interpolation placeholders used in en.json", () => {
    const errors = comparePlaceholders(en, cy);
    expect(
      errors,
      `Welsh translations are missing placeholders:\n${errors.join("\n")}`
    ).to.deep.equal([]);
  });
  it("en.json contains all interpolation placeholders used in cy.json", () => {
    const errors = comparePlaceholders(cy, en);
    expect(
      errors,
      `English translations are missing placeholders:\n${errors.join("\n")}`
    ).to.deep.equal([]);
  });
});
