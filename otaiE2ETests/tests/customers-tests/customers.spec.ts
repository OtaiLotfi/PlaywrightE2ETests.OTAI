import { test, expect } from '../../utils/fixtures';
import { appConfig } from '../../utils/config';
import { popupText } from '../../utils/elementFinder';

test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.openApp(appConfig.url, loginPage.loginTextValue);
    await loginPage.loginWithCredentials(appConfig.credentials.username, appConfig.credentials.password);
    await loginPage.waitForVisibility(loginPage.invoicesHeader);
});

test('Create A Customer', async ({ sidebarPage, customersPage, page }) => {
    await sidebarPage.clickAnItem('Customers','Customers');
    await customersPage.clickElement(customersPage.addCustomer);
    await customersPage.fillInputField('first_name', 'Lotfi');
    await customersPage.fillInputField('last_name', 'OTAI');
    await customersPage.fillInputField('email', 'lotfiotai@test.com');
    await customersPage.fillInputField('birthday', '2025-05-05');
    await customersPage.fillInputField('address', 'Centre Urbain Nord');
    await customersPage.fillInputField('city', 'Tunis');
    await customersPage.fillInputField('stateAbbr', 'Tunis Governorate');
    await customersPage.fillInputField('zipcode', '1082');
    await customersPage.fillInputField('password', 'PlaywrightLotfiDemo');
    await customersPage.fillInputField('confirm_password', 'PlaywrightLotfiDemo');
    await customersPage.clickButton('Save');
    await customersPage.waitForTextAppearance(popupText, 'Customer created');
    await customersPage.waitForTextVisibility('History');
    await customersPage.waitForTextVisibility('Stats');
    await customersPage.setCustomerStats('Segments', 'Reviewer');
    await customersPage.setCustomerStats('Has newsletter', 'Yes');
    await customersPage.clickButton('Save');
    await sidebarPage.clickAnItem('Customers','Customers');
    await customersPage.search('Lotfi');
    await customersPage.waitForTextVisibility('Lotfi OTAI');
    await page.waitForTimeout(10000);
});
