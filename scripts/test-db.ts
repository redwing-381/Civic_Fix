import { db } from "@/lib/db"

console.log("DATABASE_URL:", process.env.DATABASE_URL)

async function testDatabase() {
  try {
    console.log("Testing database connection...")

    // Test creating a report
    const report = await db.report.create({
      data: {
        title: "Test Report",
        description: "This is a test report",
        location: "Test Location",
        category: "Test Category",
      },
    })
    console.log("Created report:", report)

    // Test creating a tender
    const tender = await db.tender.create({
      data: {
        budget: "1000",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        urgent: false,
        reportId: report.id,
      },
    })
    console.log("Created tender:", tender)

    // Test fetching tenders
    const tenders = await db.tender.findMany({
      include: {
        report: true,
      },
    })
    console.log("All tenders:", tenders)

    // Clean up test data
    await db.tender.deleteMany()
    await db.report.deleteMany()
    console.log("Test data cleaned up")

  } catch (error) {
    console.error("Error testing database:", error)
  } finally {
    await db.$disconnect()
  }
}

testDatabase() 