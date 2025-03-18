import { NextResponse } from 'next/server';
import { z } from 'zod';
import { QuizSchema } from '@/lib/validations/quiz';
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

export async function GET(
  request,
  { params }
) {
  try {
    await connectDB();
    const quiz = await Quiz.findById(params.id);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}

export async function PUT(
  request,
  { params }
) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = QuizSchema.parse(body);
    
    await connectDB();
    const quiz = await Quiz.findByIdAndUpdate(params.id, validatedData, { new: true });
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json(quiz);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
  }
}

export async function DELETE(
  request,
  { params }
) {
  try {
    await connectDB();
    const quiz = await Quiz.findByIdAndDelete(params.id);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
  }
}