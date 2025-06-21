import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async waitForVisibility(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async waitForInvisibility(locator: Locator) {
    await expect(locator).toBeHidden();
  }

  async waitForText(locator: Locator, expectedText: string) {
    await expect(locator).toHaveText(expectedText, { timeout: 5000 });
  }

  async waitForTextVisibility(text: string) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
  }

  async clickElement(locator: Locator) {
    await locator.click();
  }

  async fillInput(locator: Locator, value: string) {
    await locator.fill(value);
  }
}