"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  PieChart,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatCard } from "@/components/stat-card"
import Link from "next/link"

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500">Welcome back, Admin User</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Reports"
              value="1,248"
              change="+12%"
              trend="up"
              icon={<FileText className="h-5 w-5" />}
            />
            <StatCard
              title="Pending Approval"
              value="124"
              change="+8%"
              trend="up"
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              title="Active Projects"
              value="86"
              change="+5%"
              trend="up"
              icon={<Loader2 className="h-5 w-5" />}
            />
            <StatCard
              title="Completed"
              value="782"
              change="+15%"
              trend="up"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Issues Requiring Approval</CardTitle>
                <CardDescription>Review and validate new issue reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "1",
                      title: "Broken Water Main",
                      location: "123 Main St, Downtown",
                      reportedAt: "2 hours ago",
                      severity: "high",
                      category: "Water & Drainage",
                    },
                    {
                      id: "2",
                      title: "Street Light Out",
                      location: "456 Oak Ave, Westside",
                      reportedAt: "5 hours ago",
                      severity: "medium",
                      category: "Electrical Issues",
                    },
                    {
                      id: "3",
                      title: "Fallen Tree",
                      location: "789 Pine St, Northside",
                      reportedAt: "Yesterday",
                      severity: "high",
                      category: "Public Property Damage",
                    },
                    {
                      id: "4",
                      title: "Graffiti on Public Building",
                      location: "101 Elm St, Eastside",
                      reportedAt: "Yesterday",
                      severity: "low",
                      category: "Public Property Damage",
                    },
                  ].map((issue) => (
                    <div
                      key={issue.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-800">{issue.title}</h3>
                            <Badge
                              variant="outline"
                              className={
                                issue.severity === "high"
                                  ? "bg-red-50 text-red-600 border-red-200"
                                  : issue.severity === "medium"
                                    ? "bg-amber-50 text-amber-600 border-amber-200"
                                    : "bg-green-50 text-green-600 border-green-200"
                              }
                            >
                              {issue.severity}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{issue.location}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{issue.category}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{issue.reportedAt}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <ThumbsDown className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Link href="/admin/issues">
                    View All Pending Issues
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Issue Categories</CardTitle>
                <CardDescription>Distribution of issues by category</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-[240px] flex items-center justify-center">
                  <PieChart className="h-32 w-32 text-gray-300" />
                </div>
                <div className="space-y-2 mt-4">
                  {[
                    { name: "Road Damage", percentage: 35, color: "bg-blue-500" },
                    { name: "Water & Drainage", percentage: 25, color: "bg-teal-500" },
                    { name: "Electrical Issues", percentage: 20, color: "bg-amber-500" },
                    { name: "Public Property", percentage: 15, color: "bg-purple-500" },
                    { name: "Other", percentage: 5, color: "bg-gray-500" },
                  ].map((category, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{category.name}</span>
                        <span className="font-medium">{category.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${category.color}`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Contractor Performance</CardTitle>
                <CardDescription>Rating and completion metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "ABC Construction",
                      rating: 4.8,
                      projects: 32,
                      onTime: 94,
                    },
                    {
                      name: "City Builders Inc.",
                      rating: 4.5,
                      projects: 28,
                      onTime: 89,
                    },
                    {
                      name: "Metro Repairs",
                      rating: 4.2,
                      projects: 45,
                      onTime: 82,
                    },
                    {
                      name: "Urban Fixers",
                      rating: 3.9,
                      projects: 19,
                      onTime: 78,
                    },
                  ].map((contractor, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800">{contractor.name}</h3>
                        <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-sm font-medium">
                          <svg
                            className="h-4 w-4 mr-1 text-amber-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {contractor.rating}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Projects</p>
                          <p className="font-medium">{contractor.projects}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">On-time</p>
                          <p className="font-medium">{contractor.onTime}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Link href="/admin/contractors">
                    View All Contractors
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Issue Resolution Metrics</CardTitle>
                <CardDescription>Performance trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <BarChart3 className="h-48 w-48 text-gray-300" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Resolution Time</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Issues Reported</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Link href="/analytics">View Detailed Analytics</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>Current fiscal year spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Road Repairs", allocated: "$1,250,000", spent: "$780,000", percentage: 62 },
                    { category: "Water Infrastructure", allocated: "$950,000", spent: "$520,000", percentage: 55 },
                    { category: "Electrical Systems", allocated: "$720,000", spent: "$310,000", percentage: 43 },
                    { category: "Public Spaces", allocated: "$580,000", spent: "$390,000", percentage: 67 },
                  ].map((budget, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800">{budget.category}</h4>
                        <span className="text-gray-600">
                          {budget.spent} / {budget.allocated}
                        </span>
                      </div>
                      <Progress value={budget.percentage} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{budget.percentage}% spent</span>
                        <span>{100 - budget.percentage}% remaining</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Link href="/admin/budget">
                    View Budget Report
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Urgent Attention Required</CardTitle>
                <CardDescription>High priority issues needing immediate action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "1",
                      title: "Gas Leak Suspected",
                      location: "505 Birch St, Westside",
                      reportedAt: "15 minutes ago",
                      status: "unassigned",
                    },
                    {
                      id: "2",
                      title: "Downed Power Line",
                      location: "707 Willow Ave, Eastside",
                      reportedAt: "1 hour ago",
                      status: "pending",
                    },
                    {
                      id: "3",
                      title: "Major Flooding",
                      location: "202 Maple Dr, Southside",
                      reportedAt: "2 hours ago",
                      status: "in-progress",
                    },
                  ].map((issue) => (
                    <div
                      key={issue.id}
                      className="p-4 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="font-medium text-gray-800">{issue.title}</h3>
                            <Badge
                              variant="outline"
                              className={
                                issue.status === "unassigned"
                                  ? "bg-red-100 text-red-600 border-red-200"
                                  : issue.status === "pending"
                                    ? "bg-amber-100 text-amber-600 border-amber-200"
                                    : "bg-blue-100 text-blue-600 border-blue-200"
                              }
                            >
                              {issue.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{issue.location}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">{issue.reportedAt}</span>
                            <Button size="sm" variant="secondary">
                              <Link href={`/issue/${issue.id}`}>Take Action</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Link href="/admin/issues?filter=urgent">
                    View All Urgent Issues
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
