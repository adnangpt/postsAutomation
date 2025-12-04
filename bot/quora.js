import { chromium } from 'playwright';
import { decrypt } from '../lib/encryption.js';

export async function runQuoraBot(settings) {
  const { content, credentials, questionUrl } = settings;
  
  if (!credentials || !credentials.encrypted_credentials) {
    throw new Error('Quora credentials not found');
  }

  if (!questionUrl) {
    throw new Error('Question URL is required for Quora bot');
  }

  const decryptedCreds = JSON.parse(decrypt(credentials.encrypted_credentials));
  const { email, password } = decryptedCreds;

  console.log('Starting Quora bot...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to Quora...');
    await page.goto('https://www.quora.com/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('Clicking login...');
    const loginButton = await page.locator('button:has-text("Login"), a:has-text("Login")').first();
    if (loginButton) {
      await loginButton.click();
      await page.waitForTimeout(2000);
    }

    console.log('Entering email...');
    await page.fill('input[type="email"]', email);
    await page.waitForTimeout(500);

    console.log('Entering password...');
    await page.fill('input[type="password"]', password);
    await page.waitForTimeout(500);

    console.log('Logging in...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    console.log('Waiting for login to complete...');
    await page.waitForTimeout(3000);

    console.log(`Navigating to question: ${questionUrl}`);
    await page.goto(questionUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('Clicking answer button...');
    const answerButton = await page.locator('button:has-text("Answer"), div[role="button"]:has-text("Answer")').first();
    await answerButton.click();
    await page.waitForTimeout(2000);

    console.log('Typing answer...');
    const editor = await page.locator('div[contenteditable="true"]').first();
    await editor.click();
    await page.waitForTimeout(500);

    const paragraphs = content.split('\n\n');
    for (let i = 0; i < paragraphs.length; i++) {
      await page.keyboard.type(paragraphs[i]);
      if (i < paragraphs.length - 1) {
        await page.keyboard.press('Enter');
        await page.keyboard.press('Enter');
      }
      await page.waitForTimeout(300);
    }

    await page.waitForTimeout(1000);

    console.log('Submitting answer...');
    const submitButton = await page.locator('button:has-text("Post"), button:has-text("Submit")').first();
    await submitButton.click();
    await page.waitForTimeout(5000);

    console.log('Quora answer posted successfully!');

    return {
      success: true,
      message: 'Quora answer posted successfully',
      questionUrl: questionUrl,
      content: content
    };

  } catch (error) {
    console.error('Error in Quora bot:', error);
    
    try {
      await page.screenshot({ path: 'quora-bot-error.png', fullPage: true });
    } catch (screenshotError) {
      console.error('Could not take screenshot:', screenshotError);
    }

    throw error;
  } finally {
    await browser.close();
  }
}
