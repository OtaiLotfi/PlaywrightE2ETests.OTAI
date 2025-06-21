import { Page } from '@playwright/test';
import * as elementFinder from './elementFinder';

export function getLoginLocators(page: Page) {
  return {
    input: (value: string) => page.locator(elementFinder.inputByName(value)),
    signInButton: (value: string) => page.locator(elementFinder.buttonByText(value)),
    paragraphText: (value: string) => page.locator(elementFinder.paragraphByText(value)),
  };
}
