import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Bid, Report } from '@/lib/db/schema';

// GET endpoint to retrieve the progress of a bid
export async function GET(
  request: NextRequest
) {
  try {
    await dbConnect();
    const id = request.nextUrl.pathname.split('/')[3]; // Extract ID from URL
    const bid = await Bid.findById(id);
    if (!bid) {
      return NextResponse.json({ error: 'Bid not found' }, { status: 404 });
    }
    return NextResponse.json({ progress: bid.progress });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get bid progress', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update the progress of a bid
export async function PATCH(
  request: NextRequest
) {
  try {
    await dbConnect();
    const id = request.nextUrl.pathname.split('/')[3]; // Extract ID from URL
    const data = await request.json();
    
    console.log('Received update request for bid:', id, 'with progress:', data.progress);
    
    if (typeof data.progress !== 'number' || data.progress < 0 || data.progress > 100) {
      return NextResponse.json(
        { error: 'Progress is required and must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    const bid = await Bid.findById(id);
    if (!bid) {
      return NextResponse.json({ error: 'Bid not found' }, { status: 404 });
    }

    console.log('Found bid:', bid);

    // Update bid progress
    bid.progress = data.progress;
    await bid.save();
    console.log('Updated bid progress');

    // Update associated report progress
    const report = await Report.findById(bid.reportId);
    if (report) {
      console.log('Found report:', report);
      // Update report progress and status
      report.progress = data.progress;
      if (data.progress === 100) {
        report.status = 'completed';
      } else if (data.progress > 0) {
        report.status = 'in-progress';
      }
      await report.save();
      console.log('Updated report progress and status');
    }

    // Fetch the updated report to include in the response
    const updatedReport = await Report.findById(bid.reportId);
    console.log('Final updated report:', updatedReport);

    return NextResponse.json({ 
      bid: bid,
      report: updatedReport,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Error in PATCH handler:', error);
    return NextResponse.json(
      { error: 'Failed to update bid progress', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 