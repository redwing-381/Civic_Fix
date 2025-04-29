import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Report } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');
    
    const data = await request.json();
    console.log('Received data:', data);
    
    if (!data.title || !data.description || !data.country || !data.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newReport = await Report.create({
      title: data.title,
      description: data.description,
      country: data.country,
      location: data.location,
      imageUrl: data.imageUrl || null,
      status: 'pending',
      costEstimate: data.costEstimate || null,
      currency: data.currency || null
    });

    console.log('Report created successfully:', newReport);
    return NextResponse.json(newReport);
  } catch (error) {
    console.error('Detailed error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('Connecting to database for GET request...');
    await dbConnect();
    console.log('Database connected successfully');
    
    const allReports = await Report.find().sort({ createdAt: -1 });
    console.log('Reports fetched successfully:', allReports.length);
    return NextResponse.json(allReports);
  } catch (error) {
    console.error('Detailed error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 