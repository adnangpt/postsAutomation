/**
 * Test script for individual bots
 * Usage: node scripts/test-bot.js <platform> "<prompt>"
 * Example: node scripts/test-bot.js x "Write a tweet about AI"
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env FIRST before importing anything else
dotenv.config({ path: join(__dirname, '..', '.env') });

import { runBot } from '../bot/run.js';

const platform = process.argv[2];
const prompt = process.argv[3];

if (!platform || !prompt) {
  console.error('Usage: node scripts/test-bot.js <platform> "<prompt>"');
  console.error('Platforms: x, reddit, quora');
  process.exit(1);
}

const additionalSettings = {
  subreddit: 'test',
  title: 'Test Post from AutoMarketer',
  questionUrl: 'https://www.quora.com/What-is-artificial-intelligence'
};

console.log(`Testing ${platform} bot...`);
console.log(`Prompt: ${prompt}\n`);

runBot({
  platform,
  prompt_template: prompt,
  additional_settings: additionalSettings
})
  .then(result => {
    console.log('\n✅ Bot test successful!');
    console.log('Result:', JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Bot test failed!');
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  });
