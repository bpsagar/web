import { chromium, devices } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';

// Configuration
const PORT = 4321;
// Note: This matches the 'base' in astro.config.mjs
const BASE_PATH = '/';
const BASE_URL = `http://localhost:${PORT}${BASE_PATH}`;
const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');

/**
 * Checks if the dev server is responding with a 200 OK.
 */
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

/**
 * Polls the server until it's ready or times out.
 */
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
  // Use detached: true so we can kill the entire process group later
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
      await desktopPage.waitForTimeout(1000); // Wait for potential animations
      await desktopPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop.png'), fullPage: true });

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
        // Windows: use taskkill to kill the process tree
        spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t'], { stdio: 'ignore' });
      } else {
        // Linux/macOS: kill the process group
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
