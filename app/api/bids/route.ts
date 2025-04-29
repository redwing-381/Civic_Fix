import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Bid } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    if (!data.reportId || !data.contractor || !data.amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newBid = await Bid.create({
      reportId: data.reportId,
      contractor: data.contractor,
      amount: data.amount,
      status: 'active',
    });
    return NextResponse.json(newBid);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create bid', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const filter: any = {};

    // Apply filters if provided
    if (searchParams.has('contractor')) {
      filter.contractor = searchParams.get('contractor');
    }
    if (searchParams.has('reportId')) {
      filter.reportId = searchParams.get('reportId');
    }
    if (searchParams.has('status')) {
      filter.status = searchParams.get('status');
    }

    // Fetch bids with filters
    const bids = await Bid.find(filter).sort({ createdAt: -1 });
    console.log(`Found ${bids.length} bids with filters:`, filter);
    
    return NextResponse.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bids', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 