-- Create automation_settings table (for web UI)
CREATE TABLE IF NOT EXISTS automation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  prompt_template TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'hourly',
  frequency_minutes INTEGER,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  use_viral_prompts BOOLEAN DEFAULT true,
  additional_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create automation_logs table
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  post_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_automation_settings_platform ON automation_settings(platform);
CREATE INDEX IF NOT EXISTS idx_automation_settings_is_enabled ON automation_settings(is_enabled);
CREATE INDEX IF NOT EXISTS idx_automation_logs_platform ON automation_logs(platform);
CREATE INDEX IF NOT EXISTS idx_automation_logs_created_at ON automation_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE automation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now)
CREATE POLICY "Allow all operations on automation_settings" ON automation_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations on automation_logs" ON automation_logs FOR ALL USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_automation_settings_updated_at BEFORE UPDATE ON automation_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
