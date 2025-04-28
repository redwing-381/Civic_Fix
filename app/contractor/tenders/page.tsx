"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Search,
  Timer,
  Loader2,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
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
}

export default function TendersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredTenders = tenders.filter((tender) =>
    tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Available Tenders</h1>
              <p className="text-gray-500">Browse and bid on available projects</p>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tenders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredTenders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tenders found matching your search criteria.
                </div>
              ) : (
                filteredTenders.map((tender) => (
                  <Card key={tender.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-800">{tender.title}</h3>
                            {tender.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{tender.description}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 mt-2">
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
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 