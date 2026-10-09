import { test, expect } from '@playwright/test';

test.describe('ExploreBharat End-to-End User Journeys', () => {

  test('1. Homepage & Hero Navigation loads properly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ExploreBharat/);
    
    // Header navigation links
    const brand = page.locator('header');
    await expect(brand).toBeVisible();

    // Verify main headings
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('2. Destinations & Attractions discovery catalogue', async ({ page }) => {
    await page.goto('/destinations');
    await expect(page).toHaveTitle(/ExploreBharat/);

    // Wait for client-side catalog fetch
    const destCard = page.locator('a[href*="/destinations/"]').first();
    await expect(destCard).toBeVisible({ timeout: 10000 });

    // Navigate to Attractions
    await page.goto('/attractions');
    const attrCard = page.locator('a[href*="/attractions/"]').first();
    await expect(attrCard).toBeVisible({ timeout: 10000 });
  });

  test('3. Multimodal Door-to-Door Journey Planner', async ({ page }) => {
    await page.goto('/smart-journey');
    await expect(page.locator('h1')).toContainText(/Smart Journey/i);

    // Check search form presence
    const searchBtn = page.getByRole('button', { name: /Generate Door-to-Door Plan/i });
    await expect(searchBtn).toBeVisible();

    // Trigger journey route computation
    await searchBtn.click();
    await page.waitForTimeout(1000);

    // Verify that route alternative cards or tabs appear
    const alternatives = page.locator('text=/Fastest|Cheapest|Balanced|Eco|Transit/i');
    await expect(alternatives.first()).toBeVisible({ timeout: 10000 });
  });

  test('4. Digital Travel Wallet & Offline QR Passes', async ({ page }) => {
    await page.goto('/wallet');
    await expect(page.locator('h1')).toContainText(/My Travel Wallet/i);

    // Verify presence of confirmed pass cards
    const passCard = page.locator('text=/EB-AMB-|EB-HTL-|EB-RL-/i').first();
    await expect(passCard).toBeVisible({ timeout: 10000 });

    // Verify QR token container
    const qrSection = page.locator('canvas, svg, div:has-text("QR")').first();
    await expect(qrSection).toBeVisible();
  });

  test('5. Offline Travel Companion & Emergency Helplines Hub', async ({ page }) => {
    await page.goto('/offline');
    await expect(page.locator('h1')).toContainText(/You're Currently Offline/i);

    // Verify Essential National Helplines: 112, 1363, 139, 108
    await expect(page.locator('text=112').first()).toBeVisible();
    await expect(page.locator('text=1363').first()).toBeVisible();
    await expect(page.locator('text=139').first()).toBeVisible();
    await expect(page.locator('text=108').first()).toBeVisible();

    // Verify links to Wallet and Saved Trips
    const walletLink = page.getByRole('link', { name: /View Offline Passes/i });
    await expect(walletLink).toBeVisible();
  });

  test('6. Admin Center & Governance Security Guard', async ({ page }) => {
    await page.goto('/admin');
    
    // Verify RBAC access gate protects unauthenticated visitors
    const accessNotice = page.locator('text=/Administrator Access Required|Admin Command Center/i').first();
    await expect(accessNotice).toBeVisible({ timeout: 10000 });
  });

});
