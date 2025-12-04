import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const body = await request.json();
    const { platform, is_enabled, frequency_minutes, prompt_template, additional_settings } = body;

    if (!platform || !prompt_template) {
      return new Response(JSON.stringify({
        error: 'Platform and prompt_template are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Determine frequency label based on minutes
    let frequency = 'hourly';
    if (frequency_minutes === 1) frequency = 'every_minute';
    else if (frequency_minutes === 30) frequency = 'every_30_minutes';
    else if (frequency_minutes === 60) frequency = 'hourly';
    else if (frequency_minutes === 120) frequency = 'every_2_hours';
    else if (frequency_minutes === 180) frequency = 'every_3_hours';
    else if (frequency_minutes === 240) frequency = 'every_4_hours';
    else if (frequency_minutes === 360) frequency = 'every_6_hours';
    else if (frequency_minutes === 720) frequency = 'every_12_hours';
    else if (frequency_minutes === 1440) frequency = 'daily';

    // Upsert into automation_settings
    const { data, error } = await supabase
      .from('automation_settings')
      .upsert({
        platform,
        is_enabled: is_enabled || false,
        frequency_minutes: frequency_minutes || 60,
        frequency,
        prompt_template,
        additional_settings: additional_settings || {},
        updated_at: new Date().toISOString()
      }, { onConflict: 'platform' })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({
      success: true,
      message: 'Settings saved successfully',
      task: data
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error saving settings:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to save settings'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
