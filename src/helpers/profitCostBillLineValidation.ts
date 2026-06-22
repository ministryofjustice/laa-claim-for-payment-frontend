export interface ProfitCostBillLineForm {
  activityDateDay?: unknown;
  activityDateMonth?: unknown;
  activityDateYear?: unknown;
  actualNetProfitCostExcludingAdvocacy?: unknown;
  actualNetAdvocacyCosts?: unknown;
  vatApplies?: unknown;
  feeEarnerName?: unknown;
}

export interface FieldValidationError {
  fieldName: string;
  href: string;
  text: string;
}

export interface ProfitCostBillLineValidationResult {
  isValid: boolean;
  errors: FieldValidationError[];
}

const MONEY_REGEX = /^\d+\.\d{2}$/;
const NUMBERS_ONLY_REGEX = /^\d+$/;
const FEE_EARNER_NAME_REGEX = /^[A-Za-z' -]+$/;

/**
 * Validates the profit cost bill line form.
 *
 * @param {unknown} body Express request body.
 * @returns {ProfitCostBillLineValidationResult} Validation result.
 */
export function validateProfitCostBillLine(
  body: unknown,
): ProfitCostBillLineValidationResult {
  const form = getForm(body);

  const errors: FieldValidationError[] = [
    ...validateActivityDate(form),
    ...validateMoneyField({
      value: form.actualNetProfitCostExcludingAdvocacy,
      fieldName: "actualNetProfitCostExcludingAdvocacy",
      errorPrefix: "pages.profitCostBillLine.actualNetProfitCostExcludingAdvocacy.errors",
    }),
    ...validateMoneyField({
      value: form.actualNetAdvocacyCosts,
      fieldName: "actualNetAdvocacyCosts",
      errorPrefix: "pages.profitCostBillLine.actualNetAdvocacyCosts.errors",
    }),
    ...validateVatApplies(form.vatApplies),
    ...validateFeeEarnerName(form.feeEarnerName),
  ];

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function getForm(body: unknown): ProfitCostBillLineForm {
  if (typeof body !== "object" || body === null) {
    return {};
  }

  return body as ProfitCostBillLineForm;
}

function validateActivityDate(
  form: ProfitCostBillLineForm,
): FieldValidationError[] {
  const day = getStringValue(form.activityDateDay);
  const month = getStringValue(form.activityDateMonth);
  const year = getStringValue(form.activityDateYear);

  const enteredParts = [day, month, year].filter((value) => value !== "");

  if (enteredParts.length === 0) {
    return [
      {
        fieldName: "activityDate",
        href: "#activityDate-day",
        text: "pages.profitCostBillLine.activityDate.errors.empty",
      },
    ];
  }

  if (enteredParts.length < 3) {
    return [
      {
        fieldName: "activityDate",
        href: "#activityDate-day",
        text: getIncompleteDateError(day, month, year),
      },
    ];
  }

  if (
    !NUMBERS_ONLY_REGEX.test(day) ||
    !NUMBERS_ONLY_REGEX.test(month) ||
    !NUMBERS_ONLY_REGEX.test(year)
  ) {
    return [
      {
        fieldName: "activityDate",
        href: "#activityDate-day",
        text: "pages.profitCostBillLine.activityDate.errors.invalid",
      },
    ];
  }

  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);

  if (!isRealDate(dayNumber, monthNumber, yearNumber)) {
    return [
      {
        fieldName: "activityDate",
        href: "#activityDate-day",
        text: "pages.profitCostBillLine.activityDate.errors.invalid",
      },
    ];
  }

  if (isFutureDate(dayNumber, monthNumber, yearNumber)) {
    return [
      {
        fieldName: "activityDate",
        href: "#activityDate-day",
        text: "pages.profitCostBillLine.activityDate.errors.future",
      },
    ];
  }

  return [];
}

function getIncompleteDateError(
  day: string,
  month: string,
  year: string,
): string {
  const missingParts: string[] = [];

  if (day === "") {
    missingParts.push("day");
  }

  if (month === "") {
    missingParts.push("month");
  }

  if (year === "") {
    missingParts.push("year");
  }

  return `pages.profitCostBillLine.activityDate.errors.incomplete.${missingParts.join(
    "And",
  )}`;
}

function validateMoneyField({
  value,
  fieldName,
  errorPrefix,
}: {
  value: unknown;
  fieldName: string;
  errorPrefix: string;
}): FieldValidationError[] {
  const stringValue = getStringValue(value);

  if (stringValue === "") {
    return [
      {
        fieldName,
        href: `#${fieldName}`,
        text: `${errorPrefix}.empty`,
      },
    ];
  }

  if (!/^[\d.]+$/.test(stringValue)) {
    return [
      {
        fieldName,
        href: `#${fieldName}`,
        text: `${errorPrefix}.invalid`,
      },
    ];
  }

  if (!MONEY_REGEX.test(stringValue)) {
    return [
      {
        fieldName,
        href: `#${fieldName}`,
        text: `${errorPrefix}.pence`,
      },
    ];
  }

  return [];
}

function validateVatApplies(value: unknown): FieldValidationError[] {
  const stringValue = getStringValue(value);

  if (stringValue !== "yes" && stringValue !== "no") {
    return [
      {
        fieldName: "vatApplies",
        href: "#vatApplies",
        text: "pages.profitCostBillLine.vatApplies.errors.empty",
      },
    ];
  }

  return [];
}

function validateFeeEarnerName(value: unknown): FieldValidationError[] {
  const stringValue = getStringValue(value);

  if (stringValue === "") {
    return [
      {
        fieldName: "feeEarnerName",
        href: "#feeEarnerName",
        text: "pages.profitCostBillLine.feeEarnerName.errors.empty",
      },
    ];
  }

  if (!FEE_EARNER_NAME_REGEX.test(stringValue)) {
    return [
      {
        fieldName: "feeEarnerName",
        href: "#feeEarnerName",
        text: "pages.profitCostBillLine.feeEarnerName.errors.invalid",
      },
    ];
  }

  return [];
}

function getStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRealDate(day: number, month: number, year: number): boolean {
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isFutureDate(day: number, month: number, year: number): boolean {
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();

  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return inputDate > today;
}