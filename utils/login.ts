import { Page, expect } from '@playwright/test';

export async function loginWithCredentials(page: Page, username: string, password: string) {
  await page.goto('https://marmelab.com/react-admin-demo/#/invoices'); 
  await expect(page.locator("//p[text()='Hint: demo / demo']")).toBeVisible();
  await page.locator("//input[@name='username']").fill(username);
  await page.locator("//input[@name='password']").fill(password);
  await page.locator("//button[text()='Sign in']").click();
}
