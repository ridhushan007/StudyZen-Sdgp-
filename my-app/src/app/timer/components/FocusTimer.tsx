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
