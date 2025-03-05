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
                <div className="flex items-center p-3 text-gray-200 rounded hover:bg-slate-600">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                 </svg>
                </div>
                <div className="flex items-center p-3 text-gray-200 rounded hover:bg-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 bg-gray-50">
                  <header className="bg-white p-4 border-b flex justify-between items-center">
                   <h1 className="text-2xl font-bold">Track Your Daily Progress</h1>
                   <button className="p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                   </button>
                  </header>
                  <div className="p-6 grid grid-cols-2 gap-6">
                    <card>
                        <CardHeader>
                            <CardTitle>Log Your Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                           <div>
                            <label className="block text-sm font-medium mb-1">Activity Type</label>
                            <select 
                             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                             value={activityType}
                             onChange={(e) => setActivityType(e.target.value)}
                            >
                             <option value="">Select activity type</option>
                             <option value="lectures">Lectures</option>
                             <option value="assignments">Assignments</option>
                             <option value="readings">Readings</option>
                             <option value="projects">Projects</option>
                            </select>
                           </div>
                           <div>
                            <label className="block text-sm font-medium mb-1">Hours Spent</label>
                            <input 
                             type="text" 
                             placeholder="Enter hours" 
                             className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                             value={hours}
                             onChange={(e) => setHours(e.target.value)}
                             />
                           </div>
                           <div>
                            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                            <textarea 
                             placeholder="Add additional details" 
                             className="w-full p-2 border rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                             value={notes}
                             onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                           </div>
                           <button className="w-full bg-blue-500 text-white py-3 rounded font-medium hover:bg-blue-600 transition">
                             Save Progress
                           </button>
                          </div> 
                        </CardContent>
                    </card>
                    <Card className="bg-white shadow-md">
                      <CardHeader>
                       <CardTitle className="text-blue-900">Your Weekly Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                       <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                         <BarChart
                          data={weeklyData}
                          margin={{
                           top: 20,
                           right: 30,
                           left: 0,
                            bottom: 10,
                          }}
                         >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" className="text-blue-400" />
                          <YAxis className="text-blue-400" />
                          <Tooltip />
                          <Bar dataKey="Lectures" fill="#3b82f6" />
                          <Bar dataKey="Assignments" fill="#22c55e" />
                         </BarChart>
                        </ResponsiveContainer>
                       </div>
              
                       <div className="flex gap-4 justify-center mt-4 text-blue-600">
                         <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                          <span>Lectures</span>
                         </div>
                         <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 mr-2"></div>
                          <span>Assignments</span>
                         </div>
                       </div>
              
                       <div className="mt-6">
                         <button className="w-full border border-blue-400 text-blue-600 py-2 rounded font-medium hover:bg-blue-50 transition">
                           View Detailed Stats
                         </button>
                       </div>
                      </CardContent>
                    </Card>

            


