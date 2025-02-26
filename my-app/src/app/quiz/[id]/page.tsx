"use client";

// Update to handle quiz submission and results
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Timer, AlertCircle } from 'lucide-react';
import { quizService } from '@/lib/services/quizService';
import type { Quiz } from '@/lib/types/quiz';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';

const TakeQuiz = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });
  const [result, setResult] = useState<{ score: number; maxScore: number } | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await quizService.getQuizById(params.id);
        setQuiz(quizData);
        setTimeLeft(quizData.timeLimit * 60);
        setAnswers(new Array(quizData.questions.length).fill(''));
      } catch (err) {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    if (!quiz || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, result]);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!quiz || submitting) return;

    try {
      setSubmitting(true);
      const result = await quizService.submitQuiz(
        quiz._id!,
        answers,
        'currentUserId' // Replace with actual user ID from auth
      );
      
      setResult({
        score: result.score,
        maxScore: result.maxScore
      });
      
      setToast({
        show: true,
        message: 'Quiz submitted successfully!',
        type: 'success'
      });
    } catch (err) {
      setToast({
        show: true,
        message: 'Failed to submit quiz',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen">Error: {error}</div>;
  if (!quiz) return <div className="flex justify-center items-center min-h-screen">Quiz not found</div>;

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Card className="max-w-2xl mx-auto p-8">
          <h2 className="text-2xl font-bold mb-6">Quiz Results</h2>
          <div className="space-y-4">
            <p className="text-lg">
              Score: {result.score} out of {result.maxScore}
            </p>
            <p className="text-lg">
              Percentage: {((result.score / result.maxScore) * 100).toFixed(1)}%
            </p>
            <Button
              onClick={() => router.push('/quiz')}
              className="w-full"
            >
              Return to Quiz List
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Timer className="w-5 h-5" />
              <span>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-1000"
                style={{ width: `${(timeLeft / (quiz.timeLimit * 60)) * 100}%` }}
              />
            </div>
          </div>

          {timeLeft < 60 && (
            <div className="mt-4 flex items-center space-x-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <span>Less than 1 minute remaining!</span>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
            <div className="text-sm font-medium text-gray-500">
              {quiz.questions[currentQuestion].marks} marks
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-medium">
              {quiz.questions[currentQuestion].questionText}
            </h2>

            {quiz.questions[currentQuestion].image && (
              <img
                src={quiz.questions[currentQuestion].image}
                alt="Question"
                className="max-w-full rounded-lg"
              />
            )}

            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                    answers[currentQuestion] === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleAnswerSelect(option)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="flex-1">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            {currentQuestion < quiz.questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                disabled={!answers[currentQuestion]}
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting || answers.some((a) => !a)}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </Card>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex space-x-2">
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  answers[index]
                    ? 'bg-blue-600'
                    : currentQuestion === index
                    ? 'bg-gray-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default TakeQuiz;