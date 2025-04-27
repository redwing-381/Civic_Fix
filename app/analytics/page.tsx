"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  LineChart,
  MapPin,
  PieChart,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
              <p className="text-gray-500">Track performance metrics and trends</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last 30 Days
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                title: "Total Issues",
                value: "1,248",
                change: "+12%",
                trend: "up",
                description: "vs. previous period",
              },
              {
                title: "Resolution Time",
                value: "4.2 days",
                change: "-8%",
                trend: "down",
                description: "vs. previous period",
              },
              {
                title: "Citizen Satisfaction",
                value: "92%",
                change: "+5%",
                trend: "up",
                description: "vs. previous period",
              },
              {
                title: "Budget Utilization",
                value: "78%",
                change: "+3%",
                trend: "up",
                description: "vs. previous period",
              },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <div
                      className={`flex items-center ${
                        stat.trend === "up"
                          ? "text-green-500"
                          : stat.trend === "down" && stat.title === "Resolution Time"
                            ? "text-green-500"
                            : "text-red-500"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-xs font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Issue Trends</CardTitle>
                <CardDescription>Number of issues reported over time</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] flex items-center justify-center">
                  <LineChart className="h-48 w-48 text-gray-300" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Performance</CardTitle>
                <CardDescription>Average time to resolve issues by category</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] flex items-center justify-center">
                  <BarChart3 className="h-48 w-48 text-gray-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Issue Categories</CardTitle>
                <CardDescription>Distribution by type</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[250px] flex items-center justify-center">
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
                        <div className={`h-full rounded-full ${category.color}`} style={{ width: `${category.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Issues by location</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="map">
                  <TabsList className="mb-4">
                    <TabsTrigger value="map">Map View</TabsTrigger>
                    <TabsTrigger value="table">Table View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="map">
                    <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                      <div className="text-center p-4">
                        <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Geographic heatmap of issue distribution</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="table">
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              District
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Issues
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Resolved
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Avg. Resolution
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {[
                            { district: "Downtown", issues: 342, resolved: 298, avg: "3.8 days" },
                            { district: "Westside", issues: 256, resolved: 201, avg: "4.2 days" },
                            { district: "Northside", issues: 187, resolved: 154, avg: "3.5 days" },
                            { district: "Eastside", issues: 215, resolved: 176, avg: "4.7 days" },
                            { district: "Southside", issues: 248, resolved: 203, avg: "4.1 days" },
                          ].map((row, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {row.district}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.issues}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.resolved}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.avg}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contractor Performance</CardTitle>
                <CardDescription>Rating and completion metrics</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Contractor
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Projects
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Rating
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          On-Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { name: "ABC Construction", projects: 32, rating: "4.8", onTime: "94%" },
                        { name: "City Builders Inc.", projects: 28, rating: "4.5", onTime: "89%" },
                        { name: "Metro Repairs", projects: 45, rating: "4.2", onTime: "82%" },
                        { name: "Urban Fixers", projects: 19, rating: "3.9", onTime: "78%" },
                        { name: "Quality Contractors", projects: 23, rating: "4.6", onTime: "91%" },
                      ].map((row, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.projects}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 text-amber-400 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0a0.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0a-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0a-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0a-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h\
