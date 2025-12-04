'use client';

import { useEffect, useState } from 'react';
import StatusCard from '@/components/StatusCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export default function DashboardContent() {
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 90000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, logsRes] = await Promise.all([
        fetch('/api/get-status'),
        fetch('/api/get-logs')
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskLogs = (taskId) => {
    return logs.filter(log => log.task_id === taskId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {tasks.map((task) => (
          <StatusCard key={task.id} task={task} logs={getTaskLogs(task.id)} />
        ))}
        
        {tasks.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                No automation tasks configured yet. Start by setting up your platforms.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={log.level === 'error' ? 'destructive' : 'secondary'}>
                      {log.tasks?.platform || 'Unknown'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{log.message}</p>
                </div>
              </div>
            ))}
            
            {logs.length === 0 && (
              <p className="text-center text-gray-500 py-4">No activity logs yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
