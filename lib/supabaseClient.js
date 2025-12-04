import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars for when running from scripts
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file.');
}

// Client for browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to get tasks
export async function getTasks(enabled = null) {
  let query = supabase.from('tasks').select('*');
  
  if (enabled !== null) {
    query = query.eq('is_enabled', enabled);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  
  return data;
}

// Helper function to get a single task
export async function getTask(id) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching task:', error);
    return null;
  }
  
  return data;
}

// Helper function to create or update a task
export async function upsertTask(task) {
  const { data, error } = await supabase
    .from('tasks')
    .upsert(task)
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting task:', error);
    throw error;
  }
  
  return data;
}

// Helper function to log messages
export async function createLog(taskId, message, level = 'info') {
  const { data, error } = await supabase
    .from('logs')
    .insert({
      task_id: taskId,
      message,
      level,
      timestamp: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating log:', error);
    return null;
  }
  
  return data;
}

// Helper function to get logs
export async function getLogs(taskId = null, limit = 100) {
  let query = supabase
    .from('logs')
    .select('*, tasks(platform)')
    .order('timestamp', { ascending: false })
    .limit(limit);
  
  if (taskId) {
    query = query.eq('task_id', taskId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
  
  return data;
}

// Helper function to get credentials
export async function getCredentials(platform) {
  const { data, error } = await supabaseAdmin
    .from('credentials')
    .select('*')
    .eq('platform', platform)
    .single();
  
  if (error) {
    console.error('Error fetching credentials:', error);
    return null;
  }
  
  return data;
}

// Helper function to save credentials
export async function saveCredentials(platform, credentials) {
  const { data, error } = await supabaseAdmin
    .from('credentials')
    .upsert({
      platform,
      encrypted_credentials: credentials,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving credentials:', error);
    throw error;
  }
  
  return data;
}

// Helper to update task's last_run and next_run
export async function updateTaskRuns(taskId, lastRun, nextRun) {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      last_run: lastRun,
      next_run: nextRun
    })
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating task runs:', error);
    return null;
  }
  
  return data;
}
