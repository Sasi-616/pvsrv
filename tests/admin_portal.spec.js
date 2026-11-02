// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('PVSRV Executive Admin CMS & Full-Stack Portal Test Suite', () => {

  test('Admin Login page authenticates credentials and redirects to CMS Studio', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page).toHaveTitle(/Admin Portal Login|Login/i);

    // Fast-track demo access button
    const quickDemoBtn = page.locator('#quickDemoBtn');
    await expect(quickDemoBtn).toBeVisible();
    await quickDemoBtn.click();

    // Verify inputs filled
    await expect(page.locator('#adminEmail')).toHaveValue('admin@pvsrv.com');
    await expect(page.locator('#adminPassword')).toHaveValue('pvsrv2026');

    // Wait for redirect to CMS
    await page.waitForURL('**/admin/cms.html', { timeout: 8000 });
    await expect(page).toHaveTitle(/CMS Studio/i);
  });

  test('CMS Studio renders Supabase cloud status bar and opens database settings', async ({ page }) => {
    await page.goto('/admin/cms.html');

    // Supabase cloud bar should be visible on dashboard
    const sbBar = page.locator('.supabase-cloud-bar');
    await expect(sbBar).toBeVisible();
    await expect(page.locator('#sbLiveStatusBadge')).toBeVisible();

    // Open Supabase Settings dialog
    const dbSettingsBtn = page.locator('button:has-text("Database Settings")');
    await expect(dbSettingsBtn).toBeVisible();
    await dbSettingsBtn.click();

    const sbModal = page.locator('#supabaseModal');
    await expect(sbModal).toHaveAttribute('open', '');
    await expect(page.locator('#sbProjectUrl')).toBeVisible();
    await expect(page.locator('#sbAnonKey')).toBeVisible();

    // Close modal
    const closeBtn = sbModal.locator('button:has-text("✕"), button:has-text("Cancel")').first();
    await closeBtn.click();
    await expect(sbModal).not.toHaveAttribute('open', '');
  });

  test('CMS Studio switches between Articles, Books, Quiz, and Inquiries tabs', async ({ page }) => {
    await page.goto('/admin/cms.html');

    // 1. Articles Tab
    const articlesTab = page.locator('a[data-tab="articles"]');
    await articlesTab.click();
    await expect(page.locator('#panel-articles')).toBeVisible();
    await expect(page.locator('#panel-dashboard')).toBeHidden();

    // 2. Books Tab
    const booksTab = page.locator('a[data-tab="books"]');
    await booksTab.click();
    await expect(page.locator('#panel-books')).toBeVisible();

    // 3. Quiz Tab
    const quizTab = page.locator('a[data-tab="quiz"]');
    await quizTab.click();
    await expect(page.locator('#panel-quiz')).toBeVisible();

    // 4. Inquiries / CRM Tab
    const inboxTab = page.locator('a[data-tab="inbox"]');
    await inboxTab.click();
    await expect(page.locator('#panel-inbox')).toBeVisible();
  });

  test('CMS 1-Click Sample Article publishes and updates table dynamically', async ({ page }) => {
    await page.goto('/admin/cms.html');

    // Click sample article button on dashboard
    const sampleArtBtn = page.locator('#quickAddSampleArticleBtn');
    await sampleArtBtn.click();

    // Should switch to articles panel and show newly published article
    await expect(page.locator('#panel-articles')).toBeVisible();
    await expect(page.locator('text=Leading with Purpose').first()).toBeVisible();
  });

});

