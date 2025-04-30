"use client"

import { useState, useEffect, Suspense } from "react"
import { FileText, MessageSquare, User, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { IssueCard } from "@/components/issue-card"
import { StatCard } from "@/components/stat-card"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

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
  costEstimate?: {
    min: number;
    max: number;
  };
  currency?: string;
}

function DashboardContent() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "recent"
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsResponse = await fetch('/api/reports')
        if (!reportsResponse.ok) {
          const errorData = await reportsResponse.json()
          throw new Error(errorData.error || 'Failed to fetch reports')
        }
        const reportsData = await reportsResponse.json()
        setReports(reportsData)
        setError(null)
      } catch (error) {
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back, John Doe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Reports"
              value={reports.length.toString()}
              change="+0%"
              trend="up"
              icon={<FileText className="h-5 w-5" />} />
            <StatCard title="In Progress" value={getStatusCount('in-progress').toString()} change="+0%" trend="up" icon={<Loader2 className="h-5 w-5" />} />
            <StatCard title="Pending Approval" value={getStatusCount('pending').toString()} change="+0%" trend="down" icon={<Clock className="h-5 w-5" />} />
            <StatCard title="Completed" value={getStatusCount('completed').toString()} change="+0%" trend="up" icon={<CheckCircle2 className="h-5 w-5" />} />
          </div>

          <Tabs defaultValue={defaultTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="recent">Recent Issues</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No issues found.</p>
                  </div>
                ) : (
                  reports.slice(0, 6).map((report) => (
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
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="urgent">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.filter(r => r.status === 'urgent').length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No urgent issues found.</p>
                  </div>
                ) : (
                  reports.filter(r => r.status === 'urgent').map((report) => (
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
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="nearby">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* You can implement location-based filtering here if you have user location info */}
                {reports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No nearby issues found.</p>
                  </div>
                ) : (
                  reports.slice(0, 2).map((report) => (
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
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="following">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* You can implement following logic here if you have user following info */}
                {reports.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No followed issues found.</p>
                  </div>
                ) : (
                  reports.slice(0, 2).map((report) => (
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
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="messages" className="mt-4">
              <div className="bg-white rounded-lg shadow p-6 min-h-[200px]">
                <h2 className="text-lg font-semibold mb-4">Messages</h2>
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">System</span>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Welcome to CivicFix! Stay tuned for updates and notifications here.</p>
                  </li>
                  <li className="py-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">Support</span>
                      <span className="text-xs text-gray-400">Yesterday</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Your recent report has been received and is being reviewed.</p>
                  </li>
                </ul>
                <div className="text-center text-gray-400 text-sm mt-6">No more messages.</div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Issue Activity</CardTitle>
                <CardDescription>Recent updates on issues you're following</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Contractor assigned",
                      issue: "Pothole Damage",
                      time: "2 hours ago",
                      icon: <User className="h-4 w-4 text-blue-500" />,
                    },
                    {
                      title: "Bid accepted",
                      issue: "Fallen Tree",
                      time: "5 hours ago",
                      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
                    },
                    {
                      title: "Work started",
                      issue: "Damaged Guardrail",
                      time: "Yesterday",
                      icon: <Loader2 className="h-4 w-4 text-amber-500" />,
                    },
                    {
                      title: "Issue verified",
                      issue: "Street Light Out",
                      time: "2 days ago",
                      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
                    },
                    {
                      title: "New comment",
                      issue: "Broken Water Main",
                      time: "2 days ago",
                      icon: <MessageSquare className="h-4 w-4 text-purple-500" />,
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className="bg-gray-100 p-2 rounded-full">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.title}</p>
                        <p className="text-sm text-gray-500">Issue: {activity.issue}</p>
                      </div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Link href="/dashboard?tab=activity">View All Activity</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Issues requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Bid submission",
                      issue: "Fallen Tree",
                      deadline: "Today, 5:00 PM",
                      urgent: true,
                    },
                    {
                      title: "Feedback required",
                      issue: "Pothole Damage",
                      deadline: "Tomorrow, 12:00 PM",
                      urgent: false,
                    },
                    {
                      title: "Verification needed",
                      issue: "Street Light Out",
                      deadline: "May 15, 3:00 PM",
                      urgent: false,
                    },
                    {
                      title: "Final inspection",
                      issue: "Graffiti Removal",
                      deadline: "May 18, 10:00 AM",
                      urgent: false,
                    },
                  ].map((deadline, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{deadline.title}</h4>
                        {deadline.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Issue: {deadline.issue}</p>
                      <div className="flex items-center text-xs font-medium">
                        <Clock className="h-3 w-3 mr-1 text-gray-400" />
                        <span className={deadline.urgent ? "text-red-500" : "text-gray-500"}>{deadline.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Link href="/dashboard?tab=calendar">View Calendar</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
