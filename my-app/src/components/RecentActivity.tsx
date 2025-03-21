import { useState, useEffect } from "react";

export interface Activity {
  _id: string;
  type: "journal" | "quiz" | "confession";
  title: string;
  description?: string;
  timestamp: string;
  userId: string;
}
export default function RecentActivity() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchActivities = async () => {
        try {
          const response = await fetch("http://localhost:3001/api/recent-activity");
          if (!response.ok) throw new Error("Failed to fetch activities");
          const data = await response.json();
          setActivities(data);
        } catch (error) {
          console.error("Error fetching activities:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchActivities();
      const interval = setInterval(fetchActivities, 5 * 60 * 1000); // Refresh every 5 minutes
      return () => clearInterval(interval);
    }, []);
  
    if (loading) return <p>Loading...</p>;