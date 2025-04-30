"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  ChevronDown,
  Download,
  MapPin,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { MapContainerProps } from 'react-leaflet';
import type { TileLayerProps } from 'react-leaflet';
import type { MarkerProps } from 'react-leaflet';
import type { PopupProps } from 'react-leaflet';

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
  category?: string;
}

// Simple geocode fallback for demo (country to lat/lng)
const countryCoords: Record<string, [number, number]> = {
  'United States': [37.0902, -95.7129],
  'Canada': [56.1304, -106.3468],
  'United Kingdom': [55.3781, -3.4360],
  'India': [20.5937, 78.9629],
  'Australia': [-25.2744, 133.7751],
  'Kenya': [-1.2921, 36.8219],
  'Nigeria': [9.0820, 8.6753],
  'South Africa': [-30.5595, 22.9375],
  'Germany': [51.1657, 10.4515],
  'France': [46.6034, 1.8883],
  'Brazil': [-14.2350, -51.9253],
  'Mexico': [23.6345, -102.5528],
  'Unknown': [0, 0],
};

const MapContainer = dynamic<any>(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic<any>(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic<any>(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic<any>(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  // Stats calculations
  const totalIssues = reports.length
  const completedIssues = reports.filter(r => r.status === 'completed')
  const inProgressIssues = reports.filter(r => r.status === 'in-progress')
  const pendingIssues = reports.filter(r => r.status === 'pending')
  const urgentIssues = reports.filter(r => r.status === 'urgent')

  // Average resolution time (for completed issues)
  const avgResolutionTime = (() => {
    if (completedIssues.length === 0) return 'N/A'
    const totalDays = completedIssues.reduce((sum, r) => {
      const created = new Date(r.createdAt).getTime()
      const updated = new Date(r.updatedAt).getTime()
      return sum + Math.max(0, (updated - created) / (1000 * 60 * 60 * 24))
    }, 0)
    return (totalDays / completedIssues.length).toFixed(1) + ' days'
  })()

  // Category distribution (fallback to status if no category)
  const categoryCounts: Record<string, number> = {}
  reports.forEach(r => {
    const cat = r.category || r.status
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })
  const categoryTotal = Object.values(categoryCounts).reduce((a, b) => a + b, 0)
  const categoryStats = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    percentage: categoryTotal ? Math.round((count / categoryTotal) * 100) : 0,
    color: name === 'urgent' ? 'bg-red-500' : name === 'pending' ? 'bg-yellow-500' : name === 'in-progress' ? 'bg-blue-500' : name === 'completed' ? 'bg-green-500' : 'bg-gray-500',
  }))

  // Location distribution (by country)
  const locationCounts: Record<string, { issues: number, resolved: number, avg: string }> = {}
  reports.forEach(r => {
    const loc = r.country || r.location || 'Unknown'
    if (!locationCounts[loc]) locationCounts[loc] = { issues: 0, resolved: 0, avg: 'N/A' }
    locationCounts[loc].issues++
    if (r.status === 'completed') locationCounts[loc].resolved++
  })
  // Calculate avg resolution for each location
  Object.keys(locationCounts).forEach(loc => {
    const locReports = reports.filter(r => (r.country || r.location || 'Unknown') === loc && r.status === 'completed')
    if (locReports.length > 0) {
      const totalDays = locReports.reduce((sum, r) => {
        const created = new Date(r.createdAt).getTime()
        const updated = new Date(r.updatedAt).getTime()
        return sum + Math.max(0, (updated - created) / (1000 * 60 * 60 * 24))
      }, 0)
      locationCounts[loc].avg = (totalDays / locReports.length).toFixed(1) + ' days'
    }
  })

  // --- Chart Data Preparation ---
  // 1. Issues over time (by month)
  const issuesByMonth: { month: string, count: number }[] = [];
  if (reports.length > 0) {
    const monthMap: Record<string, number> = {};
    reports.forEach(r => {
      const d = new Date(r.createdAt);
      const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    });
    Object.entries(monthMap).sort().forEach(([month, count]) => {
      issuesByMonth.push({ month, count });
    });
  }

  // 2. Avg resolution by status/category
  const avgResByStatus: { name: string, avg: number }[] = [];
  const statusSet = new Set(reports.map(r => r.status));
  statusSet.forEach(status => {
    const filtered = reports.filter(r => r.status === status && r.status === 'completed');
    if (filtered.length > 0) {
      const totalDays = filtered.reduce((sum, r) => {
        const created = new Date(r.createdAt).getTime();
        const updated = new Date(r.updatedAt).getTime();
        return sum + Math.max(0, (updated - created) / (1000 * 60 * 60 * 24));
      }, 0);
      avgResByStatus.push({ name: status, avg: +(totalDays / filtered.length).toFixed(2) });
    }
  });

  // 3. Pie chart colors
  const pieColors = ["#3b82f6", "#14b8a6", "#f59e42", "#a78bfa", "#f43f5e", "#22c55e", "#64748b"];

  // Issues by status for bar chart
  const issuesByStatus: { status: string, count: number }[] = [];
  if (reports.length > 0) {
    const statusMap: Record<string, number> = {};
    reports.forEach(r => {
      statusMap[r.status] = (statusMap[r.status] || 0) + 1;
    });
    Object.entries(statusMap).forEach(([status, count]) => {
      issuesByStatus.push({ status, count });
    });
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col bg-background text-foreground">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto bg-background text-foreground">
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
            <Card className="bg-card text-card-foreground">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-gray-500">Total Issues</p>
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">+0%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-800">{totalIssues}</h3>
                  <p className="text-xs text-gray-500">All time</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card text-card-foreground">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-gray-500">Completed Issues</p>
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">+0%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-800">{completedIssues.length}</h3>
                  <p className="text-xs text-gray-500">All time</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card text-card-foreground">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <div className="flex items-center text-blue-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">+0%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-800">{inProgressIssues.length}</h3>
                  <p className="text-xs text-gray-500">Currently being worked on</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card text-card-foreground">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-gray-500">Avg. Resolution Time</p>
                  <div className="flex items-center text-green-500">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">-0%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-800">{avgResolutionTime}</h3>
                  <p className="text-xs text-gray-500">For completed issues</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Issue Trends</CardTitle>
                <CardDescription>Number of issues reported over time</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={issuesByMonth} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Issues by Status</CardTitle>
                <CardDescription>Number of issues in each status</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={issuesByStatus} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Issue Categories</CardTitle>
                <CardDescription>Distribution by type</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[250px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        dataKey="percentage"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-card text-card-foreground">
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
                    <div className="h-[300px] rounded-md overflow-hidden">
                      <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {reports.map((r, i) => {
                          const coords = countryCoords[r.country] || countryCoords['Unknown'];
                          return (
                            <Marker key={r._id || i} position={coords}>
                              <Popup>
                                <div>
                                  <strong>{r.title}</strong><br />
                                  {r.location}<br />
                                  Status: {r.status}
                                </div>
                              </Popup>
                            </Marker>
                          );
                        })}
                      </MapContainer>
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
                              Location
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
                          {Object.entries(locationCounts).map(([loc, row], index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {loc}
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
        </main>
      </div>
    </div>
  )
}
