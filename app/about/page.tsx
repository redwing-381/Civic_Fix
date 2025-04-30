"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, FileText, PenToolIcon as Tool, Shield, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { IssueCard } from "@/components/issue-card"

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

export default function AboutPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button variant="ghost" size="sm" asChild className="text-gray-500 mb-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">About CivicFix</h1>
              <p className="text-gray-500 mt-2">Our mission, vision, and how we're improving communities</p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-600">
                  CivicFix is dedicated to transforming how communities address infrastructure issues by creating a
                  transparent, efficient platform that connects citizens, government officials, and contractors. We
                  believe that by streamlining the reporting and resolution process, we can help build better, safer,
                  and more responsive communities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Real Community Issues</h2>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <span>Loading issues...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No issues found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reports.filter(r => r.imageUrl && r.imageUrl.trim() !== "").slice(0, 3).map((report) => (
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
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <FileText className="h-10 w-10 text-teal-600" />,
                      title: "Report Issues",
                      description:
                        "Citizens can easily report infrastructure problems with photos, location data, and detailed descriptions.",
                    },
                    {
                      icon: <Shield className="h-10 w-10 text-teal-600" />,
                      title: "Government Validation",
                      description:
                        "Local officials review, verify, and prioritize issues, then allocate appropriate budgets.",
                    },
                    {
                      icon: <Users className="h-10 w-10 text-teal-600" />,
                      title: "Contractor Resolution",
                      description:
                        "Qualified contractors bid on projects, complete the work, and receive feedback on performance.",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card>
                        <CardContent className="pt-6">
                          <div className="bg-teal-50 p-3 rounded-full w-fit mb-4">{step.icon}</div>
                          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Impact</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { value: "10,000+", label: "Issues Reported" },
                    { value: "8,500+", label: "Issues Resolved" },
                    { value: "85%", label: "Resolution Rate" },
                    { value: "4.8/5", label: "User Satisfaction" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center"
                    >
                      <p className="text-3xl font-bold text-teal-600 mb-1">{stat.value}</p>
                      <p className="text-gray-600">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h2>
                <div className="space-y-4">
                  {[
                    {
                      title: "Transparency",
                      description:
                        "We believe in complete visibility throughout the process, from issue reporting to resolution.",
                    },
                    {
                      title: "Accountability",
                      description:
                        "We hold all stakeholders accountable for their responsibilities and commitments to the community.",
                    },
                    {
                      title: "Efficiency",
                      description: "We strive to streamline processes and reduce bureaucracy to solve problems faster.",
                    },
                    {
                      title: "Community-Focused",
                      description: "We put the needs of communities first, ensuring that solutions benefit everyone.",
                    },
                  ].map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <div className="bg-teal-50 p-2 rounded-full">
                        <CheckCircle2 className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{value.title}</h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Team</h2>
                <p className="text-gray-600 mb-6">
                  CivicFix was founded by a team of urban planners, software engineers, and former government officials
                  who saw the need for a better way to address infrastructure issues in communities. Our diverse team
                  brings together expertise in public administration, technology, and community engagement.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Sarah Johnson",
                      role: "Founder & CEO",
                      bio: "Former urban planner with 15 years of experience in local government.",
                      avatar: "/placeholder.svg?height=100&width=100&text=SJ",
                    },
                    {
                      name: "Michael Chen",
                      role: "CTO",
                      bio: "Software engineer with a passion for civic technology and open data.",
                      avatar: "/placeholder.svg?height=100&width=100&text=MC",
                    },
                    {
                      name: "Robert Smith",
                      role: "COO",
                      bio: "Former public works director with expertise in infrastructure management.",
                      avatar: "/placeholder.svg?height=100&width=100&text=RS",
                    },
                  ].map((person, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                        <img
                          src={person.avatar || "/placeholder.svg"}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-800">{person.name}</h3>
                      <p className="text-teal-600 text-sm mb-2">{person.role}</p>
                      <p className="text-gray-600 text-sm">{person.bio}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="bg-teal-50 p-6 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Our Mission</h2>
                    <p className="text-gray-600">
                      Help us build better communities by reporting issues, becoming a contractor, or partnering with
                      us.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="bg-teal-600 hover:bg-teal-700">
                      <Link href="/register">Sign Up Now</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <Tool className="h-6 w-6 text-teal-600 mr-2" />
                <span className="text-lg font-bold text-teal-700">CivicFix</span>
              </div>
              <div className="text-sm text-gray-500">© {new Date().getFullYear()} CivicFix. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
