import { NextResponse } from 'next/server';

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  return NextResponse.json({
    hasDatabaseUrl: !!databaseUrl,
    databaseUrlLength: databaseUrl?.length || 0,
    isDevelopment: process.env.NODE_ENV === 'development'
  });
} 