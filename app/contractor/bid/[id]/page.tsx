"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Info,
  Loader2,
  MapPin,
  Timer,
  Upload,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function BidSubmission({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState<number | null>(null)
  const [timeframe, setTimeframe] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [report, setReport] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('/api/reports')
        if (!response.ok) throw new Error('Failed to fetch report')
        const data = await response.json()
        const found = data.find((r: any) => r._id === id)
        setReport(found)
        setBidAmount(found?.costEstimate?.min || null)
      } catch (e: any) {
        setError(e.message)
      }
    }
    fetchReport()
  }, [id])

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!report || bidAmount == null) return
    if (bidAmount < report.costEstimate.min || bidAmount > report.costEstimate.max) {
      setError(`Bid must be between ${report.costEstimate.min} and ${report.costEstimate.max}`)
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      // TODO: Replace with real contractor info
      const bidData = {
        reportId: report._id,
        contractor: 'demo-contractor',
        amount: bidAmount,
      }
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bidData),
      })
      if (!res.ok) throw new Error('Failed to submit bid')
      setSuccess(true)
      setTimeout(() => router.push('/contractor/dashboard'), 2000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!report) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
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
                onClick={() => router.push("/contractor/dashboard")}
                className="text-gray-500 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </Button>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{report.title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{report.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1 px-3 py-1.5"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Closes in {report.timeRemaining}</span>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tender Details</CardTitle>
                    <CardDescription>Project specifications and requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                      <p className="text-gray-600">{report.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Tender Information</h3>
                        <dl className="space-y-2">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <dt className="text-gray-500">Country</dt>
                            <dd className="font-medium text-gray-800">{report.country}</dd>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <dt className="text-gray-500">Location</dt>
                            <dd className="font-medium text-gray-800">{report.location}</dd>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <dt className="text-gray-500">Budget Range</dt>
                            <dd className="font-medium text-gray-800">{report.currency || '$'}{report.costEstimate?.min} - {report.currency || '$'}{report.costEstimate?.max}</dd>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <dt className="text-gray-500">Created At</dt>
                            <dd className="font-medium text-gray-800">{new Date(report.createdAt).toLocaleDateString()}</dd>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <dt className="text-gray-500">Last Updated</dt>
                            <dd className="font-medium text-gray-800">{new Date(report.updatedAt).toLocaleDateString()}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Bid</CardTitle>
                    <CardDescription>Provide your bid details and proposal</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmitBid}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bidAmount">Your Bid Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            id="bidAmount"
                            type="number"
                            min={report.costEstimate?.min}
                            max={report.costEstimate?.max}
                            value={bidAmount ?? ''}
                            onChange={e => setBidAmount(Number(e.target.value))}
                            required
                            step="1"
                            className="pl-10"
                          />
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          Bid must be between {report.currency || '$'}{report.costEstimate?.min} and {report.currency || '$'}{report.costEstimate?.max}
                        </div>
                        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                        {success && <div className="text-green-600 text-sm mb-2">Bid submitted successfully! Redirecting...</div>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeframe">Completion Timeframe (Days)</Label>
                        <Slider
                          id="timeframe"
                          defaultValue={[timeframe]}
                          max={14}
                          step={1}
                          onValueChange={(value) => setTimeframe(value[0])}
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Faster (3 days)</span>
                          <span>Selected: {timeframe} days</span>
                          <span>Longer (14 days)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="proposal">Proposal Details</Label>
                        <Textarea
                          id="proposal"
                          placeholder="Describe your approach, materials, and any additional value you'll provide..."
                          className="min-h-[150px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Supporting Documents (Optional)</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center">
                          <div className="flex flex-col items-center">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                            <span className="text-xs text-gray-400 mt-1">PDF, DOC, XLS (max. 10MB)</span>
                          </div>
                          <Input id="file-upload" type="file" className="hidden" />
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            id="terms"
                            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            I confirm that all information provided is accurate and I agree to the{" "}
                            <a href="#" className="text-teal-600 hover:text-teal-500">
                              Terms and Conditions
                            </a>
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="availability"
                            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
                            I confirm my availability to complete this project within the specified timeframe
                          </label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isSubmitting} className="ml-auto">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting Bid...
                          </>
                        ) : (
                          "Submit Bid"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Bid Summary</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-500">Your Bid Amount</dt>
                        <dd className="font-medium text-gray-800">${bidAmount}</dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-500">Completion Time</dt>
                        <dd className="font-medium text-gray-800">{timeframe} days</dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-500">Earnest Money Required</dt>
                        <dd className="font-medium text-gray-800">{report.earnestMoney}</dd>
                      </div>
                      <div className="flex justify-between py-2">
                        <dt className="text-gray-500">Competing Bids</dt>
                        <dd className="font-medium text-gray-800">{report.bidders}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Bid Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-teal-50 p-2 rounded-full">
                          <Calendar className="h-4 w-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Tender Posted</p>
                          <p className="text-sm text-gray-500">{report.postedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-red-50 p-2 rounded-full">
                          <Timer className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Bid Deadline</p>
                          <p className="text-sm text-red-500">{report.deadline}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-full">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Award Notification</p>
                          <p className="text-sm text-gray-500">Within 24 hours of deadline</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-green-50 p-2 rounded-full">
                          <Loader2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Expected Start Date</p>
                          <p className="text-sm text-gray-500">Within 48 hours of award</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">Bidding Tips</h4>
                        <ul className="text-sm text-amber-700 space-y-2 list-disc pl-4">
                          <li>Ensure your bid is competitive but realistic</li>
                          <li>Highlight your relevant experience in your proposal</li>
                          <li>Be specific about materials and methods you'll use</li>
                          <li>Mention any value-added services you can provide</li>
                          <li>Double-check all information before submitting</li>
                        </ul>
                      </div>
                    </div>
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
