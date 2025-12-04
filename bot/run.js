import { runXBotAPI } from './x-api.js';
import { runRedditBot } from './reddit.js';
import { runQuoraBot } from './quora.js';

import { getCredentials } from '../lib/supabaseClient.js';
import { generateContentWithRetry } from '../lib/gemini.js';
import { getRandomViralPrompt } from '../lib/viral-prompts.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '.env') });

export async function runBot(taskConfig) {
  const { platform, prompt_template, additional_settings } = taskConfig;

  console.log(`\n=== Running ${platform.toUpperCase()} Bot ===`);
  console.log('Prompt template:', prompt_template);

  try {
    console.log('Fetching credentials...');
    const credentials = await getCredentials(platform);

    if (!credentials) {
      throw new Error(`No credentials found for platform: ${platform}`);
    }

    console.log('Generating content with Gemini AI...');
    const content = await generateContentWithRetry(prompt_template, platform);
    console.log('Generated content:', content);

    const settings = {
      content,
      credentials,
      ...additional_settings
    };

    let result;
    switch (platform) {
      case 'x':
        result = await runXBotAPI(settings);
        break;

      case 'reddit':
        result = await runRedditBot(settings);
        break;
      case 'quora':
        result = await runQuoraBot(settings);
        break;
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }

    console.log('Bot execution completed successfully!');
    return result;

  } catch (error) {
    console.error(`Error running ${platform} bot:`, error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const testConfig = {
    platform: process.argv[2] || 'x',
    prompt_template: process.argv[3] || 'Write a motivational tweet about productivity',
    additional_settings: {
      subreddit: 'test',
      title: 'Test Post from AutoMarketer',
      questionUrl: 'https://www.quora.com/What-is-productivity'
    }
  };

  runBot(testConfig)
    .then(result => {
      console.log('\n✅ Success:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Failed:', error.message);
      process.exit(1);
    });
}
