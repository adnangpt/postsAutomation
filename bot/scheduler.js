/**
 * Automation Scheduler
 * Checks automation settings and runs bots on schedule
 */

import { createClient } from '@supabase/supabase-js';
import { runBot } from './run.js';
import { getRandomViralPrompt } from '../lib/viral-prompts.js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Get last run time from database
 */
async function getLastRunTime(platform) {
  const { data, error } = await supabase
    .from('automation_logs')
    .select('created_at')
    .eq('platform', platform)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return new Date(data.created_at).getTime();
}

/**
 * Check if enough time has passed since last run
 */
async function shouldRun(platform, frequencyMinutes) {
  const lastRun = await getLastRunTime(platform);
  if (!lastRun) return true; // Never run before
  
  const minutesSinceLastRun = (Date.now() - lastRun) / 1000 / 60;
  return minutesSinceLastRun >= frequencyMinutes;
}

/**
 * Get frequency in minutes from setting
 */
function getFrequencyMinutes(frequency) {
  const frequencies = {
    'every_minute': 1,
    'every_5_minutes': 5,
    'every_15_minutes': 15,
    'every_30_minutes': 30,
    'hourly': 60,
    'every_2_hours': 120,
    'every_4_hours': 240,
    'every_6_hours': 360,
    'every_12_hours': 720,
    'daily': 1440
  };
  return frequencies[frequency] || 60; // Default to hourly
}

/**
 * Check and run automation for a platform
 */
async function checkAndRunPlatform(platform) {
  try {
    // Get settings for this platform
    const { data: settings, error } = await supabase
      .from('automation_settings')
      .select('*')
      .eq('platform', platform)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // Not "no rows returned"
        console.error(`Error fetching settings for ${platform}:`, error.message);
      }
      return;
    }

    // Check if automation is enabled
    if (!settings || !settings.is_enabled) {
      return;
    }

    // Check if credentials exist
    const { data: credentials } = await supabase
      .from('credentials')
      .select('platform')
      .eq('platform', platform)
      .single();

    if (!credentials) {
      console.log(`⚠️  ${platform}: Automation enabled but no credentials found`);
      return;
    }

    // Check if enough time has passed
    const frequencyMinutes = getFrequencyMinutes(settings.frequency);
    if (!await shouldRun(platform, frequencyMinutes)) {
      return;
    }

    // Get prompt (use viral prompts for X, custom for others)
    let prompt;
    if (platform === 'x' && settings.use_viral_prompts !== false) {
      const viralPrompt = getRandomViralPrompt();
      prompt = viralPrompt.prompt;
      console.log(`\n🔥 ${platform.toUpperCase()}: Using viral prompt - ${viralPrompt.name}`);
    } else {
      prompt = settings.prompt_template || 'Write an engaging post';
      console.log(`\n📝 ${platform.toUpperCase()}: Using custom prompt`);
    }

    // Run the bot
    console.log(`⏰ Running automation (every ${frequencyMinutes} min)`);
    const taskConfig = {
      platform,
      prompt_template: prompt,
      additional_settings: settings.additional_settings || {}
    };

    const result = await runBot(taskConfig);
    
    // Log success
    console.log(`✅ ${platform.toUpperCase()}: Post successful!`);
    if (result.url) {
      console.log(`🔗 URL: ${result.url}`);
    }

    // Save to logs
    await supabase.from('automation_logs').insert({
      platform,
      status: 'success',
      message: 'Post successful',
      post_url: result.url || null,
      created_at: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ ${platform.toUpperCase()}: Error -`, error.message);
    
    // Log error
    await supabase.from('automation_logs').insert({
      platform,
      status: 'error',
      message: error.message,
      created_at: new Date().toISOString()
    });
  }
}

/**
 * Main scheduler loop
 */
async function runScheduler() {
  console.log('\n🤖 AutoMarketer Scheduler Started');
  console.log('Checking automation settings every 30 seconds...\n');

  // Check all platforms every 30 seconds
  setInterval(async () => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] Checking automation...`);

    await Promise.all([
      checkAndRunPlatform('x'),
      checkAndRunPlatform('reddit'),
      checkAndRunPlatform('quora')
    ]);
  }, 30000); // Check every 30 seconds

  // Initial check
  await Promise.all([
    checkAndRunPlatform('x'),
    checkAndRunPlatform('reddit'),
    checkAndRunPlatform('quora')
  ]);
}

// Start scheduler if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting AutoMarketer Automation Scheduler...\n');
  runScheduler().catch(error => {
    console.error('❌ Scheduler error:', error);
    process.exit(1);
  });
}

export { runScheduler, checkAndRunPlatform };
