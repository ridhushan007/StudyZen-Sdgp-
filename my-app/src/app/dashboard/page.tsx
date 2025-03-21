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
