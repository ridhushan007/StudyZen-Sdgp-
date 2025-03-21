import { useState, useEffect } from "react";

export interface Activity {
  _id: string;
  type: "journal" | "quiz" | "confession";
  title: string;
  description?: string;
  timestamp: string;
  userId: string;
}