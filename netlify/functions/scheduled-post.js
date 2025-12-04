import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event, context) => {
  console.log('🤖 Netlify Scheduled Function: Checking automation...');
  
  try {
    // Get all enabled automation settings
    const { data: settings, error } = await supabase
      .from('automation_settings')
      .select('*')
      .eq('is_enabled', true);

    if (error) {
      console.error('Error fetching settings:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }

    console.log(`Found ${settings?.length || 0} enabled platforms`);

    // For each enabled platform, trigger the automation endpoint
    const results = await Promise.allSettled(
      (settings || []).map(async (setting) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://postsautomation.netlify.app'}/api/trigger-automation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform: setting.platform })
        });
        return response.json();
      })
    );

    console.log('✅ Automation check complete');
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Automation check complete',
        results: results.map(r => r.status === 'fulfilled' ? r.value : r.reason)
      })
    };
    
  } catch (error) {
    console.error('❌ Fatal scheduler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const config = {
  schedule: "@hourly"
};
