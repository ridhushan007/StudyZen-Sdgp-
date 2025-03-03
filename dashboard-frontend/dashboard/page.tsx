"use client";

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, BookOpen, Flame, Trophy } from 'lucide-react';
import axios from 'axios';




interface DashboardStats {
  studyHours: {
    total: number;
    change: string;
  };
  quizzes: {
    completed: number;
    change: string;
  };
  streak: {
    days: number;
    message: string;
  };
  achievements: {
    total: number;
    new: string;
  };
}

interface Activity {
  type: string;
  title: string;
  timestamp: string;
  timeAgo: string;
}

interface ProgressData {
  labels: string[];
  data: number[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes, progressRes] = await Promise.all([
          axios.get('http://localhost:3001/api/dashboard/stats'),
          axios.get('http://localhost:3001/api/dashboard/activities'),
          axios.get('http://localhost:3001/api/dashboard/progress')
        ]);

        setStats(statsRes.data);
        setActivities(activitiesRes.data);
        setProgress(progressRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!stats) return <div>Loading...</div>;

  const chartData = progress?.labels.map((label, index) => ({
    name: label,
    hours: progress.data[index],
  }));

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Welcome back, Student!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Study Hours</h3>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{stats.studyHours.total}</div>
              <p className="text-sm text-muted-foreground">{stats.studyHours.change}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Quizzes Completed</h3>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{stats.quizzes.completed}</div>
              <p className="text-sm text-muted-foreground">{stats.quizzes.change}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Current Streak</h3>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{stats.streak.days} days</div>
              <p className="text-sm text-muted-foreground">{stats.streak.message}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium">Achievements</h3>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{stats.achievements.total}</div>
              <p className="text-sm text-muted-foreground">{stats.achievements.new}</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-2 p-6">
            <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
            <div className="h-[300px]">
              {chartData && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}