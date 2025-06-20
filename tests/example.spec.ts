import { test, expect } from '@playwright/test';
import { loginWithCredentials } from '../utils/login';

test('check Otai brand page title', async ({ page }) => {
    await loginWithCredentials(page, 'demo', 'demo');
    await page.waitForTimeout(10000);
});
