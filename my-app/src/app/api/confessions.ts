import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const confessionApi = {
  getAllConfessions: async () => {
    const response = await axios.get(`${API_URL}/confessions`);
    return response.data;
  },

  createConfession: async (data: { text: string; isAnonymous: boolean; author: string | null }) => {
    const response = await axios.post(`${API_URL}/confessions`, data);
    return response.data;
  },

  likeConfession: async (id: string) => {
    const response = await axios.post(`${API_URL}/confessions/${id}/like`);
    return response.data;
  },

  dislikeConfession: async (id: string) => {
    const response = await axios.post(`${API_URL}/confessions/${id}/dislike`);
    return response.data;
  },

  getReplies: async (confessionId: string) => {
    const response = await axios.get(`${API_URL}/confessions/${confessionId}/replies`);
    return response.data;
  },

  addReply: async (confessionId: string, data: { text: string; isAnonymous: boolean; author: string | null }) => {
    const response = await axios.post(`${API_URL}/confessions/${confessionId}/replies`, data);
    return response.data;
  }
};