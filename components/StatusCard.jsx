'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function StatusCard({ task, logs = [] }) {
  const getStatusBadge = () => {
    if (!task.is_enabled) {
      return <Badge variant="secondary">Disabled</Badge>;
    }
    
    const lastLog = logs[0];
    if (lastLog && lastLog.level === 'error') {
      return <Badge variant="destructive">Error</Badge>;
    }
    
    return <Badge variant="success" className="bg-green-600">Active</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getNextRun = () => {
    if (!task.is_enabled) return 'Disabled';
    if (!task.next_run) {
      return 'Pending';
    }
    const nextRun = new Date(task.next_run);
    const now = new Date();
    const diff = nextRun - now;
    
    if (diff < 0) return 'Overdue';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `In ${hours} hour${hours > 1 ? 's' : ''}`;
    return `In ${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">
          {task.platform}
        </CardTitle>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Run:</span>
            <span className="font-medium">{formatDate(task.last_run)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Next Run:</span>
            <span className="font-medium">{getNextRun()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Frequency:</span>
            <span className="font-medium">{task.frequency_minutes} min</span>
          </div>
          {logs.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-1">Latest Log:</p>
              <p className="text-xs truncate">{logs[0].message}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
