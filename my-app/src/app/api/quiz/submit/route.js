import { NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import Quiz from '@/models/Quiz';
import QuizSubmission from '@/models/QuizSubmission';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const SubmitQuizSchema = z.object({
  quizId: z.string(),
  answers: z.array(z.string()),
  userId: z.string()
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { quizId, answers, userId } = SubmitQuizSchema.parse(body);
    
    await connectDB();
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (answers.length !== quiz.questions.length) {
      return NextResponse.json(
        { error: 'Number of answers does not match number of questions' },
        { status: 400 }
      );
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score += question.marks;
      }
    });

    const maxScore = quiz.questions.reduce(
      (acc, q) => acc + q.marks,
      0
    );

    // Create submission with string userId 
    const submission = await QuizSubmission.create({
      quiz: quizId,
      user: userId, // Now expecting a string
      answers,
      score,
      maxScore
    });

    return NextResponse.json({
      score,
      maxScore,
      submission: submission._id
    });
  } catch (error) {
    console.error('API Error in quiz submission:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'Failed to submit quiz',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}