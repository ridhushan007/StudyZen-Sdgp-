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

  return (
    <Card>
      
      <CardContent>
        <div className="flex space-x-4 text-2xl font-bold text-blue-900 mt-2">{streak} days</div>
        <p className="text-xs font-medium text-blue-500">
          Keep the streak going!
        </p>
      </CardContent>
    </Card>
  );
}