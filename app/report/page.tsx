"use client"

import { useState } from "react"
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

export default function MyReports() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

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
              value="24"
              change="+12%"
              trend="up"
              icon={<FileText className="h-5 w-5" />}
            />
            <StatCard
              title="In Progress"
              value="8"
              change="+5%"
              trend="up"
              icon={<Loader2 className="h-5 w-5" />}
            />
            <StatCard
              title="Pending Approval"
              value="5"
              change="-2%"
              trend="down"
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              title="Completed"
              value="11"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <IssueCard
                    title="Broken Water Main"
                    description="Water leaking onto the street causing traffic hazards"
                    location="123 Main St, Downtown"
                    status="in-progress"
                    daysAgo={2}
                    progress={45}
                    id="1"
                  />
                  <IssueCard
                    title="Pothole Damage"
                    description="Large pothole causing vehicle damage"
                    location="456 Oak Ave, Westside"
                    status="pending"
                    daysAgo={5}
                    progress={10}
                    id="2"
                  />
                  <IssueCard
                    title="Fallen Tree"
                    description="Tree blocking sidewalk after storm"
                    location="789 Pine St, Northside"
                    status="completed"
                    daysAgo={7}
                    progress={100}
                    id="3"
                  />
                  <IssueCard
                    title="Street Light Out"
                    description="Street light not working for past week"
                    location="101 Elm St, Eastside"
                    status="in-progress"
                    daysAgo={3}
                    progress={30}
                    id="4"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Link href="/report/all">View All Reports</Link>
                </Button>
              </CardFooter>
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
                      <span className="text-sm font-medium text-gray-700">8 reports</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Last Month</span>
                      <span className="text-sm font-medium text-gray-700">6 reports</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Average Resolution Time</span>
                      <span className="text-sm font-medium text-gray-700">7 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "70%" }}></div>
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
