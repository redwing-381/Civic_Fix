import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Bid, Report } from '@/lib/db/schema';

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const id = request.nextUrl.pathname.split('/')[3]; // Extract ID from URL
    const data = await request.json();
    if (typeof data.progress !== 'number') {
      return NextResponse.json({ error: 'Progress is required and must be a number' }, { status: 400 });
    }
    const updated = await Bid.findByIdAndUpdate(
      id,
      { progress: data.progress },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: 'Bid not found' }, { status: 404 });
    }
    const report = await Report.findById(updated.reportId);
    if (report && report.assignedContractor === updated.contractor) {
      report.progress = data.progress;
      await report.save();
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update bid', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 