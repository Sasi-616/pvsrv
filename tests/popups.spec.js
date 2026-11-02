// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('PVSRV Interactive Popups and Modals Test Suite', () => {

  test('Search Modal opens, performs search, and closes properly', async ({ page }) => {
    await page.goto('/');

    const searchModal = page.locator('#searchModal');
    await expect(searchModal).not.toHaveAttribute('open', '');

    // Open via header search button
    await page.locator('#openSearchBtn').click();
    await expect(searchModal).toHaveAttribute('open', '');

    // Search for a keyword
    const searchInput = page.locator('#siteSearchInput');
    await expect(searchInput).toBeFocused();
    await searchInput.fill('leadership');

    // Verify search results appear
    const resultsContainer = page.locator('#searchResults, #searchResultsList');
    await expect(resultsContainer).toBeVisible();
    await expect(resultsContainer.locator('.search-result-item, .search-item, div').first()).toBeVisible();

    // Close via close button
    const closeBtn = page.locator('#closeSearchModal, #closeSearchModalBtn, .dialog-close-btn').first();
    await closeBtn.click();
    await expect(searchModal).not.toHaveAttribute('open', '');

    // Open via Ctrl+K keyboard shortcut
    await page.keyboard.press('Control+k');
    await expect(searchModal).toHaveAttribute('open', '');

    // Close via Escape key
    await page.keyboard.press('Escape');
    await expect(searchModal).not.toHaveAttribute('open', '');
  });

  test('Video Player Modal opens from hero CTA and video grid, and closes properly', async ({ page }) => {
    await page.goto('/');

    const videoModal = page.locator('#videoModal');
    await expect(videoModal).not.toHaveAttribute('open', '');

    // 1. Open from "Watch My Story" hero button
    await page.locator('#watchStoryBtn').click();
    await expect(videoModal).toHaveAttribute('open', '');
    await expect(page.locator('#videoModalTitle')).toBeVisible();

    // Close via video close button
    const closeBtn = videoModal.locator('#closeVideoModalBtn, .video-close-btn, .dialog-close-btn').first();
    await closeBtn.click();
    await expect(videoModal).not.toHaveAttribute('open', '');

    // 2. Open from Videos Section card play button
    const videoPlayBtn = page.locator('.circle-play-overlay').first();
    await videoPlayBtn.scrollIntoViewIfNeeded();
    await videoPlayBtn.click();
    await expect(videoModal).toHaveAttribute('open', '');

    // Close via Escape key
    await page.keyboard.press('Escape');
    await expect(videoModal).not.toHaveAttribute('open', '');
  });

  test('Book Synopsis Modal opens from carousel Details button and closes properly', async ({ page }) => {
    await page.goto('/');

    const bookModal = page.locator('#bookModal');
    await expect(bookModal).not.toHaveAttribute('open', '');

    // Find and click the Details button in the Books section
    const detailsBtn = page.locator('.btn-book-details').first();
    await detailsBtn.scrollIntoViewIfNeeded();
    await detailsBtn.click();

    // Verify book synopsis modal opened and populated
    await expect(bookModal).toHaveAttribute('open', '');
    const bookModalBody = page.locator('#bookModalBody');
    await expect(bookModalBody).toBeVisible();
    await expect(bookModalBody).not.toBeEmpty();

    // Close via close button
    const closeBtn = bookModal.locator('#closeBookModalBtn, .dialog-close-btn').first();
    await closeBtn.click();
    await expect(bookModal).not.toHaveAttribute('open', '');
  });

  test('Blog Reader Modal opens from Read More button and closes properly', async ({ page }) => {
    await page.goto('/');

    const blogModal = page.locator('#blogModal');
    await expect(blogModal).not.toHaveAttribute('open', '');

    // Find and click the Read More button in the Blogs section
    const readMoreBtn = page.locator('.link-read-more').first();
    await readMoreBtn.scrollIntoViewIfNeeded();
    await readMoreBtn.click();

    // Verify blog modal opened and populated
    await expect(blogModal).toHaveAttribute('open', '');
    const blogModalBody = page.locator('#blogModalBody');
    await expect(blogModalBody).toBeVisible();
    await expect(blogModalBody).not.toBeEmpty();

    // Close via close button
    const closeBtn = blogModal.locator('#closeBlogModalBtn, .dialog-close-btn').first();
    await closeBtn.click();
    await expect(blogModal).not.toHaveAttribute('open', '');
  });

  test('Executive About Bio Modal opens from Quick Bio button and closes properly', async ({ page }) => {
    await page.goto('/');

    const aboutModal = page.locator('#aboutModal');
    await expect(aboutModal).not.toHaveAttribute('open', '');

    // Find and click the Quick Bio button
    const quickBioBtn = page.locator('#quickBioBtn');
    await quickBioBtn.scrollIntoViewIfNeeded();
    await quickBioBtn.click();

    // Verify about modal opened
    await expect(aboutModal).toHaveAttribute('open', '');
    await expect(page.locator('#aboutModalTitle')).toContainText('PVS Ravindra Varma');

    // Close via close button
    const closeBtn = aboutModal.locator('#closeAboutModalBtn, .dialog-close-btn').first();
    await closeBtn.click();
    await expect(aboutModal).not.toHaveAttribute('open', '');
  });

  test('Books Catalog Page Excerpt Modal opens and closes properly', async ({ page }) => {
    await page.goto('/pages/books.html');

    const excerptModal = page.locator('#excerptModal');
    await expect(excerptModal).not.toHaveAttribute('open', '');

    // Click Synopsis button
    const synopsisBtn = page.locator('button:has-text("Synopsis")').first();
    await synopsisBtn.scrollIntoViewIfNeeded();
    await synopsisBtn.click();

    // Verify modal opened and populated
    await expect(excerptModal).toHaveAttribute('open', '');
    const modalBody = page.locator('#excerptModalBody');
    await expect(modalBody).toBeVisible();
    await expect(modalBody).not.toBeEmpty();

    // Close via close button
    const closeBtn = excerptModal.locator('.dialog-close-btn').first();
    await closeBtn.click();
    await expect(excerptModal).not.toHaveAttribute('open', '');
  });

  test('CMS Book Studio Dialog adds a new book title dynamically', async ({ page }) => {
    await page.goto('/admin/cms.html');

    // Switch to Books Studio tab via data-tab="books"
    const booksTabBtn = page.locator('a[data-tab="books"]');
    await booksTabBtn.click();

    const bookModalDialog = page.locator('#bookModalDialog');
    await expect(bookModalDialog).not.toHaveAttribute('open', '');

    // Click "+ Add Book Title" button
    const addBookBtn = page.locator('button:has-text("Add Book Title"), button:has-text("Add Book")').first();
    await addBookBtn.click();

    // Verify modal is open
    await expect(bookModalDialog).toHaveAttribute('open', '');

    // Fill form fields
    const testTitle = 'Test Strategy Book ' + Date.now();
    await page.locator('#bookTitleInput').fill(testTitle);
    await page.locator('#bookSubtitleInput').fill('A playbook for modern organizations');
    await page.locator('#bookCategoryInput').selectOption('Leadership & Strategy');
    await page.locator('#bookPagesInput').fill('280 Pages');
    await page.locator('#bookSynopsisInput').fill('Comprehensive strategic leadership guide for executive leaders.');

    // Submit form
    await page.locator('#bookModalForm button[type="submit"]').click();

    // Verify dialog closes
    await expect(bookModalDialog).not.toHaveAttribute('open', '');

    // Verify new book card is present in books grid
    await expect(page.getByRole('heading', { name: testTitle })).toBeVisible();
  });

});
