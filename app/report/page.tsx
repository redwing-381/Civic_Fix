"use client"

import { useState, useEffect } from "react"
import { FileText, Clock, CheckCircle2, Loader2, Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { IssueCard } from "@/components/issue-card"
import { StatCard } from "@/components/stat-card"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Report {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: "urgent" | "pending" | "in-progress" | "bidding" | "completed";
  createdAt: string;
  updatedAt: string;
  progress?: number;
  assignedContractor?: string;
  imageUrl?: string;
  country: string;
  costEstimate: {
    min: number;
    max: number;
  };
  currency: string;
}

interface Bid {
  _id: string;
  reportId: string;
  contractor: string;
  progress: number;
  status: string;
}

export default function MyReports() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log('Fetching reports and bids...')
        // Fetch reports
        const reportsResponse = await fetch('/api/reports')
        if (!reportsResponse.ok) {
          const errorData = await reportsResponse.json()
          throw new Error(errorData.error || 'Failed to fetch reports')
        }
        const reportsData = await reportsResponse.json()
        
        // Fetch all bids
        const bidsResponse = await fetch('/api/bids')
        if (!bidsResponse.ok) {
          throw new Error('Failed to fetch bids')
        }
        const bidsData = await bidsResponse.json()
        
        // Map bids to their reports
        const reportsWithProgress = reportsData.map((report: Report) => {
          // Find the associated bid for this report
          const associatedBid = bidsData.find((bid: Bid) => 
            bid.reportId === report._id && 
            bid.contractor === report.assignedContractor
          )
          
          // If there's an associated bid, use its progress
          if (associatedBid) {
            console.log(`Found bid for report ${report.title}:`, associatedBid)
            return {
              ...report,
              progress: associatedBid.progress
            }
          }
          
          return report
        })

        console.log('Reports with bid progress:', reportsWithProgress)
        setReports(reportsWithProgress)
        setError(null)
      } catch (error) {
        console.error('Error fetching reports and bids:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch reports')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const getStatusCount = (status: string) => {
    return reports.filter(report => report.status === status).length
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

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Reports"
              value={reports.length.toString()}
              change="+12%"
              trend="up"
              icon={<FileText className="h-5 w-5" />}
            />
            <StatCard
              title="In Progress"
              value={getStatusCount('in-progress').toString()}
              change="+5%"
              trend="up"
              icon={<Loader2 className="h-5 w-5" />}
            />
            <StatCard
              title="Pending Approval"
              value={getStatusCount('pending').toString()}
              change="-2%"
              trend="down"
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              title="Completed"
              value={getStatusCount('completed').toString()}
              change="+8%"
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
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reports found. Create your first report!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reports.map((report) => {
                      console.log(`Rendering report ${report.title}:`, {
                        status: report.status,
                        progress: report.progress,
                        calculatedProgress: report.progress ?? (report.status === 'completed' ? 100 : report.status === 'in-progress' ? 50 : 10)
                      });
                      return (
                        <IssueCard
                          key={report._id}
                          title={report.title}
                          description={report.description}
                          location={report.location}
                          status={report.status}
                          daysAgo={Math.floor((new Date().getTime() - new Date(report.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                          progress={report.progress ?? (report.status === 'completed' ? 100 : report.status === 'in-progress' ? 50 : 10)}
                          id={report._id}
                          imageUrl={report.imageUrl}
                          country={report.country}
                          createdAt={report.createdAt}
                          updatedAt={report.updatedAt}
                          costEstimate={report.costEstimate}
                          currency={report.currency}
                        />
                      );
                    })}
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
                      <span className="text-sm font-medium text-gray-700">{reports.length} reports</span>
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
