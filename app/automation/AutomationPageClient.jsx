'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AutomationPageClient({ 
  platform, 
  title, 
  description, 
  defaultPrompt,
  showSubreddit = false,
  showTitle = false,
  showQuestionUrl = false
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [settings, setSettings] = useState({
    is_enabled: false,
    frequency_minutes: 1,
    prompt_template: defaultPrompt,
    subreddit: 'test',
    post_title: 'Automated Post',
    question_url: ''
  });

  useEffect(() => {
    fetchSettings();
  }, [platform]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/get-settings?platform=${platform}`);
      if (response.ok) {
        const data = await response.json();
        if (data.task) {
          setSettings({
            is_enabled: data.task.is_enabled,
            frequency_minutes: data.task.frequency_minutes,
            prompt_template: data.task.prompt_template,
            subreddit: data.task.additional_settings?.subreddit || 'test',
            post_title: data.task.additional_settings?.title || 'Automated Post',
            question_url: data.task.additional_settings?.questionUrl || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const additional_settings = {};
      if (showSubreddit) {
        additional_settings.subreddit = settings.subreddit;
      }
      if (showTitle) {
        additional_settings.title = settings.post_title;
      }
      if (showQuestionUrl) {
        additional_settings.questionUrl = settings.question_url;
      }

      const response = await fetch('/api/save-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          is_enabled: settings.is_enabled,
          frequency_minutes: parseInt(settings.frequency_minutes),
          prompt_template: settings.prompt_template,
          additional_settings
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setMessage(null);
    
    try {
      const additional_settings = {};
      if (showSubreddit) additional_settings.subreddit = settings.subreddit;
      if (showTitle) additional_settings.title = settings.post_title;
      if (showQuestionUrl) additional_settings.questionUrl = settings.question_url;

      const response = await fetch('/api/test-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          prompt_template: settings.prompt_template,
          additional_settings
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Test post successful!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Test post failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to run test post' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Automation Settings</CardTitle>
          <CardDescription>Configure when and how often to post</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Automation</Label>
              <p className="text-sm text-gray-500">
                Turn on automated posting for this platform {settings.is_enabled.toString()}
              </p>
            </div>
            <Switch
              checked={settings.is_enabled}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, is_enabled: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Posting Frequency</Label>
            <Select
              id="frequency"
              value={settings.frequency_minutes}
              onChange={(e) => 
                setSettings({ ...settings, frequency_minutes: e.target.value })
              }
            >
              <option value="1">Every minute</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every hour</option>
              <option value="1">Every 2 hours</option>
              <option value="180">Every 3 hours</option>
              <option value="240">Every 4 hours</option>
              <option value="360">Every 6 hours</option>
              <option value="720">Every 12 hours</option>
              <option value="1440">Daily</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Content Prompt Template</Label>
            <Textarea
              id="prompt"
              rows={4}
              placeholder={defaultPrompt}
              value={settings.prompt_template}
              onChange={(e) => 
                setSettings({ ...settings, prompt_template: e.target.value })
              }
            />
            <p className="text-xs text-gray-500">
              This prompt will be used to generate content with AI. Be specific and include guidelines.
            </p>
          </div>

          {showSubreddit && (
            <div className="space-y-2">
              <Label htmlFor="subreddit">Target Subreddit</Label>
              <Input
                id="subreddit"
                placeholder="test"
                value={settings.subreddit}
                onChange={(e) => 
                  setSettings({ ...settings, subreddit: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                Enter the subreddit name without r/ prefix
              </p>
            </div>
          )}

          {showTitle && (
            <div className="space-y-2">
              <Label htmlFor="postTitle">Post Title Template</Label>
              <Input
                id="postTitle"
                placeholder="Automated Post"
                value={settings.post_title}
                onChange={(e) => 
                  setSettings({ ...settings, post_title: e.target.value })
                }
              />
            </div>
          )}

          {showQuestionUrl && (
            <div className="space-y-2">
              <Label htmlFor="questionUrl">Quora Question URL</Label>
              <Input
                id="questionUrl"
                placeholder="https://www.quora.com/..."
                value={settings.question_url}
                onChange={(e) => 
                  setSettings({ ...settings, question_url: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                Full URL to the Quora question you want to answer
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="flex-1"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
        
        <Button 
          onClick={handleTest}
          disabled={testing}
          variant="outline"
          className="flex-1"
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Post Now'
          )}
        </Button>
      </div>
    </div>
  );
}
