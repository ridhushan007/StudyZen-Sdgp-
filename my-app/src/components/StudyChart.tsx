import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StudyChart = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<{ date: string; totalStudyTime: number }[]>([]);