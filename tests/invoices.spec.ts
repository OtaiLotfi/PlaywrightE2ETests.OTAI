import { test, expect } from '@playwright/test';
import { loginWithCredentials } from '../utils/login';

test.beforeEach(async ({ page }) => {
  await loginWithCredentials(page, 'demo', 'demo');
});

test('Invoices page is visible', async ({ page }) => {
  await expect(page.locator("//span[text()='Invoices']")).toBeVisible();
  await page.waitForTimeout(10000);
});