import { NextResponse } from 'next/server';
import { z } from 'zod';
import { QuizSchema } from '@/lib/validations/quiz';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';

export async function GET(
  req,
  context
) {
  const { params } = context;
  
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
  req,
  { params }
) {
  try {
    const body = await req.json();
    
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
  req,
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