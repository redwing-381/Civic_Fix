"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

export function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="bg-teal-50 p-2 rounded-md">{icon}</div>
          <div
            className={`flex items-center text-xs font-medium ${
              trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"
            }`}
          >
            {trend === "up" && <ArrowUp className="h-3 w-3 mr-1" />}
            {trend === "down" && <ArrowDown className="h-3 w-3 mr-1" />}
            {change}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <motion.p
            className="text-2xl font-bold text-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.p>
        </div>
      </CardContent>
    </Card>
  )
}
