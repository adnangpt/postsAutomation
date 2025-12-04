# 🤖 Automation Setup Guide

## ❌ Problem: Automation Wasn't Running

**You were right!** The system was saving automation settings but **nothing was actually running them on schedule**. The "Test Post Now" button worked, but automatic posting never happened.

## ✅ Solution: Built a Complete Automation Scheduler

I've created a full automation system that:
- ✅ Runs in the background continuously
- ✅ Checks settings every 30 seconds
- ✅ Posts automatically based on your frequency
- ✅ Uses viral prompts for engaging content
- ✅ Logs everything to Supabase

---

## 🚀 HOW TO USE AUTOMATION

### **Step 1: Complete OAuth Setup** (if not done)

```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Terminal 3: OAuth setup
node scripts/setup-oauth2-flow.js
node scripts/save-oauth2-credentials.js
```

---

### **Step 2: Configure Automation in Dashboard**

1. Go to: `http://localhost:3000/automation/x`
2. **Enable Automation** (toggle ON)
3. **Set Frequency**: 
   - Every Minute (for testing)
   - Every 5 Minutes
   - Every 15 Minutes
   - Hourly (recommended for real use)
   - Daily, etc.
4. Click **"Save Settings"**

---

### **Step 3: Start the Automation Scheduler**

Open a **NEW terminal** and run:

```bash
npm run automation
```

**This terminal must stay open!** The scheduler runs continuously.

---

## 📊 What You'll See

### When Scheduler Starts:
```
🤖 AutoMarketer Automation Scheduler Started
Checking automation settings every 30 seconds...

[10:30:00 AM] Checking automation...
```

### When Automation Runs:
```
🔥 X: Using viral prompt - Tech Meme - Relatable
⏰ Running automation (every 1 min)

=== Running X Bot ===
Generating content with Gemini AI...
Generated content: POV: You fixed a bug by adding a console.log() 
and forgot to remove it. Now it's in production. 😭💻

Starting X (Twitter) API bot...
Using OAuth 2.0 authentication...
Posting tweet...
✅ X: Post successful!
🔗 URL: https://twitter.com/i/web/status/1234567890
```

---

## 🎯 Frequency Options Explained

| Setting | Posts Every | Good For |
|---------|-------------|----------|
| Every Minute | 1 minute | **Testing only** |
| Every 5 Minutes | 5 minutes | Testing |
| Every 15 Minutes | 15 minutes | Testing |
| Every 30 Minutes | 30 minutes | Aggressive growth |
| Hourly | 1 hour | Active engagement |
| Every 2 Hours | 2 hours | Moderate posting |
| Every 4 Hours | 4 hours | **Recommended** |
| Every 6 Hours | 6 hours | Casual posting |
| Daily | 24 hours | Minimal presence |

**Recommendation**: Start with **Every 4 Hours** (6 posts/day) for natural growth.

---

## 🔥 Viral Content System

### What Happens Automatically:

The scheduler uses your viral prompt library:

**70% Memes & Humor** → Maximum engagement
- Tech struggles, coding memes, developer life
- POV format, before/after, expectation vs reality

**20% Trending Topics** → Algorithm boost
- AI hot takes, framework wars, tech news reactions

**5% Motivational** → Build community
- Learning journey, embracing failure, real talk

**5% Quick Tips** → Provide value
- Pro tips, tool recommendations, shortcuts

### Sample Auto-Generated Content:

```
"Me: *writes perfect code*
Computer: 🔥💥 (100 errors)
Me: *adds a semicolon*
Computer: ✨ Perfect! 🎉"

"AI isn't taking programmer jobs. It's just giving us 
fancier ways to Google things. 🤖😅"

"Pro tip: Learn to read error messages. 
Google can't save you if you don't know what's broken. 💀"
```

---

## 🎮 Full Setup Commands

### Terminal Layout:

**Terminal 1 - Next.js**
```bash
npm run dev
```

**Terminal 2 - ngrok**
```bash
ngrok http 3000
```

**Terminal 3 - Automation Scheduler**
```bash
npm run automation
```

All three must run simultaneously!

---

## 🛠️ Testing Your Setup

### Test 1: Manual Post (Before Automation)
```bash
node scripts/post-viral-tweet.js
```
Expected: Tweet posts immediately

### Test 2: Start Automation
```bash
npm run automation
```
Expected: Scheduler starts, shows checking messages

### Test 3: Enable in Dashboard
1. Go to automation page
2. Enable automation
3. Set "Every Minute"
4. Save settings
5. Watch Terminal 3

Expected: Within 1 minute, bot posts automatically

---

## 📱 Dashboard Features

### Automation Page Shows:
- ✅ Current status (Enabled/Disabled)
- ⏰ Posting frequency
- 📝 Prompt template (or "Using Viral Prompts")
- 🧪 Test button (manual post)
- 📊 Recent activity logs

### Status Card Shows:
- Last post time
- Next scheduled post
- Total posts today
- Success/error count

---

## 🐛 Troubleshooting

### "Automation not posting"
**Fix**: Make sure `npm run automation` is running in Terminal 3

### "401 Unauthorized"
**Fix**: Complete OAuth setup first
```bash
node scripts/setup-oauth2-flow.js
node scripts/save-oauth2-credentials.js
```

### "Credentials not found"
**Fix**: Run OAuth setup and save credentials

### Posts every time I refresh
**Fix**: That's the test button. Automation runs on its own schedule.

### Scheduler stopped
**Fix**: The terminal closed. Restart `npm run automation`

---

## 🚀 Production Deployment

For 24/7 automation, you need to:

1. **Deploy to a server** (not your laptop)
   - Heroku, Railway, DigitalOcean, AWS, etc.

2. **Run scheduler as a service**
   ```bash
   # Using PM2
   pm2 start scripts/start-automation.js --name automarketer
   pm2 save
   pm2 startup
   ```

3. **Use production ngrok** (paid plan with static domain)
   - Or deploy Next.js to Vercel/Netlify
   - Update callback URL in X Developer Portal

---

## 📊 Monitoring & Logs

### View Logs in Dashboard:
- Go to automation page
- Scroll to "Recent Activity"
- See all posts, errors, timestamps

### Check Scheduler Output:
- Terminal 3 shows live activity
- Each check, each post, each error

### Supabase Logs:
```sql
SELECT * FROM automation_logs ORDER BY created_at DESC;
```

---

## 🎯 Quick Reference

### Start Everything:
```bash
# Terminal 1
npm run dev

# Terminal 2
ngrok http 3000

# Terminal 3
npm run automation
```

### Stop Automation:
Press `Ctrl+C` in Terminal 3

### Post One Tweet Manually:
```bash
node scripts/post-viral-tweet.js
```

### Preview Content:
```bash
node scripts/test-viral-content.js
```

---

## ✅ Success Checklist

- [ ] OAuth 2.0 setup complete
- [ ] Credentials saved to Supabase
- [ ] Manual post test works
- [ ] Next.js running (`npm run dev`)
- [ ] ngrok running (`ngrok http 3000`)
- [ ] Automation enabled in dashboard
- [ ] Scheduler running (`npm run automation`)
- [ ] First auto-post successful

---

## 🎉 You're All Set!

Once all three terminals are running and automation is enabled, your bot will:
- ✅ Post viral content automatically
- ✅ Follow your frequency settings
- ✅ Mix different content types
- ✅ Log everything
- ✅ Keep running 24/7 (as long as terminals stay open)

**Next**: Deploy to a server for true 24/7 automation!
