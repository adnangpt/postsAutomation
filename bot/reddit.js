import { chromium } from 'playwright';
import { decrypt } from '../lib/encryption.js';

export async function runRedditBot(settings) {
  const { content, credentials, subreddit = 'test', title = 'Automated Post' } = settings;
  
  if (!credentials || !credentials.encrypted_credentials) {
    throw new Error('Reddit credentials not found');
  }

  const decryptedCreds = JSON.parse(decrypt(credentials.encrypted_credentials));
  const { username, password } = decryptedCreds;

  console.log('Starting Reddit bot...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to Reddit login page...');
    await page.goto('https://www.reddit.com/login/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('Entering username...');
    await page.fill('input[name="username"]', username);
    await page.waitForTimeout(500);

    console.log('Entering password...');
    await page.fill('input[name="password"]', password);
    await page.waitForTimeout(500);

    console.log('Logging in...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    await page.waitForURL(/^https:\/\/www\.reddit\.com\/(?!login)/, { timeout: 15000 });
    console.log('Login successful!');

    console.log(`Navigating to r/${subreddit} submit page...`);
    await page.goto(`https://www.reddit.com/r/${subreddit}/submit`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    await page.waitForSelector('[data-testid="post-type-button"]', { timeout: 10000 });

    const postButtons = await page.locator('[data-testid="post-type-button"]').all();
    if (postButtons.length > 0) {
      await postButtons[0].click();
      await page.waitForTimeout(1000);
    }

    console.log('Entering post title...');
    await page.fill('textarea[placeholder*="Title"]', title);
    await page.waitForTimeout(500);

    console.log('Entering post content...');
    const contentTextarea = await page.locator('div[contenteditable="true"]').first();
    await contentTextarea.click();
    await page.keyboard.type(content);
    await page.waitForTimeout(1000);

    console.log('Submitting post...');
    await page.click('button:has-text("Post")');
    await page.waitForTimeout(5000);

    await page.waitForURL(/\/r\/.*\/comments\//, { timeout: 15000 });
    
    const postUrl = page.url();
    console.log('Reddit post submitted successfully!');
    console.log('Post URL:', postUrl);

    return {
      success: true,
      message: 'Reddit post submitted successfully',
      url: postUrl,
      content: content,
      title: title
    };

  } catch (error) {
    console.error('Error in Reddit bot:', error);
    
    try {
      await page.screenshot({ path: 'reddit-bot-error.png', fullPage: true });
    } catch (screenshotError) {
      console.error('Could not take screenshot:', screenshotError);
    }

    throw error;
  } finally {
    await browser.close();
  }
}
