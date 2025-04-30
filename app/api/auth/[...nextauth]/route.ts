import { NextResponse } from "next/server";

export async function GET() {
  // Return a mock session with a fixed user ID
  return NextResponse.json({
    user: {
      id: "mock-user-123",
      name: "Mock User",
      email: "mock@example.com"
    }
  });
} 