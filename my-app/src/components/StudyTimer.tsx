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

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = async () => {
    setIsRunning(false);
    setLastStudyTime(time);
    // Save study time to the backend
    try {
        const response = await fetch("/api/study-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, studyTime: time }),
        });
  
        if (response.ok) {
          console.log("Study time saved successfully");
        } else {
          console.error("Failed to save study time");
        }
      } catch (error) {
        console.error("Error:", error);
      }
  
      setTime(0); // Reset timer after saving
    };
    return (
        <div className="flex flex-col items-center space-y-2">
          <p className="text-xl font-semibold mb-4 text-blue-900">{formatTime(time)}</p>
      
          <div className="flex flex-col items-center space-y-2">
      <button 
        onClick={handleStart} 
        disabled={isRunning} 
        className="bg-blue-500 text-white w-24 h-10 rounded"
      >
        Start Learning
      </button>
      <button 
        onClick={handleStop} 
        disabled={!isRunning} 
        className="bg-red-500 text-white w-24 h-10 rounded"
      >
        Stop Learning
      </button>
    </div>