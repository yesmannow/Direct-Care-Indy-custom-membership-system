'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Pill, Clock, CheckCircle2 } from 'lucide-react';

interface TriageItem {
  id: number;
  type: 'text' | 'refill';
  patientName: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

// Mock triage queue data - in production this would come from the database
const mockTriageItems: TriageItem[] = [
  {
    id: 1,
    type: 'text',
    patientName: 'John Smith',
    message: 'Experiencing chest pain, need advice',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    priority: 'high',
    status: 'pending',
  },
  {
    id: 2,
    type: 'refill',
    patientName: 'Jane Doe',
    message: 'Requesting refill for Lisinopril',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 3,
    type: 'text',
    patientName: 'Bob Johnson',
    message: 'Follow-up question about lab results',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    priority: 'low',
    status: 'in_progress',
  },
  {
    id: 4,
    type: 'refill',
    patientName: 'Alice Williams',
    message: 'Need refill for Metformin',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    priority: 'medium',
    status: 'pending',
  },
];

export function TriageQueue() {
  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const pendingItems = mockTriageItems.filter(item => item.status !== 'completed');
  const completedItems = mockTriageItems.filter(item => item.status === 'completed');

  return (
    <Card className="border-2 border-[#2C3E50] bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-[#2C3E50]">Triage Queue</CardTitle>
            <CardDescription>
              Recent patient texts and refill requests requiring provider sign-off
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {pendingItems.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No pending items in the triage queue.</p>
            </div>
          ) : (
            pendingItems.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    {item.type === 'text' ? (
                      <MessageSquare className="h-5 w-5 text-[#8A9A8A] mt-1" />
                    ) : (
                      <Pill className="h-5 w-5 text-[#8A9A8A] mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#2C3E50]">{item.patientName}</h3>
                        <Badge variant="outline" className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge variant="outline">
                          {item.type === 'text' ? 'Text Message' : 'Refill Request'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(item.timestamp)}
                        </div>
                        {item.status === 'in_progress' && (
                          <Badge variant="secondary" className="text-xs">In Progress</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In production, this would mark as in progress
                        console.log('Mark as in progress:', item.id);
                      }}
                    >
                      Start
                    </Button>
                    <Button
                      className="bg-[#8A9A8A] hover:bg-[#7A8A7A] text-white"
                      size="sm"
                      onClick={() => {
                        // In production, this would complete the item
                        console.log('Complete:', item.id);
                      }}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {completedItems.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Recently Completed</h3>
            <div className="space-y-2">
              {completedItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 border border-gray-200 rounded-lg bg-gray-50 opacity-75"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.type === 'text' ? (
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Pill className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm font-medium text-gray-600">{item.patientName}</span>
                      <span className="text-xs text-gray-500">{item.message}</span>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

