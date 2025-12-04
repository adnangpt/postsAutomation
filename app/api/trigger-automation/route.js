import { checkAndRunPlatform } from '@/bot/scheduler.js';

export async function POST(request) {
  try {
    console.log('🔧 Manual automation trigger called');
    
    const { platform } = await request.json();
    const targetPlatform = platform || 'x';
    
    console.log(`Running automation for: ${targetPlatform}`);
    await checkAndRunPlatform(targetPlatform);
    
    return new Response(JSON.stringify({
      success: true,
      message: `Automation check completed for ${targetPlatform}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Manual trigger error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
