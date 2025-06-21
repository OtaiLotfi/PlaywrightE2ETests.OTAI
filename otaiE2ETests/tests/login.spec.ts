import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AppConfig } from '../utils/config';

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.openApp(AppConfig.url, loginPage.loginTextValue);
});

test('Valid login', async ({ page }) => {
    await loginPage.loginWithCredentials(AppConfig.credentials.username, AppConfig.credentials.password);
    await loginPage.waitForVisibility(loginPage.invoicesHeader);
    console.log('Welcome to Playwright, Lotfi!'); 
});

test('Invalid login', async ({ page }) => {
    await loginPage.loginWithCredentials('', '');
    await loginPage.waitForInvisibility(loginPage.invoicesHeader);
    await loginPage.waitForTextVisibility(loginPage.noLoginTextValue);
    await loginPage.waitForVisibility(loginPage.loginError);
});