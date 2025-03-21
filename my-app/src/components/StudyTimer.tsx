import { useState, useEffect } from "react";

const StudyTimer = ({ userId }: { userId: string }) => {
  const [time, setTime] = useState<number>(0); // Time in seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastStudyTime, setLastStudyTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };