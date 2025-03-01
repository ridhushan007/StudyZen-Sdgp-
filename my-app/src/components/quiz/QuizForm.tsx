"use client";

import React, { useState } from 'react';
import { QuestionForm } from './QuestionForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { QuizSchema } from '@/lib/validations/quiz';
import type { Quiz, Question } from '@/lib/types/quiz';

interface QuizFormProps {
  onSubmit: (data: Omit<Quiz, '_id'>) => Promise<void>;
  initialData?: Partial<Quiz>;
}

export const QuizForm: React.FC<QuizFormProps> = ({ onSubmit, initialData }) => {
  const [quizData, setQuizData] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    timeLimit: 30,
    questions: [],
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = QuizSchema.shape[name];
      fieldSchema.parse(value);
      setErrors(prev => ({ ...prev, [name]: '' }));
      return true;
    } catch (error) {
      setErrors(prev => ({ ...prev, [name]: error.errors[0].message }));
      return false;
    }
  };

  const handleQuestionChange = (index: number, questionData: Question) => {
    const newQuestions = [...(quizData.questions || [])];
    newQuestions[index] = questionData;
    setQuizData(prev => ({ ...prev, questions: newQuestions }));
    validateField('questions', newQuestions);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      questionType: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1
    };
    setQuizData(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const removeQuestion = (index: number) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = QuizSchema.parse(quizData);
      await onSubmit(validatedData);
    } catch (error) {
      const formErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        formErrors[err.path[0]] = err.message;
      });
      setErrors(formErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Quiz Title"
              value={quizData.title}
              onChange={(e) => {
                const value = e.target.value;
                setQuizData(prev => ({ ...prev, title: value }));
                validateField('title', value);
              }}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <textarea
              placeholder="Quiz Description"
              value={quizData.description}
              onChange={(e) => {
                const value = e.target.value;
                setQuizData(prev => ({ ...prev, description: value }));
                validateField('description', value);
              }}
              className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Category"
                value={quizData.category}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuizData(prev => ({ ...prev, category: value }));
                  validateField('category', value);
                }}
                className={errors.category ? 'border-red-500' : ''}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <select
                value={quizData.difficulty}
                onChange={(e) => {
                  const value = e.target.value as Quiz['difficulty'];
                  setQuizData(prev => ({ ...prev, difficulty: value }));
                  validateField('difficulty', value);
                }}
                className={`w-full p-2 border rounded ${errors.difficulty ? 'border-red-500' : ''}`}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.difficulty && (
                <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>
              )}
            </div>
          </div>

          <div>
            <Input
              type="number"
              placeholder="Time Limit (minutes)"
              value={quizData.timeLimit}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setQuizData(prev => ({ ...prev, timeLimit: value }));
                validateField('timeLimit', value);
              }}
              className={errors.timeLimit ? 'border-red-500' : ''}
            />
            {errors.timeLimit && (
              <p className="text-red-500 text-sm mt-1">{errors.timeLimit}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {quizData.questions?.map((question, index) => (
          <QuestionForm
            key={index}
            questionNumber={index + 1}
            questionData={question}
            onChange={(data) => handleQuestionChange(index, data)}
            onDelete={() => removeQuestion(index)}
          />
        ))}

        <Button
          type="button"
          onClick={addQuestion}
          variant="outline"
          className="w-full"
        >
          Add Question
        </Button>

        {errors.questions && (
          <p className="text-red-500 text-sm">{errors.questions}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Create Quiz
      </Button>
    </form>
  );
};