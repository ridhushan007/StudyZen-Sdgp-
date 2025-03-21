"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent} from "@/components/ui/card";
import axios from 'axios';

interface CurrentStreakProps {
  userId: string;
}

export default function CurrentStreak({ userId }: CurrentStreakProps) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/streaks/${userId}`);
        setStreak(response.data.streak);
      } catch (error) {
        console.error('Error fetching streak:', error);
      }
    };

    fetchStreak();
  }, [userId]);
