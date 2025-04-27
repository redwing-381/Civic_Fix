"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface IssueCardProps {
  title: string
  description: string
  location: string
  status: "urgent" | "pending" | "in-progress" | "bidding" | "completed"
  daysAgo: number
  progress: number
  id?: string
}

export function IssueCard({ title, description, location, status, daysAgo, progress, id = "1" }: IssueCardProps) {
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

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="h-full flex flex-col">
        <div className="h-40 bg-gray-100 relative">
          <img src="/placeholder.svg?height=160&width=320" alt={title} className="w-full h-full object-cover" />
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
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {daysAgo} {daysAgo === 1 ? "day" : "days"} ago
          </span>
          <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 p-0">
            <Link href={`/issue/${id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
