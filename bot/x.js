import { chromium } from 'playwright';
import { decrypt } from '../lib/encryption.js';

export async function runXBot(settings) {
  const { content, credentials } = settings;
  
  if (!credentials || !credentials.encrypted_credentials) {
    throw new Error('X credentials not found');
  }

  const decryptedCreds = JSON.parse(decrypt(credentials.encrypted_credentials));
  const { username, password } = decryptedCreds;

  console.log('Starting X (Twitter) bot...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to X login page...');
    await page.goto('https://twitter.com/i/flow/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('Entering username...');
    const usernameInput = await page.waitForSelector('input[autocomplete="username"]', { timeout: 10000 });
    await usernameInput.fill(username);
    await page.waitForTimeout(1000);
    
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    const needsVerification = await page.locator('input[data-testid="ocfEnterTextTextInput"]').count() > 0;
    
    if (needsVerification) {
      console.log('Additional verification required - this flow needs manual setup');
    }

    console.log('Entering password...');
    const passwordInput = await page.waitForSelector('input[name="password"]', { timeout: 10000 });
    await passwordInput.fill(password);
    await page.waitForTimeout(1000);
    
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);

    await page.waitForSelector('[data-testid="AppTabBar_Home_Link"]', { timeout: 15000 });
    console.log('Login successful!');

    console.log('Composing tweet...');
    await page.click('a[data-testid="SideNav_NewTweet_Button"]');
    await page.waitForTimeout(2000);

    const tweetBox = await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 5000 });
    await tweetBox.fill(content);
    await page.waitForTimeout(1000);

    console.log('Posting tweet...');
    await page.click('[data-testid="tweetButtonInline"]');
    await page.waitForTimeout(3000);

    console.log('Tweet posted successfully!');

    return {
      success: true,
      message: 'Tweet posted successfully',
      content: content
    };

  } catch (error) {
    console.error('Error in X bot:', error);
    
    try {
      await page.screenshot({ path: 'x-bot-error.png', fullPage: true });
    } catch (screenshotError) {
      console.error('Could not take screenshot:', screenshotError);
    }

    throw error;
  } finally {
    await browser.close();
  }
}
