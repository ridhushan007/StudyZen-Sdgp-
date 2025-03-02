// src/app/api/confessions.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ConfessionData {
  text: string;
  isAnonymous: boolean;
  author: string | null;
}

interface ReplyData {
  text: string;
  isAnonymous: boolean;
  author: string | null;
}

// A safer way to get userId that works with SSR
const getUserId = (): string => {
  if (typeof window !== 'undefined') {
    const storedId = localStorage.getItem('userId');
    if (storedId) return storedId;
    
    // Generate a more stable ID
    const newId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    localStorage.setItem('userId', newId);
    return newId;
  }
  
  // Return a placeholder during SSR
  return 'ssr-placeholder-id';
};

export const confessionApi = {
  getAllConfessions: async (): Promise<any[]> => {
    const response = await axios.get(`${API_URL}/confessions`);
    return response.data;
  },
  
  createConfession: async (confessionData: ConfessionData): Promise<any> => {
    const response = await axios.post(`${API_URL}/confessions`, {
      ...confessionData,
      userId: getUserId()
    });
    return response.data;
  },
  
  likeConfession: async (confessionId: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/confessions/${confessionId}/like`, {
      userId: getUserId()
    });
    return response.data;
  },
  
  dislikeConfession: async (confessionId: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/confessions/${confessionId}/dislike`, {
      userId: getUserId()
    });
    return response.data;
  },
  
  addReply: async (confessionId: string, replyData: ReplyData): Promise<any> => {
    const response = await axios.post(`${API_URL}/confessions/${confessionId}/replies`, {
      ...replyData,
      userId: getUserId()
    });
    return response.data;
  },
  
  getReplies: async (confessionId: string): Promise<any[]> => {
    const response = await axios.get(`${API_URL}/confessions/${confessionId}/replies`);
    return response.data;
  }
};

// Types for Confession and Reply
export interface Confession {
  _id: string;
  text: string;
  likes: number;
  dislikes: number;
  timestamp: string;
  isAnonymous: boolean;
  author: string | null;
  userId: string;
  likedBy: string[];
  dislikedBy: string[];
  replies: Reply[];
}

export interface Reply {
  _id: string;
  text: string;
  timestamp: string;
  isAnonymous: boolean;
  author: string | null;
  userId: string;
}