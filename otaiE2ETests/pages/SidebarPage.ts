import {Locator } from '@playwright/test';
import { BasePage } from './BasePage'; 
import { getSidebarLocators } from '../utils/locators';

export class SidebarPage extends BasePage {
  readonly invoicesHeader: Locator;
  readonly loginError: Locator;
  readonly loginTextValue: string;
  readonly noLoginTextValue: string;

  constructor(page) {
    super(page); 
  } 

  async clickASection(sectionText: string) {
    const { section } = getSidebarLocators(this.page);
    await this.clickElement(section(sectionText));
  }

  async clickAnItem(sectionText: string, itemText: string) {
    const { item } = getSidebarLocators(this.page);
    await this.clickElement(item(sectionText, itemText));
  }

}
