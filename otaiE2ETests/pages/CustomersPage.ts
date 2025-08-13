import {Locator } from '@playwright/test';
import { BasePage } from './BasePage'; 
import { getCustomersLocators } from '../utils/locators';
import { getSidebarLocators } from '../utils/locators';

export class CustomersPage extends BasePage {
  readonly addCustomer: Locator;
  readonly customerStats: Locator;

  constructor(page) {
    super(page);
    this.addCustomer = page.locator("//a[text()='Create']");
    this.customerStats = page.locator("//span[text()='Segments']/../../div");
  }  

  async fillInputField(field: string, inputValue: string) {
    const { inputField } = getCustomersLocators(this.page);
    await this.clickElement(inputField(field));
    await this.fillInput(inputField(field), inputValue);
  }

   async clickButton(buttonName: string) {
    const { saveButton } = getCustomersLocators(this.page);
    await this.clickElement(saveButton(buttonName));
  } 

   async setCustomerStats(stateName: string, sectionName: string) {
    const { section } = getSidebarLocators(this.page);
    const { state } = getCustomersLocators(this.page);
    await this.clickElement(state(stateName));
    await this.clickElement(section(sectionName));
    await this.clickWhiteSpace();
  } 
}
