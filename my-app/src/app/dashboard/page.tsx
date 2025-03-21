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
