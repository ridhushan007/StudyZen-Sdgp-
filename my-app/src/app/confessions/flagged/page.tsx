'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { confessionApi } from '../../api/confessions';
import { toast } from 'react-hot-toast';
import { Shield, XCircle, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface FlaggedConfession {
  _id: string;
  text: string;
  userId: string;
  reason: string;
  categories: Record<string, boolean>;
  reviewed: boolean;
  timestamp: string;
}

export default function FlaggedConfessionsPage() {
  const [flaggedConfessions, setFlaggedConfessions] = useState<FlaggedConfession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Set client state
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Load flagged confessions
  useEffect(() => {
    if (!isClient) return;
    
    const loadFlaggedConfessions = async () => {
      try {
        setIsLoading(true);
        const data = await confessionApi.getFlaggedConfessions();
        console.log("Flagged confessions data:", data);
        setFlaggedConfessions(data || []);
      } catch (error) {
        toast.error('Failed to load flagged confessions');
        console.error('Error loading flagged confessions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFlaggedConfessions();
  }, [isClient, refreshTrigger]);
  
  // Formats date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0] + ' ' + 
           date.toISOString().split('T')[1].substring(0, 8);
  };
  
  // Renders categories as badges
  const renderCategories = (categories: Record<string, boolean>) => {
    return Object.entries(categories)
      .filter(([_, value]) => value === true)
      .map(([key]) => (
        <span
          key={key}
          className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-1 mb-1"
        >
          {key.replace(/_/g, ' ')}
        </span>
      ));
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  if (!isClient || isLoading) {
    return (
      <div className="bg-blue-50 min-h-screen font-mono">
        <div className="max-w-4xl mx-auto relative z-10 py-8 px-4">
          <div className="text-blue-900">Loading flagged content...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-blue-50 min-h-screen font-mono">
      <div className="max-w-4xl mx-auto relative z-10 py-8 px-4">
        <Card className="mb-8 border-blue-200 shadow-md">
          <CardHeader className="border-b border-blue-100 bg-red-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-red-900 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Flagged Confessions Review
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-6 text-gray-600">
              This page shows confessions that were flagged by the AI moderation system. 
              Review each item and take appropriate action.
            </p>
            
            {flaggedConfessions.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                <p className="text-gray-700">No flagged confessions to review at this time.</p>
                <p className="text-gray-500 text-sm mt-2">If you expected to see flagged items, try submitting content that might trigger moderation filters.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {flaggedConfessions.map((item) => (
                  <Card key={item._id} className="border-red-200 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-sm text-gray-500">User ID: {item.userId}</div>
                          <div className="text-sm text-gray-500">Time: {formatDate(item.timestamp)}</div>
                        </div>
                        <div className="bg-red-100 px-3 py-1 rounded text-red-700 text-sm">
                          {item.reviewed ? 'Reviewed' : 'Pending Review'}
                        </div>
                      </div>
                      
                      <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="font-mono text-gray-800">{item.text}</p>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-sm font-semibold text-gray-700">Reason:</div>
                        <div className="text-sm text-gray-600">{item.reason}</div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-sm font-semibold text-gray-700">Flagged Categories:</div>
                        <div className="mt-1">
                          {renderCategories(item.categories)}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => {
                            // Add approve functionality here
                            toast.success('Confession approved');
                            handleRefresh();
                          }}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            // Add reject functionality here
                            toast.success('Confession rejected');
                            handleRefresh();
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}