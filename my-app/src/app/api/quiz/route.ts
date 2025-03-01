import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';

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

export async function POST(req: Request) {
  try {
    console.log('API: Creating new quiz...');
    const body = await req.json();
    await connectDB();
    
    // Ensure createdBy is a string if provided
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
      questions: body.questions.map((q: any) => ({
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