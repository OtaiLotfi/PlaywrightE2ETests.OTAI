import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage'; 
import { getLoginLocators } from '../utils/locators';

export class LoginPage extends BasePage {
  readonly invoicesHeader: Locator;
  readonly loginError: Locator;
  readonly loginTextValue: string;
  readonly noLoginTextValue: string;

  constructor(page) {
    super(page);
    this.invoicesHeader = page.locator("//span[text()='Invoices']");
    this.loginError = page.locator("//div[text()='The form is not valid. Please check for errors']");
    this.loginTextValue = 'Hint: demo / demo'; 
    this.noLoginTextValue = 'The form is not valid. Please check for errors'; 
  } 

  async loginWithCredentials(username: string, password: string) {
    const { input, signInButton } = getLoginLocators(this.page);
    await this.fillInput(input('username'), username);
    await this.fillInput(input('password'), password);
    await this.clickElement(signInButton('Sign in'));
  }

  async openApp(appUrl: string, displayedText: string) {
    const { paragraphText } = getLoginLocators(this.page);
    await this.navigateTo(appUrl);
    await this.waitForVisibility(paragraphText(displayedText));
  }

}
