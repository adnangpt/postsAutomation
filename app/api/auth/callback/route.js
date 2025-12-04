/**
 * OAuth 2.0 Callback Handler for X (Twitter)
 * This endpoint receives the authorization code after user approves the app
 */

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // If there's an error from X
  if (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error,
        description: searchParams.get('error_description') 
      },
      { status: 400 }
    );
  }

  // For the setup script, just show the callback data
  // In production, you'd exchange the code for tokens here
  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>OAuth Callback</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 { color: #1da1f2; }
          code {
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 14px;
          }
          .url-box {
            background: #f8f8f8;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 12px;
          }
          .success { color: #17bf63; }
          .instruction {
            background: #e8f5e9;
            padding: 15px;
            border-left: 4px solid #4caf50;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Authorization Successful!</h1>
          <p>Copy the full URL below and paste it into the terminal:</p>
          
          <div class="url-box">
            ${request.url}
          </div>

          <div class="instruction">
            <strong>📋 Instructions:</strong>
            <ol>
              <li>Copy the entire URL above</li>
              <li>Go back to your terminal</li>
              <li>Paste it when prompted</li>
              <li>Press Enter</li>
            </ol>
          </div>

          <p><strong>Details:</strong></p>
          <ul>
            <li>Authorization Code: <code>${code ? code.substring(0, 20) + '...' : 'N/A'}</code></li>
            <li>State: <code>${state ? state.substring(0, 20) + '...' : 'N/A'}</code></li>
          </ul>

          <p style="color: #666; font-size: 14px;">
            You can close this window after copying the URL.
          </p>
        </div>
      </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}
