"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MapPin, Search, SlidersHorizontal } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { IssueCard } from "@/components/issue-card"

export default function ExplorePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [distance, setDistance] = useState([5])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Explore Issues</h1>
              <p className="text-gray-500">Browse and discover civic issues in your community</p>
            </div>

            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search issues..." className="pl-10" />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 md:max-w-[200px]">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Location..." className="pl-10" />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="road">Road Damage</SelectItem>
                          <SelectItem value="water">Water & Drainage</SelectItem>
                          <SelectItem value="electrical">Electrical Issues</SelectItem>
                          <SelectItem value="sanitation">Sanitation & Waste</SelectItem>
                          <SelectItem value="public">Public Property</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="bidding">Bidding</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Most Recent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="urgent">Urgency</SelectItem>
                          <SelectItem value="nearby">Nearest</SelectItem>
                          <SelectItem value="progress">Progress</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Distance (within {distance} miles)
                      </label>
                      <Slider
                        defaultValue={[5]}
                        max={50}
                        step={1}
                        onValueChange={(value) => setDistance(value)}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1 mile</span>
                        <span>25 miles</span>
                        <span>50 miles</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" className="mr-2">
                      Reset
                    </Button>
                    <Button>Apply Filters</Button>
                  </div>
                </div>
              )}
            </div>

            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Issues</TabsTrigger>
                <TabsTrigger value="urgent">Urgent</TabsTrigger>
                <TabsTrigger value="nearby">Nearby</TabsTrigger>
                <TabsTrigger value="recent">Recently Added</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <IssueCard
                    title="Broken Water Main"
                    description="Water leaking onto the street causing traffic hazards"
                    location="123 Main St, Downtown"
                    status="urgent"
                    daysAgo={1}
                    progress={15}
                    id="1"
                  />
                  <IssueCard
                    title="Pothole Damage"
                    description="Large pothole causing vehicle damage"
                    location="456 Oak Ave, Westside"
                    status="in-progress"
                    daysAgo={3}
                    progress={45}
                    id="2"
                  />
                  <IssueCard
                    title="Fallen Tree"
                    description="Tree blocking sidewalk after storm"
                    location="789 Pine St, Northside"
                    status="bidding"
                    daysAgo={2}
                    progress={30}
                    id="3"
                  />
                  <IssueCard
                    title="Street Light Out"
                    description="Street light not working for past week"
                    location="101 Elm St, Eastside"
                    status="pending"
                    daysAgo={5}
                    progress={10}
                    id="4"
                  />
                  <IssueCard
                    title="Graffiti Removal"
                    description="Offensive graffiti on public building"
                    location="202 Maple Dr, Southside"
                    status="completed"
                    daysAgo={7}
                    progress={100}
                    id="5"
                  />
                  <IssueCard
                    title="Damaged Guardrail"
                    description="Guardrail damaged in accident"
                    location="303 Cedar Ln, Highway 101"
                    status="in-progress"
                    daysAgo={4}
                    progress={60}
                    id="6"
                  />
                  <IssueCard
                    title="Sidewalk Crack"
                    description="Large crack in sidewalk creating tripping hazard"
                    location="404 Birch Blvd, Westside"
                    status="pending"
                    daysAgo={6}
                    progress={5}
                    id="7"
                  />
                  <IssueCard
                    title="Playground Equipment"
                    description="Damaged swing set in city park"
                    location="505 Park Ave, Downtown"
                    status="bidding"
                    daysAgo={3}
                    progress={25}
                    id="8"
                  />
                  <IssueCard
                    title="Traffic Signal Malfunction"
                    description="Traffic light stuck on red in all directions"
                    location="606 Junction Rd, Northside"
                    status="urgent"
                    daysAgo={0}
                    progress={10}
                    id="9"
                  />
                </div>
              </TabsContent>

              <TabsContent value="urgent">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <IssueCard
                    title="Broken Water Main"
                    description="Water leaking onto the street causing traffic hazards"
                    location="123 Main St, Downtown"
                    status="urgent"
                    daysAgo={1}
                    progress={15}
                    id="1"
                  />
                  <IssueCard
                    title="Traffic Signal Malfunction"
                    description="Traffic light stuck on red in all directions"
                    location="606 Junction Rd, Northside"
                    status="urgent"
                    daysAgo={0}
                    progress={10}
                    id="9"
                  />
                  <IssueCard
                    title="Gas Leak Suspected"
                    description="Strong smell of gas in residential area"
                    location="505 Birch St, Westside"
                    status="urgent"
                    daysAgo={0}
                    progress={5}
                    id="10"
                  />
                </div>
              </TabsContent>

              <TabsContent value="nearby">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <IssueCard
                    title="Pothole Damage"
                    description="Large pothole causing vehicle damage"
                    location="456 Oak Ave, Westside"
                    status="in-progress"
                    daysAgo={3}
                    progress={45}
                    id="2"
                  />
                  <IssueCard
                    title="Street Light Out"
                    description="Street light not working for past week"
                    location="101 Elm St, Eastside"
                    status="pending"
                    daysAgo={5}
                    progress={10}
                    id="4"
                  />
                  <IssueCard
                    title="Sidewalk Crack"
                    description="Large crack in sidewalk creating tripping hazard"
                    location="404 Birch Blvd, Westside"
                    status="pending"
                    daysAgo={6}
                    progress={5}
                    id="7"
                  />
                </div>
              </TabsContent>

              <TabsContent value="recent">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <IssueCard
                    title="Traffic Signal Malfunction"
                    description="Traffic light stuck on red in all directions"
                    location="606 Junction Rd, Northside"
                    status="urgent"
                    daysAgo={0}
                    progress={10}
                    id="9"
                  />
                  <IssueCard
                    title="Gas Leak Suspected"
                    description="Strong smell of gas in residential area"
                    location="505 Birch St, Westside"
                    status="urgent"
                    daysAgo={0}
                    progress={5}
                    id="10"
                  />
                  <IssueCard
                    title="Broken Water Main"
                    description="Water leaking onto the street causing traffic hazards"
                    location="123 Main St, Downtown"
                    status="urgent"
                    daysAgo={1}
                    progress={15}
                    id="1"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center">
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-teal-50">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
