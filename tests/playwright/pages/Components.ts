import type { Locator, Page } from "@playwright/test";

/**
 *
 */
export class YesNoInput {
  /**
   * Constructs a yes/no input.
   *
   * @param {Page} page The Playwright page instance.
   * @param {string} id The input ID.
   */
  constructor(
    private readonly page: Page,
    private readonly id: string,
  ) {}

  /**
   * get the yes radio
   * @returns {Locator} The yes radio
   */
  get yesRadio(): Locator {
    return this.page.locator(`#${this.id}`);
  }

  /**
   * get the no radio
   * @returns {Locator} The no radio
   */
  get noRadio(): Locator {
    return this.page.locator(`#${this.id}-2`);
  }

  /**
   * check the yes radio
   */
  async answerYes(): Promise<void> {
    await this.yesRadio.check();
  }

  /**
   * check the no radio
   */
  async answerNo(): Promise<void> {
    await this.noRadio.check();
  }
}

/**
 *
 */
export class RadioInput {
  /**
   * Constructs a radio input.
   *
   * @param {Page} page The Playwright page instance.
   * @param {string} id The input ID.
   */
  constructor(
    private readonly page: Page,
    private readonly id: string,
  ) {}

  /**
   * get the radio group
   * @returns {Locator} The radio group
   */
  get group(): Locator {
    return this.page.locator(`#${this.id}`).locator("xpath=ancestor::fieldset");
  }

  /**
   * get the radio by label
   * @param {string} label radio label
   * @returns {Locator} The radio
   */
  getRadio(label: string): Locator {
    return this.group.getByLabel(label);
  }
}

/**
 *
 */
export class TextInput {
  /**
   * Constructs a text input.
   *
   * @param {Page} page The Playwright page instance.
   * @param {string} id The input ID.
   */
  constructor(
    private readonly page: Page,
    private readonly id: string,
  ) {}

  /**
   * get the input
   * @returns {Locator} The input
   */
  get input(): Locator {
    return this.page.locator(`#${this.id}`);
  }
}

/**
 *
 */
export class FileUploadInput {
  /**
   * Constructs a file upload input.
   *
   * @param {Page} page The Playwright page instance.
   * @param {string} id The input ID.
   */
  constructor(
    private readonly page: Page,
    private readonly id: string,
  ) {}

  /**
   * get the input
   * @returns {Locator} The input
   */
  get input(): Locator {
    return this.page.locator(`#${this.id}`);
  }

  /**
   * upload a file or files
   * @param {string[]} fileNames the files to upload
   */
  async uploadFiles(fileNames: string[]): Promise<void> {
    await this.input.setInputFiles(fileNames);
  }
}
