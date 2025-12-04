import { checkAndRunPlatform } from '../../bot/scheduler.js';

export default async (req) => {
  // This function runs on a schedule (e.g. hourly) defined in netlify.toml
  // It checks all platforms and runs them if they are due
  
  console.log('🤖 Netlify Scheduled Function: Checking automation...');
  
  try {
    const results = await Promise.allSettled([
      checkAndRunPlatform('x'),
      checkAndRunPlatform('reddit'),
      checkAndRunPlatform('quora')
    ]);
    
    const errors = results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason);
      
    if (errors.length > 0) {
      console.error('❌ Some platforms failed:', errors);
    }
    
    console.log('✅ Automation check complete');
    return new Response("Automation check complete");
    
  } catch (error) {
    console.error('❌ Fatal scheduler error:', error);
    return new Response("Scheduler error", { status: 500 });
  }
};

export const config = {
  schedule: "@hourly"
};
