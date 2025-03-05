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
    return (
        <div className="flex flex-col h-screen">
          {/* Header + Sidebar */}
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-slate-700 text-white p-4 flex flex-col">
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center mb-2">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white rounded-md"></div>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <div className="w-16 h-3 bg-yellow-400 rotate-45 transform translate-x-1 translate-y-1"></div>
                    </div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold">StudyZen</h1>
              </div>
              <nav className="flex-1 space-y-2">
            <div className="flex items-center p-3 text-gray-200 rounded hover:bg-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
