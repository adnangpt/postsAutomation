# AutoMarketer

A full-stack automation platform for posting content on X (Twitter), Reddit, and Quora using AI-generated content.

## Features

- 🤖 **Automated Posting**: Schedule and automate posts across multiple platforms
- 🧠 **AI Content Generation**: Generate engaging content using Google Gemini API
- 🎨 **Modern Dashboard**: Beautiful SaaS-style dashboard built with Next.js and Tailwind CSS
- 🔒 **Secure Credentials**: Encrypted storage of platform credentials
- 📊 **Activity Logging**: Track all bot activities and errors
- ⏰ **Flexible Scheduling**: Configure posting frequency for each platform
- 🌐 **Platform Support**: X (Twitter), Reddit, and Quora

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Automation**: Playwright for browser automation
- **AI**: Google Gemini API for content generation
- **Scheduling**: Supabase Edge Functions with CRON

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Google Gemini API key
- Platform accounts (X, Reddit, Quora)

### Installation

1. **Clone the repository and install dependencies**:

```bash
npm install
```

2. **Install Playwright browsers**:

```bash
npx playwright install
```

3. **Set up environment variables**:

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `GEMINI_API_KEY`: Your Google Gemini API key
- `ENCRYPTION_KEY`: A random 32-character string for encrypting credentials
- Platform credentials (X, Reddit, Quora)

4. **Set up Supabase database**:

Run the SQL script in `supabase/schema.sql` in your Supabase SQL editor to create the necessary tables.

5. **Encrypt and store platform credentials**:

Create a script to encrypt and store your credentials in Supabase, or use the Supabase dashboard to manually insert them into the `credentials` table.

### Running the Application

1. **Start the development server**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Test a bot manually**:

```bash
node bot/run.js x "Write a tweet about productivity"
```

Platforms: `x`, `reddit`, or `quora`

### Deploying Supabase Edge Function

1. **Install Supabase CLI**:

```bash
npm install -g supabase
```

2. **Login to Supabase**:

```bash
supabase login
```

3. **Deploy the edge function**:

```bash
supabase functions deploy poster
```

4. **Set up CRON trigger**:

In your Supabase dashboard, go to Database → Extensions and enable `pg_cron`. Then create a CRON job to call your edge function every N minutes:

```sql
SELECT cron.schedule(
  'run-automarketer-bots',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/poster',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  ) AS request_id;
  $$
);
```

## Usage

### Dashboard

Navigate to the dashboard to see:
- Status of all automation tasks
- Last run and next scheduled run times
- Recent activity logs
- Error tracking

### Platform Configuration

1. Go to the specific platform page (X, Reddit, or Quora)
2. Toggle automation on/off
3. Set posting frequency
4. Configure the prompt template for AI content generation
5. Add platform-specific settings (subreddit, question URL, etc.)
6. Test the configuration with "Test Post Now"
7. Save settings

### Content Generation

The AI uses your prompt template to generate platform-optimized content:
- **X (Twitter)**: Short, engaging tweets under 280 characters
- **Reddit**: Detailed, conversational posts with context
- **Quora**: Comprehensive, authoritative answers

## Project Structure

```
automarketer/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   ├── automation/           # Platform automation pages
│   └── dashboard/            # Dashboard page
├── bot/                      # Playwright automation scripts
│   ├── x.js                  # X (Twitter) bot
│   ├── reddit.js             # Reddit bot
│   ├── quora.js              # Quora bot
│   └── run.js                # Bot runner
├── components/               # React components
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utility functions
│   ├── supabaseClient.js     # Supabase helpers
│   ├── encryption.js         # Encryption utilities
│   └── gemini.js             # Gemini AI integration
└── supabase/                 # Supabase configuration
    ├── functions/            # Edge functions
    └── schema.sql            # Database schema
```

## Security Notes

- Always use environment variables for sensitive data
- Credentials are encrypted before storing in the database
- Use Supabase Row Level Security (RLS) in production
- Keep your `ENCRYPTION_KEY` secure and never commit it to git
- Consider using 2FA and app-specific passwords for platform accounts

## Troubleshooting

### Bot Login Issues

- Platform websites frequently change their DOM structure. You may need to update selectors in bot files.
- Use headless: false in Playwright launch options for debugging
- Check screenshot files (*-bot-error.png) for visual debugging

### Content Generation Issues

- Verify your Gemini API key is valid
- Check API quotas and rate limits
- Adjust prompt templates for better results

### Supabase Connection Issues

- Verify your Supabase credentials
- Check that tables are created correctly
- Ensure RLS policies allow your operations

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Disclaimer

This tool is for educational purposes. Always comply with platform Terms of Service and rate limits. Excessive automation may result in account suspension.
