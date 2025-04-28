"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  ThumbsUp,
  User,
  Users,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Timeline } from "@/components/timeline"

export default function IssueDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for the issue
  const issue = {
    id,
    title: "Pothole on Main Street",
    description:
      "Large pothole approximately 2 feet wide causing traffic hazards and potential vehicle damage. Located near the intersection with Oak Avenue.",
    status: "in-progress",
    category: "Road Damage",
    subcategory: "Pothole",
    severity: "Medium",
    location: "123 Main Street, Downtown",
    landmark: "Near City Park entrance",
    reportedBy: "John Doe",
    reportedAt: "May 10, 2023",
    assignedTo: "ABC Construction",
    estimatedCost: "$1,200 - $1,500",
    estimatedCompletion: "May 20, 2023",
    progress: 45,
    images: [
      "/placeholder.svg?height=300&width=400&text=Pothole+Image+1",
      "/placeholder.svg?height=300&width=400&text=Pothole+Image+2",
      "/placeholder.svg?height=300&width=400&text=Pothole+Image+3",
    ],
    timeline: [
      {
        date: "May 10, 2023",
        time: "09:15 AM",
        title: "Issue Reported",
        description: "Issue was reported by John Doe",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        date: "May 10, 2023",
        time: "02:30 PM",
        title: "Issue Verified",
        description: "Issue was verified by Inspector Sarah Johnson",
        icon: <CheckCircle2 className="h-4 w-4" />,
      },
      {
        date: "May 11, 2023",
        time: "10:00 AM",
        title: "Cost Estimated",
        description: "Cost was estimated by the Department of Public Works",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        date: "May 12, 2023",
        time: "09:30 AM",
        title: "Tender Created",
        description: "Tender was created and published to contractor portal",
        icon: <Users className="h-4 w-4" />,
      },
      {
        date: "May 13, 2023",
        time: "04:45 PM",
        title: "Contractor Assigned",
        description: "ABC Construction was assigned to fix the issue",
        icon: <User className="h-4 w-4" />,
      },
      {
        date: "May 14, 2023",
        time: "08:00 AM",
        title: "Work Started",
        description: "Repair work has been started by the contractor",
        icon: <Loader2 className="h-4 w-4" />,
      },
    ],
    comments: [
      {
        id: 1,
        user: {
          name: "Sarah Johnson",
          role: "Inspector",
          avatar: "/placeholder.svg?height=40&width=40&text=SJ",
        },
        text: "I've verified this issue and it's a priority for repair. The pothole is causing significant traffic disruption.",
        date: "May 10, 2023",
        time: "02:35 PM",
      },
      {
        id: 2,
        user: {
          name: "Michael Chen",
          role: "Department of Public Works",
          avatar: "/placeholder.svg?height=40&width=40&text=MC",
        },
        text: "Cost estimate has been completed. This will require approximately 2 cubic yards of asphalt and 4 hours of labor.",
        date: "May 11, 2023",
        time: "10:05 AM",
      },
      {
        id: 3,
        user: {
          name: "Robert Smith",
          role: "ABC Construction",
          avatar: "/placeholder.svg?height=40&width=40&text=RS",
        },
        text: "We've started the repair work. We'll need to close one lane of traffic temporarily. Expected completion in 2 days.",
        date: "May 14, 2023",
        time: "08:15 AM",
      },
    ],
    similarIssues: [
      {
        id: "2",
        title: "Pothole on Oak Avenue",
        status: "completed",
        distance: "0.5 miles away",
      },
      {
        id: "3",
        title: "Road Crack on Pine Street",
        status: "pending",
        distance: "1.2 miles away",
      },
    ],
  }

  const getStatusDetails = () => {
    switch (issue.status) {
      case "urgent":
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          label: "Urgent",
          color: "text-red-500 bg-red-50 border-red-200",
        }
      case "pending":
        return {
          icon: <Clock className="h-5 w-5" />,
          label: "Pending",
          color: "text-amber-500 bg-amber-50 border-amber-200",
        }
      case "in-progress":
        return {
          icon: <Loader2 className="h-5 w-5" />,
          label: "In Progress",
          color: "text-blue-500 bg-blue-50 border-blue-200",
        }
      case "bidding":
        return {
          icon: <Users className="h-5 w-5" />,
          label: "Bidding",
          color: "text-purple-500 bg-purple-50 border-purple-200",
        }
      case "completed":
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          label: "Completed",
          color: "text-green-500 bg-green-50 border-green-200",
        }
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          label: "Pending",
          color: "text-gray-500 bg-gray-50 border-gray-200",
        }
    }
  }

  const statusDetails = getStatusDetails()

  const handleSubmitComment = () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setComment("")
      // In a real app, we would add the comment to the list
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-gray-500 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </Button>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{issue.title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{issue.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`${statusDetails.color} flex items-center gap-1 px-3 py-1.5`}>
                    {statusDetails.icon}
                    <span>{statusDetails.label}</span>
                  </Badge>

                  <Button size="sm">
                    Follow Issue
                    <ThumbsUp className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <Tabs defaultValue="details">
                      <TabsList className="mb-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                      </TabsList>

                      <TabsContent value="details" className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                          <p className="text-gray-600">{issue.description}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-3">Images</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {issue.images.map((image, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="rounded-lg overflow-hidden border border-gray-200"
                              >
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Issue ${index + 1}`}
                                  className="w-full h-48 object-cover"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Issue Information</h3>
                            <dl className="space-y-2">
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <dt className="text-gray-500">Category</dt>
                                <dd className="font-medium text-gray-800">{issue.category}</dd>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <dt className="text-gray-500">Subcategory</dt>
                                <dd className="font-medium text-gray-800">{issue.subcategory}</dd>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <dt className="text-gray-500">Severity</dt>
                                <dd className="font-medium text-gray-800">{issue.severity}</dd>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <dt className="text-gray-500">Reported By</dt>
                                <dd className="font-medium text-gray-800">{issue.reportedBy}</dd>
                              </div>
                              <div className="flex justify-between py-2">
                                <dt className="text-gray-500">Reported On</dt>
                                <dd className="font-medium text-gray-800">{issue.reportedAt}</dd>
                              </div>
                            </dl>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Repair Information</h3>
                            <dl className="space-y-2">
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <dt className="text-gray-500">Assigned To</dt>
                                <dd className="font-medium text-gray-800">{issue.assignedTo}</dd>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <dt className="text-gray-500">Estimated Cost</dt>
                                <dd className="font-medium text-gray-800">{issue.estimatedCost}</dd>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <dt className="text-gray-500">Expected Completion</dt>
                                <dd className="font-medium text-gray-800">{issue.estimatedCompletion}</dd>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-100">
                                <dt className="text-gray-500">Progress</dt>
                                <dd className="font-medium text-gray-800">{issue.progress}%</dd>
                              </div>
                              <div className="pt-2">
                                <Progress value={issue.progress} className="h-2" />
                              </div>
                            </dl>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="timeline">
                        <Timeline items={issue.timeline} />
                      </TabsContent>

                      <TabsContent value="comments">
                        <div className="space-y-6">
                          <div className="space-y-4">
                            {issue.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-4 p-4 rounded-lg bg-gray-50">
                                <Avatar>
                                  <AvatarImage
                                    src={comment.user.avatar || "/placeholder.svg"}
                                    alt={comment.user.name}
                                  />
                                  <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                    <div>
                                      <h4 className="font-medium text-gray-800">{comment.user.name}</h4>
                                      <p className="text-sm text-gray-500">{comment.user.role}</p>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                                      {comment.date} at {comment.time}
                                    </div>
                                  </div>
                                  <p className="text-gray-700">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-lg font-medium text-gray-800">Add a Comment</h3>
                            <Textarea
                              placeholder="Write your comment here..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="min-h-[100px]"
                            />
                            <div className="flex justify-end">
                              <Button onClick={handleSubmitComment} disabled={isSubmitting || !comment.trim()}>
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Post Comment
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Location</h3>
                    <div className="rounded-md overflow-hidden border border-gray-200 h-[200px] bg-gray-100 flex items-center justify-center mb-4">
                      <div className="text-center p-4">
                        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Map showing: {issue.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{issue.landmark}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Key Dates</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-teal-50 p-2 rounded-full">
                          <Calendar className="h-4 w-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Reported</p>
                          <p className="text-sm text-gray-500">{issue.reportedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-full">
                          <Loader2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Work Started</p>
                          <p className="text-sm text-gray-500">May 14, 2023</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-50 p-2 rounded-full">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Expected Completion</p>
                          <p className="text-sm text-gray-500">{issue.estimatedCompletion}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Similar Issues Nearby</h3>
                    <div className="space-y-4">
                      {issue.similarIssues.map((similarIssue) => (
                        <Link
                          key={similarIssue.id}
                          href={`/issue/${similarIssue.id}`}
                          className="block p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-800">{similarIssue.title}</h4>
                            <Badge
                              variant="outline"
                              className={
                                similarIssue.status === "completed"
                                  ? "bg-green-50 text-green-600 border-green-200"
                                  : "bg-amber-50 text-amber-600 border-amber-200"
                              }
                            >
                              {similarIssue.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{similarIssue.distance}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-3">
                      <Link href="/dashboard?filter=nearby">
                        View All Nearby Issues
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
