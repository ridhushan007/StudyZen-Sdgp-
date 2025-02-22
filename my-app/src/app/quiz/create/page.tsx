'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

const CreateQuiz = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    description: '',
    category: 'Programming',
    difficulty: 'Beginner',
    timeLimit: 15
  });

  const addQuestion = () => {
    setQuestions([...questions, {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 5
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add API call to save quiz
    router.push('/quiz');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Quiz</h1>
        <button
          onClick={() => router.push('/quiz')}
          className="text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Quiz Title"
            className="w-full p-2 border rounded"
            value={quizDetails.title}
            onChange={(e) => setQuizDetails({...quizDetails, title: e.target.value})}
          />
          
          <textarea
            placeholder="Quiz Description"
            className="w-full p-2 border rounded"
            value={quizDetails.description}
            onChange={(e) => setQuizDetails({...quizDetails, description: e.target.value})}
          />

          <div className="grid grid-cols-3 gap-4">
            <select
              className="p-2 border rounded"
              value={quizDetails.category}
              onChange={(e) => setQuizDetails({...quizDetails, category: e.target.value})}
            >
              <option value="Programming">Programming</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
            </select>

            <select
              className="p-2 border rounded"
              value={quizDetails.difficulty}
              onChange={(e) => setQuizDetails({...quizDetails, difficulty: e.target.value})}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <input
              type="number"
              placeholder="Time Limit (minutes)"
              className="p-2 border rounded"
              value={quizDetails.timeLimit}
              onChange={(e) => setQuizDetails({...quizDetails, timeLimit: parseInt(e.target.value)})}
            />
          </div>
        </div>

        {questions.map((question, index) => (
          <div key={index} className="p-4 border rounded space-y-4">
            <input
              type="text"
              placeholder="Question text"
              className="w-full p-2 border rounded"
              value={question.questionText}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].questionText = e.target.value;
                setQuestions(newQuestions);
              }}
            />

            {question.options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                placeholder={`Option ${optionIndex + 1}`}
                className="w-full p-2 border rounded"
                value={option}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].options[optionIndex] = e.target.value;
                  setQuestions(newQuestions);
                }}
              />
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded hover:border-gray-400"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
        >
          Save Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;