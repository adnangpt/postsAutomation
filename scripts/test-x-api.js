/**
 * Test script for X API bot
 * Usage: node scripts/test-x-api.js "<prompt>"
 * Example: node scripts/test-x-api.js "Write a tweet about AI"
 */

import dotenv from 'dotenv';
dotenv.config();

import { runXBotAPI } from '../bot/x-api.js';
import { getCredentials } from '../lib/supabaseClient.js';
import { generateContentWithRetry } from '../lib/gemini.js';

const prompt = process.argv[2] || 'Write a motivational tweet about success';

console.log('🐦 Testing X (Twitter) API Bot\n');
console.log('Prompt:', prompt);
console.log('─'.repeat(60));

async function test() {
  try {
    // Get credentials
    console.log('\n1️⃣ Fetching X API credentials...');
    const credentials = await getCredentials('x');
    
    if (!credentials) {
      throw new Error('X API credentials not found. Run: node scripts/setup-x-api-credentials.js');
    }
    
    console.log('✅ Credentials found');

    // Generate content
    console.log('\n2️⃣ Generating content with Gemini AI...');
    const content = await generateContentWithRetry(prompt, 'x');
    console.log('✅ Generated content:');
    console.log('─'.repeat(60));
    console.log(content);
    console.log('─'.repeat(60));
    console.log(`📊 Character count: ${content.length}`);

    // Post to X
    console.log('\n3️⃣ Posting to X (Twitter)...');
    const result = await runXBotAPI({
      content,
      credentials
    });

    console.log('\n✅ SUCCESS!');
    console.log('─'.repeat(60));
    console.log('Tweet posted successfully!');
    console.log('Tweet ID:', result.tweetId);
    console.log('View at:', result.url);
    console.log('─'.repeat(60));

    process.exit(0);

  } catch (error) {
    console.error('\n❌ FAILED!');
    console.error('Error:', error.message);
    
    if (error.message.includes('credentials not found')) {
      console.log('\n💡 Next step: Get X API credentials and run:');
      console.log('   node scripts/setup-x-api-credentials.js');
    } else if (error.code === 401 || error.code === 403) {
      console.log('\n💡 Authentication error. Check your X API credentials:');
      console.log('   1. Go to https://developer.twitter.com/en/portal/dashboard');
      console.log('   2. Verify your API keys are correct');
      console.log('   3. Make sure your app has Read and Write permissions');
      console.log('   4. Regenerate tokens if needed');
    }
    
    process.exit(1);
  }
}

test();
