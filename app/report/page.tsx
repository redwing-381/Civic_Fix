"use client"

import { useState, useEffect } from "react"
import { FileText, Clock, CheckCircle2, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { IssueCard } from "@/components/issue-card"
import { StatCard } from "@/components/stat-card"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"

interface Report {
  id: string
  title: string
  description: string
  location: string
  image: string | null
  status: "pending" | "in-progress" | "completed"
  createdAt: string
}

export default function MyReports() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports")
      if (!response.ok) throw new Error("Failed to fetch reports")
      const data = await response.json()
      setReports(data)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusCount = (status: string) => {
    return reports.filter(report => report.status === status).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Reports</h1>
              <p className="text-gray-500">Manage and track your reported issues</p>
            </div>
            <Button asChild>
              <Link href="/report/new">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Reports"
              value={reports.length.toString()}
              change=""
              trend="up"
              icon={<FileText className="h-5 w-5" />}
            />
            <StatCard
              title="In Progress"
              value={getStatusCount("in-progress").toString()}
              change=""
              trend="up"
              icon={<Loader2 className="h-5 w-5" />}
            />
            <StatCard
              title="Pending Approval"
              value={getStatusCount("pending").toString()}
              change=""
              trend="down"
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              title="Completed"
              value={getStatusCount("completed").toString()}
              change=""
              trend="up"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Reports</CardTitle>
                <CardDescription>All issues you have reported</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No reports found. Create your first report!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reports.map((report) => (
                      <Card key={report.id} className="overflow-hidden">
                        {report.image && (
                          <div className="relative h-48">
                            <Image
                              src={report.image}
                              alt={report.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{report.title}</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                          <p className="text-gray-500 text-xs">
                            <span className="font-medium">Location:</span> {report.location}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            Reported {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Statistics</CardTitle>
                <CardDescription>Your reporting activity overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">This Month</span>
                      <span className="text-sm font-medium text-gray-700">
                        {reports.filter(
                          (report) =>
                            new Date(report.createdAt).getMonth() === new Date().getMonth()
                        ).length}{" "}
                        reports
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${(reports.filter(
                            (report) =>
                              new Date(report.createdAt).getMonth() === new Date().getMonth()
                          ).length /
                            reports.length) *
                            100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Last Month</span>
                      <span className="text-sm font-medium text-gray-700">
                        {reports.filter(
                          (report) =>
                            new Date(report.createdAt).getMonth() ===
                            new Date().getMonth() - 1
                        ).length}{" "}
                        reports
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${(reports.filter(
                            (report) =>
                              new Date(report.createdAt).getMonth() ===
                              new Date().getMonth() - 1
                          ).length /
                            reports.length) *
                            100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Average Resolution Time
                      </span>
                      <span className="text-sm font-medium text-gray-700">7 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
