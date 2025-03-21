"use client";
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, BookOpen, Flame} from 'lucide-react';
import axios from 'axios';
import StudyTimer from '@/components/StudyTimer';

import StudyChart from "@/components/StudyChart";
import  RecentActivity  from '@/components/RecentActivity';
import CurrentStreak from '@/components/CurrentStreak';

const TEMP_USER_ID = "user123";
const userId = "user123";

interface DashboardStats {
  streak: {
    days: number;
    message: string;
  };
}

interface Activity {
  _id: string;
  type: string;
  title: string;
}

interface ProgressData {
  labels: string[];
  data: number[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activities, setActivities] = useState([]);
  //const [quizCount, setQuizCount] = useState<number>(0);
  const [quizCount, setQuizCount] = useState(null);
  const [error, setError] = useState<string | null>(null);

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

  

  
  useEffect(() => {
    fetchRecentActivities();
  }, []);

  useEffect(() => {
    fetch('/all')  // The proxy will redirect this to http://localhost:3001/api/quizzes/week-count
      .then(response => response.json())
      .then(data => {
        setQuizCount(data.count);  // Update state with the quiz count
      })
      .catch(error => {
        setError('Error fetching data');
        console.error('Error fetching data:', error);  // Log any errors
      });
  }, []);  // Empty

  const fetchRecentActivities = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/recent-activities');
        const data = await response.json();
        setRecentActivities(data);
    } catch (error) {
        console.error('Error fetching recent activities:', error);
    }
  };

  if (!stats) return <div className="min-h-screen bg-blue-50 font-mono flex items-center justify-center text-blue-800">Loading...</div>;

  const chartData = progress?.labels.map((label, index) => ({
    name: label,
    hours: progress.data[index],
  }));

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-blue-50 font-mono">
      <div className="max-w-4xl mx-auto relative z-10 p-8 space-y-8">
        <h1 className="text-4xl font-bold text-blue-900">Welcome to StudyZen!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Card className="p-6 border-blue-200">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">Study Timer</h3>
            </div>
            <br />
            <div className="flex justify-center">
      <StudyTimer userId={userId} />
    </div>
            <br />
      

            
              
          </Card>

          <StudyChart userId={userId} />

          <Card className="p-6 border-blue-200">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">Quizzes Completed</h3>
            </div>
            <div>
  {error && <p>{error}</p>}  {/* Display error message if there's an error */}
  {quizCount !== null ? (
    <p>Quizzes This Week: {quizCount}</p>  // Display the count if available
  ) : (
    <p>Loading...</p>  // Show loading text until the data is fetched
  )}
</div>
          </Card>

          </Card>
          
          <Card className="p-6 border-blue-200">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">Current Streak</h3>
            </div>
              <CurrentStreak userId={TEMP_USER_ID} />
          </Card>
        </div>
