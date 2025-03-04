import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StudyZenDashboard() {
    const [activityType, setActivityType] = useState('');
    const [hours, setHours] = useState('');
    const [notes, setNotes] = useState('');
  
    const weeklyData = [
      {
        name: 'Mon',
        Lectures: 3,
        Assignments: 2,
      },
      {
        name: 'Tue',
        Lectures: 4,
        Assignments: 1,
      },
      {
        name: 'Wed',
        Lectures: 2,
        Assignments: 3,
      },
      {
        name: 'Thu',
        Lectures: 3,
        Assignments: 2,
      },
      {
        name: 'Fri',
        Lectures: 4,
        Assignments: 1,
      },
      {
        name: 'Sat',
        Lectures: 1,
        Assignments: 4,
      },
      {
        name: 'Sun',
        Lectures: 0,
        Assignments: 2,
      },
    ];