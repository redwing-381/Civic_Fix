import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const tenders = await db.tender.findMany({
      include: { report: true },
    })
    return NextResponse.json(tenders)
  } catch (error) {
    console.error("Error fetching tenders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const tender = await db.tender.create({
      data: {
        budget: data.budget || "To be determined",
        deadline: data.deadline ? new Date(data.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        urgent: data.urgent || false,
        reportId: data.reportId,
      },
    })
    return NextResponse.json(tender, { status: 201 })
  } catch (error) {
    console.error("Error creating tender:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 