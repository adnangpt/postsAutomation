import { getLogs } from '@/lib/supabaseClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const limit = parseInt(searchParams.get('limit') || '100');

    const logs = await getLogs(taskId, limit);

    return new Response(JSON.stringify({
      success: true,
      logs
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error getting logs:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to get logs'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
