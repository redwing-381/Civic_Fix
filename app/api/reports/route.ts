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

export async function PUT(request: Request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const { reportId, userId, rating, comment } = data;

    if (!reportId || !userId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Find the report
    const report = await Report.findById(reportId);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Check if the report is completed
    if (report.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only rate completed reports' },
        { status: 400 }
      );
    }

    // Initialize ratings array if it doesn't exist
    if (!report.ratings) {
      report.ratings = [];
    }

    // Check if user has already rated this report
    const existingRating = report.ratings.find((r: { userId: string }) => r.userId === userId);
    if (existingRating) {
      return NextResponse.json(
        { error: 'You have already rated this report' },
        { status: 400 }
      );
    }

    // Add the new rating
    report.ratings.push({
      userId,
      rating,
      comment,
      createdAt: new Date()
    });

    await report.save();

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 