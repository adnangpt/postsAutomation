/**
 * Test Viral Content Generation
 * Generates sample tweets using the new viral prompts
 */

import { generateContent } from '../lib/gemini.js';
import { getRandomViralPrompt, getAllPrompts } from '../lib/viral-prompts.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n🔥 VIRAL CONTENT GENERATOR TEST\n');
console.log('Generating 5 sample tweets using different prompt templates...\n');
console.log('='.repeat(70) + '\n');

async function testViralContent() {
  try {
    // Generate 5 different tweets
    for (let i = 1; i <= 5; i++) {
      const promptTemplate = getRandomViralPrompt();
      
      console.log(`\n📝 Tweet ${i}:`);
      console.log(`Category: ${promptTemplate.name}`);
      console.log(`Prompt: ${promptTemplate.prompt.substring(0, 80)}...`);
      console.log('\n⏳ Generating...\n');
      
      const content = await generateContent(promptTemplate.prompt, 'x');
      
      console.log('✨ Generated Tweet:');
      console.log('─'.repeat(70));
      console.log(content);
      console.log('─'.repeat(70));
      console.log(`📊 Length: ${content.length}/280 characters`);
      console.log('='.repeat(70));
      
      // Wait a bit between requests
      if (i < 5) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n\n✅ Content generation test complete!');
    console.log('\n💡 These are the types of tweets your bot will post automatically.');
    console.log('\n🎯 Available Prompt Categories:');
    const allPrompts = getAllPrompts();
    Object.entries(allPrompts).forEach(([category, prompts]) => {
      console.log(`\n   ${category}: ${prompts.length} prompts`);
    });
    
    console.log('\n\n🚀 Next Steps:');
    console.log('1. Complete OAuth setup: node scripts/setup-oauth2-flow.js');
    console.log('2. Save credentials: node scripts/save-oauth2-credentials.js');
    console.log('3. Post a real tweet: node scripts/post-viral-tweet.js');
    console.log('4. Enable automation in dashboard\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testViralContent();
