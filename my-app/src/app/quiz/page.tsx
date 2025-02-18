import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const QuizZone = () => {
  const quizzes = [
    {
      id: 1,
      title: 'JavaScript fundamentals',
      description: 'Test your knowledge of JavaScript basics, including variables, functions, and objects',
      questionCount: 15,
      timeLimit: 20,
      difficulty: 'Beginner'
    },
    // Add more quiz data
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quiz Zone</h1>
        <Link 
          href="/quiz/create" 
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Create Quiz
        </Link>
      </div>

      <h2 className="text-xl mb-4">Explore Quiz</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{quiz.title}</span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {quiz.difficulty}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{quiz.questionCount} questions</span>
                <span>{quiz.timeLimit} minutes</span>
              </div>
              <Link 
                href={`/quiz/${quiz.id}`}
                className="mt-4 block w-full text-center bg-black text-white p-2 rounded-lg hover:bg-gray-800"
              >
                Start Quiz
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizZone;