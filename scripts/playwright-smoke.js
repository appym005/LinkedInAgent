const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.linkedin.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    console.log(`Navigated to: ${page.url()}`);
    console.log(`Page title: ${await page.title()}`);
  } finally {
    await page.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error('Playwright smoke test failed.');
  console.error(error);
  process.exitCode = 1;
});
