import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Report } from '@/lib/db/schema';

export async function GET(request: Request, { params }: { params: { contractorId: string } }) {
  try {
    await dbConnect();
    const { contractorId } = params;
    // Find all completed reports assigned to this contractor
    const reports = await Report.find({ assignedContractor: contractorId, status: 'completed' });
    // Aggregate all ratings
    let allRatings: any[] = [];
    reports.forEach((report: any) => {
      if (Array.isArray(report.ratings)) {
        allRatings = allRatings.concat(report.ratings);
      }
    });
    const totalRatings = allRatings.length;
    const averageRating = totalRatings > 0 ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(2) : null;
    return NextResponse.json({
      averageRating,
      totalRatings,
      ratings: allRatings
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contractor ratings', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 