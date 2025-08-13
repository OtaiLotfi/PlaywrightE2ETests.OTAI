import { test } from '../../utils/fixtures';
import { appConfig } from '../../utils/config';
import { popupText } from '../../utils/elementFinder';

test.beforeEach(async ({ page, loginPage }) => {
  await loginPage.openApp(appConfig.url, loginPage.loginTextValue);
});

test('Valid login', async ({ loginPage }) => {
    await loginPage.loginWithCredentials(appConfig.credentials.username, appConfig.credentials.password);
    await loginPage.waitForVisibility(loginPage.invoicesHeader);
    console.log('Welcome to Playwright, Lotfi!'); 
});

test('Invalid login', async ({ loginPage }) => {
    await loginPage.loginWithCredentials('', '');
    await loginPage.waitForInvisibility(loginPage.invoicesHeader);
    await loginPage.waitForTextAppearance(popupText, 'The form is not valid. Please check for errors');
});