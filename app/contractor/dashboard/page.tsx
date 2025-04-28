"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Hammer,
  MapPin,
  Star,
  Timer,
  Loader2,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatCard } from "@/components/stat-card"
import Link from "next/link"

interface Tender {
  id: string
  title: string
  description: string
  location: string
  budget: string
  deadline: string
  category: string
  urgent: boolean
  reportId: string
  report?: {
    title: string
  }
}

export default function ContractorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await fetch("/api/tenders")
        if (!response.ok) {
          throw new Error("Failed to fetch tenders")
        }
        const data = await response.json()
        setTenders(data)
      } catch (error) {
        console.error("Error fetching tenders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTenders()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Contractor Dashboard</h1>
            <p className="text-gray-500">Welcome back, ABC Construction</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Active Projects" value="8" change="+2" trend="up" icon={<Hammer className="h-5 w-5" />} />
            <StatCard
              title="Available Tenders"
              value={tenders.length.toString()}
              change="+5"
              trend="up"
              icon={<FileText className="h-5 w-5" />}
            />
            <StatCard
              title="Completed Projects"
              value="142"
              change="+12"
              trend="up"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
            <StatCard title="Rating" value="4.8/5" change="+0.2" trend="up" icon={<Star className="h-5 w-5" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Available Tenders</CardTitle>
                <CardDescription>Open projects you can bid on</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Tenders</TabsTrigger>
                    <TabsTrigger value="nearby">Nearby</TabsTrigger>
                    <TabsTrigger value="recent">Recently Added</TabsTrigger>
                    <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : tenders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No tenders available at the moment.
                      </div>
                    ) : (
                      tenders.map((tender) => (
                        <div
                          key={tender.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-800 text-lg">{tender.report?.title || tender.title}</h3>
                            {tender.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {tender.location}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span>{tender.category}</span>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                              <div className="text-sm">
                                <div className="flex items-center text-gray-500">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  <span>{tender.budget}</span>
                                </div>
                                <div className="flex items-center text-gray-500 mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span
                                    className={
                                      tender.deadline.includes("Today") ? "text-red-500 font-medium" : "text-gray-500"
                                    }
                                  >
                                    {tender.deadline}
                                  </span>
                                </div>
                              </div>
                              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                <Link href={`/contractor/bid/${tender.id}`}>Place Bid</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="nearby">
                    <div className="p-8 text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-700 mb-1">Nearby Tenders</h3>
                      <p>View tenders in your local area based on your registered business address.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="recent">
                    <div className="p-8 text-center text-gray-500">
                      <Clock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-700 mb-1">Recently Added</h3>
                      <p>View tenders that have been added in the last 24 hours.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="expiring">
                    <div className="p-8 text-center text-gray-500">
                      <Timer className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-700 mb-1">Expiring Soon</h3>
                      <p>View tenders that are closing within the next 24 hours.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Link href="/contractor/tenders">View All Tenders</Link>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Performance</CardTitle>
                <CardDescription>Metrics and ratings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-teal-50 rounded-full mb-2">
                    <Star className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">4.8</h3>
                  <p className="text-sm text-gray-500">Average Rating (142 projects)</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">On-time Completion</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quality Score</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget Adherence</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Communication</span>
                      <span className="font-medium">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-medium text-gray-800 mb-3">Recent Feedback</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-4 w-4 ${star <= 5 ? "text-amber-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        "Excellent work on the pothole repairs. Completed ahead of schedule and with great quality."
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Projects currently in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "1",
                      title: "Pothole Repair - Main Street",
                      location: "Downtown, Main St & 5th Ave",
                      deadline: "May 20, 2023",
                      progress: 45,
                      status: "in-progress",
                    },
                    {
                      id: "2",
                      title: "Guardrail Installation",
                      location: "Highway 101, Mile Marker 23",
                      deadline: "May 25, 2023",
                      progress: 30,
                      status: "in-progress",
                    },
                    {
                      id: "3",
                      title: "Sidewalk Replacement",
                      location: "Eastside, Oak Lane",
                      deadline: "June 5, 2023",
                      progress: 15,
                      status: "in-progress",
                    },
                  ].map((project) => (
                    <div
                      key={project.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{project.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{project.location}</span>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-1.5" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Due: {project.deadline}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Link href={`/contractor/projects/${project.id}/update`}>Update Progress</Link>
                            </Button>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                              <Link href={`/contractor/projects/${project.id}`}>View Details</Link>
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
                  <Link href="/contractor/projects">
                    View All Projects
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Projects requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Bid Submission",
                      project: "Street Light Replacement",
                      deadline: "Today, 5:00 PM",
                      urgent: true,
                    },
                    {
                      title: "Progress Update",
                      project: "Pothole Repair - Main Street",
                      deadline: "Tomorrow, 12:00 PM",
                      urgent: false,
                    },
                    {
                      title: "Final Inspection",
                      project: "Guardrail Installation",
                      deadline: "May 25, 3:00 PM",
                      urgent: false,
                    },
                    {
                      title: "Material Procurement",
                      project: "Sidewalk Replacement",
                      deadline: "May 20, 10:00 AM",
                      urgent: false,
                    },
                  ].map((deadline, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        deadline.urgent ? "border-red-200 bg-red-50" : "border-gray-200"
                      } hover:border-gray-300 transition-colors`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{deadline.title}</h4>
                        {deadline.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Project: {deadline.project}</p>
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
                  <Link href="/contractor/calendar">
                    View Calendar
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
