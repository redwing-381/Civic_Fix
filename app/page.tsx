"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, MapPin, PenToolIcon as Tool, UserCog, Users } from "lucide-react"
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

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)
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
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: isHovered ? 10 : -10 }}
            transition={{ duration: 0.3 }}
          >
            <Tool className="h-8 w-8 text-teal-600" />
          </motion.div>
          <h1
            className="text-2xl font-bold text-teal-700"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            CivicFix
          </h1>
        </div>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link href="/login" className="text-teal-700 hover:text-teal-500 transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-teal-700 hover:text-teal-500 transition-colors">
                Register
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-teal-700 hover:text-teal-500 transition-colors">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="container mx-auto py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Transforming <span className="text-teal-600">Community Issues</span> into Resolved Solutions
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Report infrastructure problems, track repairs, and hold contractors accountable with our transparent
                civic issue management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/register">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">Explore Issues</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 z-10"></div>
              <img
                src="/civicfix.png?height=400&width=600"
                alt="City infrastructure being repaired"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="h-10 w-10 text-teal-600" />,
                  title: "Report Issues",
                  description:
                    "Take photos, add details, and submit infrastructure problems in your area with precise location tracking.",
                },
                {
                  icon: <UserCog className="h-10 w-10 text-teal-600" />,
                  title: "Government Validation",
                  description:
                    "Officials review, approve, and allocate budget for repairs with AI-assisted cost estimation.",
                },
                {
                  icon: <Tool className="h-10 w-10 text-teal-600" />,
                  title: "Contractor Bidding",
                  description:
                    "Qualified contractors bid on projects, with transparent selection and progress tracking.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Issues</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through recently reported and resolved civic issues in your community
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span>Loading issues...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No issues found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link href="/dashboard">
                View All Issues
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-teal-50 py-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Join Our Community</h2>
                <p className="text-gray-600 mb-8">
                  Whether you're a concerned citizen, a contractor, or a government official, CivicFix provides the
                  tools you need to improve infrastructure and public services.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2 text-teal-700">For Citizens</h3>
                    <p className="text-sm text-gray-600">Report issues, track progress, and rate completed work</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2 text-teal-700">For Contractors</h3>
                    <p className="text-sm text-gray-600">Bid on projects and build your reputation</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2 text-teal-700">For Officials</h3>
                    <p className="text-sm text-gray-600">Manage issues and monitor contractor performance</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2 text-teal-700">For Communities</h3>
                    <p className="text-sm text-gray-600">Transparent process and better infrastructure</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Register Now</h3>
                <div className="space-y-4">
                  <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                    <Link href="/register/citizen">Register as Citizen</Link>
                  </Button>
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/register/contractor">Register as Contractor</Link>
                  </Button>
                  <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                    <Link href="/register/official">Register as Government Official</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CivicFix</h3>
              <p className="text-gray-400 text-sm">
                Transforming community issues into resolved solutions through transparency and accountability.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-white transition-colors">
                    User Guides
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/stats" className="hover:text-white transition-colors">
                    Statistics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} CivicFix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
