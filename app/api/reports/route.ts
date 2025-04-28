import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const reports = await db.report.findMany({
      include: { tender: true },
    })
    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const location = formData.get("location") as string
    const category = formData.get("category") as string || "Public Issue"
    const image = formData.get("image") as File | null

    if (!title || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Handle image upload if present
    let imagePath = null
    if (image) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const filename = `${uniqueSuffix}-${image.name}`
      const publicDir = join(process.cwd(), "public", "uploads")
      const filePath = join(publicDir, filename)
      await writeFile(filePath, buffer)
      imagePath = `/uploads/${filename}`
    }

    // Create the report in MongoDB
    const report = await db.report.create({
      data: { title, description, location, category, image: imagePath },
    })

    // Create a tender for this report
    const tender = await db.tender.create({
      data: {
        budget: "To be determined",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        urgent: false,
        reportId: report.id,
      },
    })

    return NextResponse.json({ report, tender }, { status: 201 })
  } catch (error) {
    console.error("Error processing report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 