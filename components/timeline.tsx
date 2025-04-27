"use client"

import { motion } from "framer-motion"
import type React from "react"

interface TimelineItem {
  date: string
  time: string
  title: string
  description: string
  icon: React.ReactNode
}

interface TimelineProps {
  items: TimelineItem[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative pl-10"
          >
            <div className="absolute left-0 top-1 bg-white p-1.5 rounded-full border-2 border-teal-500">
              <div className="bg-teal-100 p-1 rounded-full text-teal-600">{item.icon}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="font-medium text-gray-800">{item.title}</h3>
                <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                  {item.date} at {item.time}
                </div>
              </div>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
