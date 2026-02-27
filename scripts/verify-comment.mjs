import { chromium, devices } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}/`;
const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');

async function isServerReady() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(500);
    req.end();
  });
}

async function waitForServer() {
  console.log(`Waiting for server to be ready at ${BASE_URL}...`);
  for (let i = 0; i < 60; i++) {
    if (await isServerReady()) return true;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  console.log('Starting dev server...');
  const server = spawn('npx', ['astro', 'dev', '--port', PORT], {
    shell: true,
    stdio: 'ignore',
    detached: true
  });

  try {
    const ready = await waitForServer();
    if (!ready) throw new Error(`Server failed to start.`);

    const browser = await chromium.launch();

    try {
      // Desktop
      console.log('Taking desktop comment screenshot...');
      const desktopContext = await browser.newContext(devices['Desktop Chrome']);
      const desktopPage = await desktopContext.newPage();
      await desktopPage.goto(BASE_URL);

      // Open the accordion first
      await desktopPage.click('label[for="app-story.cv"]');
      await desktopPage.waitForTimeout(500);

      // Click the comment trigger
      await desktopPage.click('[data-comment]');
      await desktopPage.waitForTimeout(500);

      await desktopPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-comment.png'), fullPage: true });

      // Mobile
      console.log('Taking mobile comment screenshot...');
      const mobileContext = await browser.newContext(devices['iPhone 13']);
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(BASE_URL);

      await mobilePage.click('label[for="app-story.cv"]');
      await mobilePage.waitForTimeout(500);
      await mobilePage.click('[data-comment]');
      await mobilePage.waitForTimeout(500);

      await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile-comment.png'), fullPage: true });
    } finally {
      await browser.close();
    }
  } finally {
    console.log('Stopping dev server...');
    process.kill(-server.pid, 'SIGKILL');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
