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

export const confessionApi = {
  getAllConfessions: async (): Promise<Confession[]> => {
    const response = await axios.get(`${API_URL}/confessions`);
    return response.data;
  },
  
  createConfession: async (confessionData: ConfessionData): Promise<Confession> => {
    const response = await axios.post(`${API_URL}/confessions`, {
      ...confessionData,
      userId: localStorage.getItem('userId') || generateUserId()
    });
    return response.data;
  },
  
  likeConfession: async (confessionId: string): Promise<Confession> => {
    const response = await axios.post(`${API_URL}/confessions/${confessionId}/like`, {
      userId: localStorage.getItem('userId') || generateUserId()
    });
    return response.data;
  },
  
  dislikeConfession: async (confessionId: string): Promise<Confession> => {
    const response = await axios.post(`${API_URL}/confessions/${confessionId}/dislike`, {
      userId: localStorage.getItem('userId') || generateUserId()
    });
    return response.data;
  },
  
  addReply: async (confessionId: string, replyData: ReplyData): Promise<Reply> => {
    const response = await axios.post(`${API_URL}/confessions/${confessionId}/replies`, {
      ...replyData,
      userId: localStorage.getItem('userId') || generateUserId()
    });
    return response.data;
  },
  
  getReplies: async (confessionId: string): Promise<Reply[]> => {
    const response = await axios.get(`${API_URL}/confessions/${confessionId}/replies`);
    return response.data;
  }
};

// Generate and store a unique ID for the current user
function generateUserId(): string {
  const userId = 'user_' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('userId', userId);
  return userId;
}

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
