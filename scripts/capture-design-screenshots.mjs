#!/usr/bin/env node

import chromium from '@sparticuz/chromium-core';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, '..', '_design_review_');

// Ensure directory exists
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const BASE_URL = 'http://localhost:3000';
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 2 };

async function takeScreenshot(name, path) {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: VIEWPORT,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle2' });

    const screenshotPath = `${screenshotsDir}/${name}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`✅ Captured: ${name}`);
    await browser.close();
  } catch (error) {
    console.error(`❌ Error capturing ${name}:`, error.message);
  }
}

async function main() {
  console.log('🎬 Capturing design screenshots...\n');

  const screenshots = [
    { name: '1-partner-login', path: '/login' },
    { name: '2-driver-login', path: '/driver/login?p=test' },
    { name: '3-partner-dashboard', path: '/dashboard' },
    { name: '4-driver-dashboard', path: '/driver' },
    { name: '5-add-transaction', path: '/driver/add-transaction' },
  ];

  for (const shot of screenshots) {
    await takeScreenshot(shot.name, shot.path);
  }

  console.log(`\n✅ All screenshots saved to: ${screenshotsDir}`);
}

main();
