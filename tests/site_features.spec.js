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

  test('Contact Page renders inquiry form and details', async ({ page }) => {
    await page.goto('/pages/contact.html');
    await expect(page).toHaveTitle(/Connect|Consult|Contact/i);

    const contactForm = page.locator('form, #contactForm, .contact-form').first();
    await expect(contactForm).toBeVisible();
  });

  test('About Page renders executive timeline and pillars', async ({ page }) => {
    await page.goto('/pages/about.html');
    await expect(page).toHaveTitle(/About/i);
    await expect(page.locator('.page-hero-banner, .about-detailed-section').first()).toBeVisible();
  });

});
