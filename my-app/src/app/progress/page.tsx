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
            </div>
            <div className="flex items-center p-3 bg-slate-100 text-slate-800 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center p-3 text-gray-200 rounded hover:bg-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            <div className="flex items-center p-3 text-gray-200 rounded hover:bg-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-center p-3 text-gray-200 rounded hover:bg-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            

