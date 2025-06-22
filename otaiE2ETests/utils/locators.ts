import { Page } from '@playwright/test';
import * as elementFinder from './elementFinder';

export function getLoginLocators(page: Page) {
  return {
    input: (value: string) => page.locator(elementFinder.inputByName(value)),
    signInButton: (value: string) => page.locator(elementFinder.buttonByText(value)),
    paragraphText: (value: string) => page.locator(elementFinder.paragraphByText(value)),
    popup: (text: string) => page.locator(elementFinder.popupText(text)),
  };
}

export function getSidebarLocators(page: Page) {
  return {
    section: (section: string) => page.locator(elementFinder.sectionName(section)),
    item: (section: string, item: string) => page.locator(elementFinder.itemName(section, item)),
  };
}

export function getCustomersLocators(page: Page) {
  return {
    inputField: (name: string) => page.locator(elementFinder.customersInputFields(name)),
    saveButton: (name: string) => page.locator(elementFinder.buttonByText(name)),
    popup: (text: string) => page.locator(elementFinder.popupText(text)),
    state: (text: string) => page.locator(elementFinder.customerStats(text)),
    searchField: (text: string) => page.locator(elementFinder.buttonByType(text)),
  };
}
