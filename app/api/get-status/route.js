import { getTasks } from '@/lib/supabaseClient';

export async function GET(request) {
  try {
    const tasks = await getTasks();

    return new Response(JSON.stringify({
      success: true,
      tasks
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error getting status:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to get status'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
