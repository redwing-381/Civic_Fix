"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, AlertTriangle, CheckCircle2, Loader2, Calendar, DollarSign, Star } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { RatingSystem } from "@/components/rating-system"
import { Report, Rating, StatusDetails } from "@/types"
import { STATUS_COLORS, DEFAULT_IMAGE } from "@/lib/constants"
import { calculateAverageRating, getDaysAgo, normalizeProgress, formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

/**
 * Props for the IssueCard component
 */
interface IssueCardProps {
  title: string
  description: string
  location: string
  status: Report["status"]
  daysAgo: number
  progress: number
  id?: string
  imageUrl?: string | null
  country?: string
  createdAt?: string
  updatedAt?: string
  costEstimate?: Report["costEstimate"]
  currency?: string
  ratings?: Rating[]
  currentUserId?: string
  onRatingSubmit?: () => void
  canRate?: boolean
  className?: string
  descriptionClassName?: string
  locationClassName?: string
  linkClassName?: string
}

/**
 * Component for displaying an issue report card
 * Shows issue details, status, progress, and allows rating
 */
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
  currency,
  ratings = [],
  currentUserId,
  onRatingSubmit,
  canRate,
  className,
  descriptionClassName,
  locationClassName,
  linkClassName
}: IssueCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const averageRating = calculateAverageRating(ratings);
  const userRating = currentUserId ? ratings.find(r => r.userId === currentUserId) : null;
  const normalizedProgress = normalizeProgress(progress);

  const getStatusDetails = (): StatusDetails => {
    const statusConfig = {
      urgent: {
        icon: <AlertTriangle className="h-4 w-4" />,
        label: "Urgent",
        color: STATUS_COLORS.urgent,
      },
      pending: {
        icon: <Clock className="h-4 w-4" />,
        label: "Pending",
        color: STATUS_COLORS.pending,
      },
      "in-progress": {
        icon: <Loader2 className="h-4 w-4" />,
        label: "In Progress",
        color: STATUS_COLORS["in-progress"],
      },
      bidding: {
        icon: <Loader2 className="h-4 w-4" />,
        label: "Bidding",
        color: STATUS_COLORS.bidding,
      },
      completed: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: "Completed",
        color: STATUS_COLORS.completed,
      },
    };

    return statusConfig[status] || statusConfig.pending;
  }

  const statusDetails = getStatusDetails();

  return (
    <>
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
        <Card className={cn("h-full flex flex-col", className)}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                {title}
              </CardTitle>
              <Badge
                variant="secondary"
                className={cn(
                  statusDetails.color,
                  "px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-md",
                  status === "in-progress"
                    ? "bg-gradient-to-r from-blue-100 to-blue-50 border-0 text-blue-700"
                    : status === "pending"
                    ? "bg-gradient-to-r from-yellow-100 to-yellow-50 border-0 text-yellow-700"
                    : status === "completed"
                    ? "bg-gradient-to-r from-green-100 to-green-50 border-0 text-green-700"
                    : status === "urgent"
                    ? "bg-gradient-to-r from-red-100 to-red-50 border-0 text-red-700"
                    : "bg-gradient-to-r from-gray-100 to-gray-50 border-0 text-gray-700",
                  "transition-transform duration-150 hover:scale-105"
                )}
                style={{ minWidth: 110, justifyContent: 'center' }}
              >
                <span className="mr-1 flex items-center">{statusDetails.icon}</span>
                {statusDetails.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            <p className={`text-sm text-gray-600 mb-2 line-clamp-2 ${descriptionClassName}`}>{description}</p>
            <div className={`flex items-center text-gray-500 text-xs mb-3 ${locationClassName}`}>
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
              className={`text-teal-600 hover:text-teal-700 p-0 ${linkClassName}`}
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
                          {formatCurrency(costEstimate.min, currency)} - {formatCurrency(costEstimate.max, currency)}
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

              {averageRating !== null && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Ratings</h4>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium">{averageRating}</span>
                    <span className="text-sm text-gray-500">({ratings.length} ratings)</span>
                  </div>
                </div>
              )}

              {canRate && !userRating && (
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRating(true)}
                  >
                    Rate This Issue
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showRating && currentUserId && (
        <RatingSystem
          reportId={id}
          userId={currentUserId}
          onRatingSubmit={() => {
            setShowRating(false);
            onRatingSubmit?.();
          }}
        />
      )}
    </>
  )
}
