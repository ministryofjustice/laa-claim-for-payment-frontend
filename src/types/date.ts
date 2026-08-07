/**
 *
 */
export class LocalDate {
  /**
   * Constructor for a LocalDate.
   * @param {number} day day value
   * @param {number} month month value
   * @param {number} year year value
   */
  constructor(
    public readonly day: number,
    public readonly month: number,
    public readonly year: number,
  ) {}

  /**
   * Creates a LocalDate from an ISO-8601 date string (YYYY-MM-DD).
   * @param {string} value date string.
   * @returns {LocalDate} date
   */
  static from(value: string): LocalDate {
    const [year, month, day] = value.split("-").map(Number);
    return LocalDate.of(day, month, year);
  }

  /**
   * Creates a LocalDate from numerical day, month and year values.
   * @param {number} day day value
   * @param {number} month month value
   * @param {number} year year value
   * @returns {LocalDate} date
   */
  static of(day: number, month: number, year: number): LocalDate {
    const date = new LocalDate(day, month, year);

    if (!date.isValid()) {
      throw new Error("Invalid date");
    }

    return date;
  }

  /**
   * Get the two-digit string representation of the day value
   * @returns {string} two-digit string representation of the day value
   */
  toDayString(): string {
    return String(this.day).padStart(2, "0");
  }

  /**
   * Get the two-digit string representation of the month value
   * @returns {string} two-digit string representation of the month value
   */
  toMonthString(): string {
    return String(this.month).padStart(2, "0");
  }

  /**
   * Get the string representation for the year value
   * @returns {string} string representation of the year value
   */
  toYearString(): string {
    return String(this.year);
  }

  /**
   * Converts this LocalDate to a JavaScript Date representing midnight UTC.
   * @returns {Date} the converted date
   */
  toDate(): Date {
    return new Date(Date.UTC(this.year, this.month - 1, this.day));
  }

  /**
   * Convert to epoch millis
   * @returns {number} the epoch millis
   */
  toEpochMillis(): number {
    return this.toDate().getTime();
  }

  /**
   * Converts to an ISO-8601 date string (YYYY-MM-DD).
   * @returns {string} the date in YYYY-MM-DD format
   */
  toIsoString(): string {
    return `${this.toYearString()}-${this.toMonthString()}-${this.toDayString()}`;
  }

  /**
   * Checks whether the date is valid
   * @returns {boolean} whether the date is valid
   */
  isValid(): boolean {
    const date = this.toDate();

    return (
      date.getUTCFullYear() === this.year &&
      date.getUTCMonth() === this.month - 1 &&
      date.getUTCDate() === this.day
    );
  }

  /**
   * Checks whether the date is in the future
   * @returns {boolean} whether the date is in the future
   */
  isFutureDate(): boolean {
    const today = new Date();

    const todayEpoch = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    );

    return this.toEpochMillis() > todayEpoch;
  }
}
