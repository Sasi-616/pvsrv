// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('PVSRV Comprehensive Site Features Test Suite', () => {

  test('Home Page renders with title and executive portrait', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PVS Ravindra Varma/i);
    await expect(page.locator('.brand-logo').first()).toBeVisible();
    await expect(page.locator('.hero-main-title')).toBeVisible();
  });

  test('3D Flipbook Reader loads book stage and navigation controls', async ({ page }) => {
    await page.goto('/pages/reader.html?book=people-before-process');
    await expect(page).toHaveTitle(/3D Flipbook|Reader/i);

    // Flipbook main stage wrapper must be present
    const readerViewport = page.locator('#flipbookStage, .fb-stage-wrapper').first();
    await expect(readerViewport).toBeVisible();

    // Reader controls (dock next/prev buttons) should exist
    const nextBtn = page.locator('#dockBtnNext, .fb-dock-btn').first();
    await expect(nextBtn).toBeVisible();
  });

  test('Interactive Leadership Quiz loads questions and accepts selections', async ({ page }) => {
    await page.goto('/pages/quiz.html');
    await expect(page).toHaveTitle(/Quiz|Knowledge/i);

    // Question container should be displayed
    const questionCard = page.locator('#quizCardStage, .quiz-main-card').first();
    await expect(questionCard).toBeVisible();

    // Format selector buttons should be present
    const formatBtn = page.locator('.quiz-format-btn').first();
    await expect(formatBtn).toBeVisible();
    await formatBtn.click();
  });

  test('Contact Page submits inquiry form successfully and displays confirmation', async ({ page }) => {
    await page.goto('/pages/contact.html');
    await expect(page).toHaveTitle(/Connect|Consult|Contact/i);

    const contactForm = page.locator('#contactForm');
    await expect(contactForm).toBeVisible();

    await page.locator('#contactFullName').fill('Dr. Anita Desai');
    await page.locator('#contactEmail').fill('anita.desai@globalhealth.org');
    await page.locator('#contactPhone').fill('+91 98490 54321');
    await page.locator('#contactOrg').fill('Global Health Innovations');
    await page.locator('#contactDesignation').fill('VP Human Resources');
    await page.locator('#contactPurpose').selectOption('advisory');
    await page.locator('#contactMessage').fill('Requesting advisory workshop on executive psychological safety.');

    await page.locator('#contactForm button[type="submit"]').click();

    // Verify confirmation message appears
    await expect(page.locator('#contactFormSuccess')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#contactFormSuccess')).toContainText('Inquiry Received');
  });

  test('Homepage books carousel links directly to 3D Flipbook Reader', async ({ page }) => {
    await page.goto('/');

    const firstBookLink = page.locator('.book-item a.btn').first();
    await expect(firstBookLink).toBeVisible();

    const href = await firstBookLink.getAttribute('href');
    expect(href).toContain('reader.html?book=');

    // Click link and verify navigation to 3D Reader
    await firstBookLink.click();
    await expect(page).toHaveURL(/reader\.html\?book=/);
    await expect(page.locator('#flipbookStage')).toBeVisible();
  });

  test('About Page renders executive timeline and pillars', async ({ page }) => {
    await page.goto('/pages/about.html');
    await expect(page).toHaveTitle(/About/i);
    await expect(page.locator('.page-hero-banner, .about-detailed-section').first()).toBeVisible();
  });

});
