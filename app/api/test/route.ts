import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await dbConnect();
    console.log('Database connection successful');
    return NextResponse.json({ status: 'success', message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 