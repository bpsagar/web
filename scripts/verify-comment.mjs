import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to http://localhost:4321...');
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle' });

    const comments = page.locator('[data-comment]');
    const count = await comments.count();
    console.log(`Found ${count} data-comment elements.`);

    if (count === 0) {
      console.error('No data-comment elements found!');
      process.exit(1);
    }

    const firstComment = comments.first();
    const style = await firstComment.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      const afterComputed = window.getComputedStyle(el, '::after');
      return {
        textDecoration: computed.textDecoration,
        textDecorationStyle: computed.textDecorationStyle,
        afterContent: afterComputed.content,
        afterAnimation: afterComputed.animationName,
        afterBackgroundColor: afterComputed.backgroundColor
      };
    });

    console.log('Styles for [data-comment]:', style);

    if (!style.textDecoration.includes('underline')) {
      console.error('Error: Expected underline text decoration.');
      process.exit(1);
    }

    if (style.textDecorationStyle !== 'dotted') {
      console.error(`Error: Expected dotted decoration style, got ${style.textDecorationStyle}`);
      process.exit(1);
    }

    if (style.afterAnimation !== 'comment-pulse') {
      console.error(`Error: Expected comment-pulse animation, got ${style.afterAnimation}`);
      process.exit(1);
    }

    console.log('Verification successful!');
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
