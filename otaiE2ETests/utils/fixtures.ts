import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SidebarPage } from '../pages/SidebarPage';
import { CustomersPage } from '../pages/CustomersPage';

type Pages = {
  loginPage: LoginPage;
  sidebarPage: SidebarPage;
  customersPage: CustomersPage;
};

export const test = baseTest.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  sidebarPage: async ({ page }, use) => {
    await use(new SidebarPage(page));
  },
  customersPage: async ({ page }, use) => {
    await use(new CustomersPage(page));
  },
});

export { expect } from '@playwright/test';
