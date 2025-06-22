import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage'; 
import { getLoginLocators } from '../utils/locators';

export class LoginPage extends BasePage {
  readonly invoicesHeader: Locator;
  readonly loginTextValue: string;

  constructor(page) {
    super(page);
    this.invoicesHeader = page.locator("//span[text()='Invoices']");
    this.loginTextValue = 'Hint: demo / demo'; 
  } 

  async loginWithCredentials(username: string, password: string) {
    const { input, signInButton } = getLoginLocators(this.page);
    await this.fillInput(input('username'), username);
    await this.fillInput(input('password'), password);
    await this.clickElement(signInButton('Sign in'));
    console.log('Welcome to Playwright, Lotfi!'); 
  }

  async openApp(appUrl: string, displayedText: string) {
    const { paragraphText } = getLoginLocators(this.page);
    await this.navigateTo(appUrl);
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.waitForVisibility(paragraphText(displayedText));
  }

}
