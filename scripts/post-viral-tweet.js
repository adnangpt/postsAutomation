/**
 * Post a Single Viral Tweet
 * Uses the viral prompt system to post one engaging tweet
 */

import { runXBotAPI } from '../bot/x-api.js';
import { generateContent } from '../lib/gemini.js';
import { getRandomViralPrompt } from '../lib/viral-prompts.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('\n🔥 POSTING VIRAL TWEET\n');

async function postViralTweet() {
  try {
    // Get random viral prompt
    const promptTemplate = getRandomViralPrompt();
    
    console.log('📝 Selected Prompt Category:', promptTemplate.name);
    console.log('');
    
    // Generate content
    console.log('⏳ Generating viral content with AI...');
    const content = await generateContent(promptTemplate.prompt, 'x');
    
    console.log('\n✨ Generated Tweet:');
    console.log('─'.repeat(70));
    console.log(content);
    console.log('─'.repeat(70));
    console.log(`📊 Length: ${content.length}/280 characters\n`);
    
    // Get credentials
    console.log('🔐 Fetching credentials...');
    const { data: credentials, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('platform', 'x')
      .single();

    if (error || !credentials) {
      throw new Error('X credentials not found. Please run OAuth setup first.');
    }

    // Post tweet
    console.log('🚀 Posting to X (Twitter)...\n');
    const result = await runXBotAPI({ content, credentials });

    console.log('✅ SUCCESS! Tweet posted!\n');
    console.log('🔗 URL:', result.url);
    console.log('🆔 Tweet ID:', result.tweetId);
    console.log('\n🎉 Your viral content is now live!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('credentials not found')) {
      console.log('\n💡 Next Steps:');
      console.log('1. Run: node scripts/setup-oauth2-flow.js');
      console.log('2. Then: node scripts/save-oauth2-credentials.js');
      console.log('3. Try again: node scripts/post-viral-tweet.js\n');
    }
    
    process.exit(1);
  }
}

postViralTweet();
