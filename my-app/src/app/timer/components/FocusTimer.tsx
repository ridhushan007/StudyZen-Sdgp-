'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw } from 'lucide-react';

const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('pomodoro');

  const timerConfigs = {
    pomodoro: { duration: 25 * 60, label: 'Focus Time', color: 'bg-primary' },
    shortBreak: { duration: 5 * 60, label: 'Short Break', color: 'bg-green-500' },
    longBreak: { duration: 15 * 60, label: 'Long Break', color: 'bg-blue-500' },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsRunning(false);
    setTimeLeft(timerConfigs[value as keyof typeof timerConfigs].duration);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerConfigs[activeTab as keyof typeof timerConfigs].duration);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / timerConfigs[activeTab as keyof typeof timerConfigs].duration) * 100;

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-auto">
      <motion.h2 
        className="text-3xl font-bold text-primary mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Focus Timer
      </motion.h2>
      
      <Tabs defaultValue="pomodoro" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="pomodoro" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Pomodoro
          </TabsTrigger>
          <TabsTrigger value="shortBreak" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Short Break
          </TabsTrigger>
          <TabsTrigger value="longBreak" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Long Break
          </TabsTrigger>
        </TabsList>

        <div className="relative">
          <div className="w-64 h-64 mx-auto relative">
            {/* Circular Progress Background */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-100" />
            
            {/* Animated Progress Circle */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(${timerConfigs[activeTab as keyof typeof timerConfigs].color} ${progress}%, transparent 0)`,
                borderRadius: '100%',
              }}
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            {/* Timer Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={timeLeft}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-5xl font-bold"
                >
                  {formatTime(timeLeft)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTimer}
              className={`${
                isRunning ? 'bg-orange-500' : 'bg-primary'
              } text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {isRunning ? (
                <>
                  <Pause size={20} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Start</span>
                </>
              )}
            </motion.button>

            
