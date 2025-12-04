import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all enabled tasks
    const { data: tasks, error: tasksError } = await supabaseClient
      .from('tasks')
      .select('*')
      .eq('is_enabled', true)

    if (tasksError) {
      throw tasksError
    }

    const now = new Date()
    const results = []

    for (const task of tasks) {
      // Check if it's time to run
      if (task.next_run && new Date(task.next_run) <= now) {
        try {
          // Call the app's API endpoint to run the bot
          const appUrl = Deno.env.get('APP_URL') || 'http://localhost:3000'
          
          const response = await fetch(`${appUrl}/api/test-post`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              platform: task.platform,
              prompt_template: task.prompt_template,
              additional_settings: task.additional_settings || {}
            })
          })

          const result = await response.json()

          if (response.ok) {
            // Update task with new run times
            const lastRun = now.toISOString()
            const nextRun = new Date(now.getTime() + task.frequency_minutes * 60000).toISOString()

            await supabaseClient
              .from('tasks')
              .update({ 
                last_run: lastRun, 
                next_run: nextRun 
              })
              .eq('id', task.id)

            // Log success
            await supabaseClient
              .from('logs')
              .insert({
                task_id: task.id,
                message: `Successfully posted to ${task.platform}`,
                level: 'info',
                timestamp: now.toISOString()
              })

            results.push({ 
              task_id: task.id, 
              platform: task.platform, 
              status: 'success' 
            })
          } else {
            throw new Error(result.error || 'Failed to post')
          }
        } catch (error) {
          // Log error
          await supabaseClient
            .from('logs')
            .insert({
              task_id: task.id,
              message: `Error posting to ${task.platform}: ${error.message}`,
              level: 'error',
              timestamp: now.toISOString()
            })

          results.push({ 
            task_id: task.id, 
            platform: task.platform, 
            status: 'error', 
            error: error.message 
          })
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
