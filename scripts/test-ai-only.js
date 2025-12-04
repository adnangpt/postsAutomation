/**
 * Test AI content generation only (no bot posting)
 * Usage: node scripts/test-ai-only.js <platform> "<prompt>"
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

import { generateContentWithRetry } from '../lib/gemini.js';

const platform = process.argv[2] || 'x';
const prompt = process.argv[3] || 'Write a motivational tweet about success';

console.log(`🤖 Testing AI Content Generation`);
console.log(`Platform: ${platform}`);
console.log(`Prompt: ${prompt}\n`);

generateContentWithRetry(prompt, platform)
  .then(content => {
    console.log('✅ Generated Content:\n');
    console.log('─'.repeat(60));
    console.log(content);
    console.log('─'.repeat(60));
    console.log(`\n📊 Character count: ${content.length}`);
    
    if (platform === 'x' && content.length > 280) {
      console.log('⚠️  Warning: Tweet is longer than 280 characters');
    }
    
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Failed to generate content:', error.message);
    process.exit(1);
  });
