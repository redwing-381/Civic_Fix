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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

export default function ContractorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tenders, setTenders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeBids, setActiveBids] = useState<any[]>([])
  const [activeBidsLoading, setActiveBidsLoading] = useState(true)
  const [detailsModal, setDetailsModal] = useState<{ open: boolean, project: any | null }>({ open: false, project: null })
  const [successModal, setSuccessModal] = useState<{ open: boolean, message: string }>({ open: false, message: '' })

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        // Fetch reports
        const response = await fetch("/api/reports")
        if (!response.ok) throw new Error("Failed to fetch tenders")
        const reports = await response.json()
        
        // Fetch all active bids
        const bidsResponse = await fetch('/api/bids')
        if (!bidsResponse.ok) throw new Error("Failed to fetch bids")
        const bids = await bidsResponse.json()
        
        // Get report IDs that have active bids
        const reportsWithBids = new Set(bids.map((bid: any) => bid.reportId))
        
        // Filter reports to only show those without active bids and with status 'pending' or 'bidding'
        const filtered = reports.filter((r: any) => 
          (r.status === 'pending' || r.status === 'bidding') && 
          !reportsWithBids.has(r._id)
        )
        
        setTenders(filtered)
        setError(null)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTenders()
  }, [])

  useEffect(() => {
    const fetchActiveBids = async () => {
      try {
        const res = await fetch('/api/bids?contractor=demo-contractor')
        const bids = await res.json()
        // Fetch associated reports for each bid
        const reportIds = bids.map((b: any) => b.reportId)
        const reportsRes = await fetch('/api/reports')
        const reports = await reportsRes.json()
        // Merge bid and report info
        const merged = bids.map((bid: any) => {
          const report = reports.find((r: any) => r._id === bid.reportId)
          return { ...bid, report }
        })
        setActiveBids(merged)
      } catch (e) {
        setActiveBids([])
      } finally {
        setActiveBidsLoading(false)
      }
    }
    fetchActiveBids()
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
            <StatCard 
              title="Active Projects" 
              value={activeBids.length.toString()} 
              change="+0" 
              trend="up" 
              icon={<Hammer className="h-5 w-5" />} 
            />
            <StatCard
              title="Available Tenders"
              value={tenders.length.toString()}
              change="+0"
              trend="up"
              icon={<FileText className="h-5 w-5" />}
            />
            <StatCard
              title="Completed Projects"
              value="0"
              change="+0"
              trend="up"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
            <StatCard 
              title="Rating" 
              value="0/5" 
              change="+0" 
              trend="up" 
              icon={<Star className="h-5 w-5" />} 
            />
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
                      <div className="text-center text-gray-500">Loading tenders...</div>
                    ) : error ? (
                      <div className="text-center text-red-500">{error}</div>
                    ) : tenders.length === 0 ? (
                      <div className="text-center text-gray-500">No available tenders at the moment.</div>
                    ) : (
                      tenders.map((tender) => (
                        <div
                          key={tender._id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex gap-4 items-start">
                              {tender.imageUrl && (
                                <img src={tender.imageUrl} alt={tender.title} className="w-24 h-24 object-cover rounded-md border" />
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-800">{tender.title}</h3>
                                  {tender.urgent && (
                                    <Badge variant="destructive" className="text-xs">Urgent</Badge>
                                  )}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 mt-1">
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {tender.location}
                                  </span>
                                  <span className="hidden sm:inline">•</span>
                                  <span>{tender.category || 'General'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                              <div className="text-sm">
                                <div className="flex items-center text-gray-500">
                                  <span>
                                    {tender.currency ? `${tender.currency}` : ''}
                                    {tender.costEstimate ? `${tender.costEstimate.min} - ${tender.costEstimate.max}` : 'N/A'}
                                  </span>
                                </div>
                                <div className="flex items-center text-gray-500 mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span className="text-gray-500">{new Date(tender.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                <Link href={`/contractor/bid/${tender._id}`}>Place Bid</Link>
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
                <CardDescription>Projects you have bid on</CardDescription>
              </CardHeader>
              <CardContent>
                {activeBidsLoading ? (
                  <div className="text-center text-gray-500">Loading active projects...</div>
                ) : activeBids.length === 0 ? (
                  <div className="text-center text-gray-500">No active projects yet.</div>
                ) : (
                  <div className="space-y-4">
                    {activeBids.map((item) => (
                      <div
                        key={item._id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{item.report?.title || 'Unknown Project'}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{item.report?.location}</span>
                            </div>
                            <div className="mt-3 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Your Bid</span>
                                <span className="font-medium">{item.report?.currency || '$'}{item.amount}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Budget</span>
                                <span className="font-medium">{item.report?.currency || '$'}{item.report?.costEstimate?.min} - {item.report?.currency || '$'}{item.report?.costEstimate?.max}</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <span className="text-xs text-gray-500">Progress: {item.progress || 0}%</span>
                              <div className="flex items-center gap-2 mt-2">
                                <Slider
                                  value={[item.progress || 0]}
                                  min={0}
                                  max={100}
                                  step={1}
                                  onValueChange={(value) => {
                                    const newProgress = value[0];
                                    setActiveBids((prev) => prev.map((b) => b._id === item._id ? { ...b, progress: newProgress } : b));
                                  }}
                                  className="flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  className="bg-teal-600 hover:bg-teal-700"
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`/api/bids/${item._id}/progress`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ progress: item.progress })
                                      });
                                      
                                      if (!response.ok) {
                                        throw new Error('Failed to update progress');
                                      }
                                      
                                      const data = await response.json();
                                      
                                      setActiveBids((prev) => prev.map((b) => {
                                        if (b._id === item._id) {
                                          return { 
                                            ...b, 
                                            progress: item.progress,
                                            report: data.report 
                                          };
                                        }
                                        return b;
                                      }));

                                      setSuccessModal({ 
                                        open: true, 
                                        message: `Progress updated to ${item.progress}% successfully!` 
                                      });
                                    } catch (error) {
                                      console.error('Error updating progress:', error);
                                      setActiveBids((prev) => prev.map((b) => b._id === item._id ? { ...b, progress: item.progress } : b));
                                    }
                                  }}
                                >
                                  Update
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Created: {item.report ? new Date(item.report.createdAt).toLocaleDateString() : '-'}</span>
                            </div>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => setDetailsModal({ open: true, project: item.report })}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  {activeBids.length === 0 ? (
                    <div className="text-center text-gray-500">No upcoming deadlines</div>
                  ) : (
                    activeBids.map((item) => (
                      <div
                        key={item._id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">Progress Update</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Project: {item.report?.title || 'Unknown Project'}</p>
                        <div className="flex items-center text-xs font-medium">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-gray-500">Due: {new Date(item.report?.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
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

      <Dialog open={detailsModal.open} onOpenChange={open => setDetailsModal({ open, project: open ? detailsModal.project : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>Read-only details for this project</DialogDescription>
          </DialogHeader>
          {detailsModal.project && (
            <div className="space-y-2">
              <div><span className="font-medium">Title:</span> {detailsModal.project.title}</div>
              <div><span className="font-medium">Description:</span> {detailsModal.project.description}</div>
              <div><span className="font-medium">Country:</span> {detailsModal.project.country}</div>
              <div><span className="font-medium">Location:</span> {detailsModal.project.location}</div>
              <div><span className="font-medium">Budget:</span> {detailsModal.project.currency || '$'}{detailsModal.project.costEstimate?.min} - {detailsModal.project.currency || '$'}{detailsModal.project.costEstimate?.max}</div>
              <div><span className="font-medium">Created At:</span> {new Date(detailsModal.project.createdAt).toLocaleDateString()}</div>
              <div><span className="font-medium">Last Updated:</span> {new Date(detailsModal.project.updatedAt).toLocaleDateString()}</div>
              {detailsModal.project.imageUrl && (
                <img src={detailsModal.project.imageUrl} alt="Project" className="w-full h-48 object-cover rounded mt-2" />
              )}
            </div>
          )}
          <DialogClose asChild>
            <Button className="mt-4 w-full">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successModal.open} onOpenChange={(open) => setSuccessModal({ ...successModal, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Success
            </DialogTitle>
            <DialogDescription>
              {successModal.message}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => setSuccessModal({ open: false, message: '' })}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
