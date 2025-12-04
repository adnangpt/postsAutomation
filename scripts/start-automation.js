#!/usr/bin/env node
/**
 * Start Automation Scheduler
 * This keeps running in the background and checks automation settings
 */

import { runScheduler } from '../bot/scheduler.js';

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║          🤖 AutoMarketer Automation Scheduler              ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📋 What this does:');
console.log('   - Checks automation settings every 30 seconds');
console.log('   - Posts automatically based on your schedule');
console.log('   - Uses viral prompts for X (Twitter)');
console.log('   - Logs all activity to Supabase\n');

console.log('⚙️  How to configure:');
console.log('   - Go to http://localhost:3000/automation/x');
console.log('   - Enable automation');
console.log('   - Set your posting frequency');
console.log('   - Customize prompts (optional)\n');

console.log('🛑 To stop: Press Ctrl+C\n');
console.log('─'.repeat(60) + '\n');

runScheduler().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping automation scheduler...');
  console.log('✅ Goodbye!\n');
  process.exit(0);
});
