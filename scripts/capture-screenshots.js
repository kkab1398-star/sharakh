const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '../docs/screenshots');

// Viewport sizes
const viewports = {
  mobile: { width: 390, height: 844, name: 'mobile' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  desktop: { width: 1920, height: 1080, name: 'desktop' },
};

// Pages to capture
const pages = [
  { name: 'driver-login', path: '/driver/login', viewports: ['mobile', 'desktop'] },
  { name: 'driver-dashboard', path: '/driver', viewports: ['mobile', 'tablet', 'desktop'] },
  { name: 'partner-login', path: '/login', viewports: ['mobile', 'desktop'] },
  { name: 'partner-dashboard', path: '/dashboard', viewports: ['mobile', 'tablet', 'desktop'] },
];

async function captureScreenshot(browser, url, fileName, viewport) {
  try {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();

    // Set viewport
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    // Navigate
    console.log(`📸 Capturing: ${fileName}`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for images to load
    await page.waitForTimeout(2000);

    // Take screenshot
    const outputPath = path.join(OUTPUT_DIR, fileName);
    await page.screenshot({
      path: outputPath,
      fullPage: true,
      deviceScaleFactor: 2,
    });

    console.log(`✅ Saved: ${fileName}`);

    await context.close();
    return true;
  } catch (error) {
    console.error(`❌ Error capturing ${fileName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting screenshot capture...\n');

  const browser = await chromium.launch();
  let successCount = 0;
  let totalCount = 0;

  for (const page of pages) {
    for (const vpName of page.viewports) {
      const viewport = viewports[vpName];
      const fileName = `${page.name}-${vpName}.png`;
      totalCount++;

      const success = await captureScreenshot(
        browser,
        `${BASE_URL}${page.path}`,
        fileName,
        viewport
      );

      if (success) successCount++;
    }
  }

  await browser.close();

  console.log(`\n✅ Screenshot capture complete!`);
  console.log(`📊 Results: ${successCount}/${totalCount} successful\n`);
  console.log(`📁 Screenshots saved to: ${OUTPUT_DIR}\n`);
}

main().catch(console.error);
