"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, AlertTriangle, CheckCircle2, Loader2, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"

interface IssueCardProps {
  title: string
  description: string
  location: string
  status: "urgent" | "pending" | "in-progress" | "bidding" | "completed"
  daysAgo: number
  progress: number
  id?: string
  imageUrl?: string | null
  country?: string
  createdAt?: string
  updatedAt?: string
  costEstimate?: {
    min: number
    max: number
  }
  currency?: string
}

export function IssueCard({ 
  title, 
  description, 
  location, 
  status, 
  daysAgo, 
  progress, 
  id = "1", 
  imageUrl,
  country,
  createdAt,
  updatedAt,
  costEstimate,
  currency
}: IssueCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Log the received progress value
  console.log(`IssueCard ${title} received progress:`, progress);

  const getStatusDetails = () => {
    switch (status) {
      case "urgent":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: "Urgent",
          color: "text-red-500 bg-red-50",
        }
      case "pending":
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Pending",
          color: "text-amber-500 bg-amber-50",
        }
      case "in-progress":
        return {
          icon: <Loader2 className="h-4 w-4" />,
          label: "In Progress",
          color: "text-blue-500 bg-blue-50",
        }
      case "bidding":
        return {
          icon: <Loader2 className="h-4 w-4" />,
          label: "Bidding",
          color: "text-purple-500 bg-purple-50",
        }
      case "completed":
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: "Completed",
          color: "text-green-500 bg-green-50",
        }
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Pending",
          color: "text-gray-500 bg-gray-50",
        }
    }
  }

  const statusDetails = getStatusDetails()

  // Ensure progress is a number between 0 and 100
  const normalizedProgress = Math.min(Math.max(Number(progress) || 0, 0), 100);
  console.log(`IssueCard ${title} normalized progress:`, normalizedProgress);

  return (
    <>
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
        <Card className="h-full flex flex-col">
          <div className="h-40 bg-gray-100 relative">
            <img
              src={imageUrl || "/placeholder.svg?height=160&width=320"}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute top-2 right-2 ${statusDetails.color} flex items-center gap-1 py-1 px-2 rounded-full text-xs font-medium`}
            >
              {statusDetails.icon}
              {statusDetails.label}
            </div>
          </div>
          <CardContent className="flex-1 pt-4">
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
            <div className="flex items-center text-gray-500 text-xs mb-3">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{normalizedProgress}%</span>
              </div>
              <Progress value={normalizedProgress} className="h-1.5" />
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {daysAgo} {daysAgo === 1 ? "day" : "days"} ago
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-teal-600 hover:text-teal-700 p-0"
              onClick={() => setShowDetails(true)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className={`${statusDetails.color} px-2 py-1 rounded-full flex items-center gap-1`}>
                    {statusDetails.icon}
                    <span>{statusDetails.label}</span>
                  </div>
                  <span>•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {imageUrl && (
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                <p className="text-sm text-gray-600">{description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Location Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Country</span>
                      <span className="font-medium">{country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location</span>
                      <span className="font-medium">{location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Budget Information</h4>
                  <div className="space-y-2 text-sm">
                    {costEstimate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estimated Cost</span>
                        <span className="font-medium">
                          {currency || '$'}{costEstimate.min} - {currency || '$'}{costEstimate.max}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Current Progress</span>
                    <span className="font-medium">{normalizedProgress}%</span>
                  </div>
                  <Progress value={normalizedProgress} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {createdAt ? new Date(createdAt).toLocaleDateString() : '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Updated: {updatedAt ? new Date(updatedAt).toLocaleDateString() : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
