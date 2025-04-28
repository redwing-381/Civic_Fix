"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
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
  const { id } = use(params)
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState(1350)
  const [timeframe, setTimeframe] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for the tender
  const tender = {
    id,
    title: "Pothole Repairs - Main Street",
    description:
      "Repair of 3 potholes on Main Street between 5th and 6th Avenue. The largest pothole is approximately 2 feet wide and 4 inches deep. The other two are approximately 1 foot wide and 3 inches deep. The repair should include filling, compacting, and sealing the potholes to match the existing road surface.",
    location: "Downtown, Main St between 5th & 6th Ave",
    budget: "$1,200 - $1,500",
    deadline: "Today, 5:00 PM",
    category: "Road Damage",
    subcategory: "Pothole",
    postedDate: "May 10, 2023",
    estimatedCompletion: "Within 7 days of award",
    earnestMoney: "$200",
    specifications: [
      "Use high-quality asphalt mix suitable for heavy traffic areas",
      "Ensure proper drainage to prevent water accumulation",
      "Match existing road surface texture and level",
      "Provide 1-year warranty on workmanship",
      "Work to be conducted during off-peak hours (9 PM - 5 AM)",
    ],
    attachments: [
      { name: "Technical Specifications.pdf", size: "1.2 MB" },
      { name: "Site Photos.zip", size: "3.5 MB" },
      { name: "Traffic Management Plan.pdf", size: "0.8 MB" },
    ],
    bidders: 3,
    timeRemaining: "4 hours 23 minutes",
  }

  const handleSubmitBid = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/contractor/dashboard?success=true")
    }, 2000)
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
                  <h1 className="text-2xl font-bold text-gray-800">{tender.title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{tender.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1 px-3 py-1.5"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Closes in {tender.timeRemaining}</span>
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
                      <p className="text-gray-600">{tender.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Tender Information</h3>
                        <dl className="space-y-2">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <dt className="text-gray-500">Category</dt>
                            <dd className="font-medium text-gray-800">{tender.category}</dd>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <dt className="text-gray-500">Subcategory</dt>
                            <dd className="font-medium text-gray-800">{tender.subcategory}</dd>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <dt className="text-gray-500">Budget Range</dt>
                            <dd className="font-medium text-gray-800">{tender.budget}</dd>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <dt className="text-gray-500">Posted Date</dt>
                            <dd className="font-medium text-gray-800">{tender.postedDate}</dd>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <dt className="text-gray-500">Bid Deadline</dt>
                            <dd className="font-medium text-gray-800 text-red-500">{tender.deadline}</dd>
                          </div>
                          <div className="flex justify-between py-2">
                            <dt className="text-gray-500">Earnest Money</dt>
                            <dd className="font-medium text-gray-800">{tender.earnestMoney}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Project Requirements</h3>
                        <ul className="space-y-2 text-gray-600">
                          {tender.specifications.map((spec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Attachments</h3>
                      <div className="space-y-2">
                        {tender.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="font-medium text-gray-700">{attachment.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">{attachment.size}</span>
                              <Button variant="ghost" size="sm">
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                      <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">Important Notice</h4>
                        <p className="text-sm text-amber-700">
                          This project requires work during off-peak hours (9 PM - 5 AM) to minimize traffic disruption.
                          Please ensure you can accommodate this schedule before bidding.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Bid</CardTitle>
                    <CardDescription>Provide your bid details and proposal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bid-amount">Bid Amount (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="bid-amount"
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          className="pl-10"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Budget Range: {tender.budget}</span>
                        <span>Your Bid: ${bidAmount}</span>
                      </div>
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
                    <Button onClick={handleSubmitBid} disabled={isSubmitting} className="ml-auto">
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
                        <dd className="font-medium text-gray-800">{tender.earnestMoney}</dd>
                      </div>
                      <div className="flex justify-between py-2">
                        <dt className="text-gray-500">Competing Bids</dt>
                        <dd className="font-medium text-gray-800">{tender.bidders}</dd>
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
                          <p className="text-sm text-gray-500">{tender.postedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-red-50 p-2 rounded-full">
                          <Timer className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Bid Deadline</p>
                          <p className="text-sm text-red-500">{tender.deadline}</p>
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
