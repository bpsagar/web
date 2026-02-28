import { chromium, devices } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';

// Configuration
const PORT = 4321;
const BASE_PATH = '/';
const BASE_URL = `http://localhost:${PORT}${BASE_PATH}`;
const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');

async function isServerReady() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(500);
    req.end();
  });
}

async function waitForServer() {
  console.log(`Waiting for server to be ready at ${BASE_URL}...`);
  for (let i = 0; i < 60; i++) {
    if (await isServerReady()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('Starting dev server...');
  const server = spawn('npx', ['astro', 'dev', '--port', PORT], {
    shell: true,
    stdio: 'ignore',
    detached: process.platform !== 'win32'
  });

  try {
    const ready = await waitForServer();
    if (!ready) {
      throw new Error(`Server failed to start at ${BASE_URL} within 60 seconds.`);
    }

    const browser = await chromium.launch();

    try {
      // Desktop Screenshot
      console.log('Taking desktop screenshot...');
      const desktopContext = await browser.newContext(devices['Desktop Chrome']);
      const desktopPage = await desktopContext.newPage();
      await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await desktopPage.waitForTimeout(1000);
      await desktopPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop.png'), fullPage: true });

      // Expanded State Screenshot
      console.log('Taking expanded app screenshot...');
      // Click the label associated with story.cv
      await desktopPage.click('label[for="app-story.cv"]');
      await desktopPage.waitForTimeout(1000); // Wait for transition
      await desktopPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-expanded.png'), fullPage: true });

      // Mobile Screenshot
      console.log('Taking mobile screenshot...');
      const mobileContext = await browser.newContext(devices['iPhone 13']);
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await mobilePage.waitForTimeout(1000);
      await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile.png'), fullPage: true });
    } finally {
      await browser.close();
    }

    console.log('Screenshots successfully saved to /screenshots');
  } finally {
    console.log('Stopping dev server...');
    if (server.pid) {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t'], { stdio: 'ignore' });
      } else {
        try {
          process.kill(-server.pid, 'SIGKILL');
        } catch (e) {
          server.kill('SIGKILL');
        }
      }
    }
  }
}

main().catch(err => {
  console.error('Error during screenshot generation:', err.message);
  process.exit(1);
});
