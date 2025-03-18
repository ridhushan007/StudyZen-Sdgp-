import axios from 'axios';
import type { Quiz } from '@/lib/types/quiz';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class QuizServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'QuizServiceError';
  }
}

export const quizService = {
  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      const response = await axios.get<Quiz[]>(`${API_URL}/quiz`);
      return response.data;
    } catch (error: any) {
      if (error.isAxiosError) {
        throw new QuizServiceError(
          error.response?.data?.error || 'Failed to fetch quizzes',
          error.response?.status
        );
      }
      throw error;
    }
  },

  async getQuizById(id: string): Promise<Quiz> {
    try {
      const response = await axios.get<Quiz>(`${API_URL}/quiz/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.isAxiosError) {
        if (error.response?.status === 404) {
          throw new QuizServiceError('Quiz not found', 404);
        }
        throw new QuizServiceError(
          error.response?.data?.error || 'Failed to fetch quiz',
          error.response?.status
        );
      }
      throw error;
    }
  },

  async createQuiz(quizData: Omit<Quiz, '_id'>): Promise<Quiz> {
    try {
      const response = await axios.post<Quiz>(`${API_URL}/quiz`, quizData);
      return response.data;
    } catch (error: any) {
      if (error.isAxiosError) {
        throw new QuizServiceError(
          error.response?.data?.error || 'Failed to create quiz',
          error.response?.status
        );
      }
      throw error;
    }
  },

  async updateQuiz(id: string, quizData: Partial<Quiz>): Promise<Quiz> {
    try {
      const response = await axios.put<Quiz>(`${API_URL}/quiz/${id}`, quizData);
      return response.data;
    } catch (error: any) {
      if (error.isAxiosError) {
        if (error.response?.status === 404) {
          throw new QuizServiceError('Quiz not found', 404);
        }
        throw new QuizServiceError(
          error.response?.data?.error || 'Failed to update quiz',
          error.response?.status
        );
      }
      throw error;
    }
  },

  async deleteQuiz(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/quiz/${id}`);
    } catch (error: any) {
      if (error.isAxiosError) {
        if (error.response?.status === 404) {
          throw new QuizServiceError('Quiz not found', 404);
        }
        throw new QuizServiceError(
          error.response?.data?.error || 'Failed to delete quiz',
          error.response?.status
        );
      }
      throw error;
    }
  },

  async submitQuiz(
    quizId: string,
    answers: string[],
    userId: string
  ): Promise<{
    score: number;
    maxScore: number;
    submission: string;
  }> {
    try {
      const response = await axios.post(`${API_URL}/quiz/submit`, {
        quizId,
        answers,
        userId,
      });
      return response.data;
    } catch (error: any) {
      if (error.isAxiosError) {
        throw new QuizServiceError(
          error.response?.data?.error || 'Failed to submit quiz',
          error.response?.status
        );
      }
      throw error;
    }
  },
};