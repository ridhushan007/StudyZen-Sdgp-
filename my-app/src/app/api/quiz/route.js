import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Quiz from '@/models/Quiz';

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

export async function GET() {
  try {
    console.log('API: Connecting to MongoDB...');
    await connectDB();
    console.log('API: Connected successfully, fetching quizzes...');
    
    const quizzes = await Quiz.find({}).sort({ createdAt: -1 });
    console.log(`API: Found ${quizzes.length} quizzes`);
    
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('API Error details:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch quizzes', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log('API: Creating new quiz...');
    const body = await req.json();
    await connectDB();
    
    if (body.createdBy && typeof body.createdBy !== 'string') {
      body.createdBy = String(body.createdBy);
    }
    
    // Clean up any properties that might cause issues
    const sanitizedBody = {
      title: body.title,
      description: body.description,
      category: body.category,
      difficulty: body.difficulty,
      timeLimit: body.timeLimit,
      questions: body.questions.map((q) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
      })),
      createdBy: body.createdBy || 'unknown'
    };
    
    console.log('API: Creating quiz with data:', JSON.stringify(sanitizedBody, null, 2));
    const quiz = await Quiz.create(sanitizedBody);
    console.log('API: Quiz created successfully', quiz._id);
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('API Error details:', error);
    return NextResponse.json({ 
      error: 'Failed to create quiz', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}