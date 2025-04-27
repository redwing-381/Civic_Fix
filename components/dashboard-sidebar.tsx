"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { FileText, Home, LogOut, MessageSquare, PieChart, Settings, PenToolIcon as Tool, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  const isMobile = useMobile()

  const sidebarItems = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/dashboard" },
    { icon: <FileText className="h-5 w-5" />, label: "My Reports", href: "/dashboard?tab=my-reports" },
    { icon: <Tool className="h-5 w-5" />, label: "Contractors", href: "/contractor/dashboard" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Messages", href: "/dashboard?tab=messages" },
    { icon: <PieChart className="h-5 w-5" />, label: "Analytics", href: "/analytics" },
    { icon: <User className="h-5 w-5" />, label: "Profile", href: "/dashboard?tab=profile" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/dashboard?tab=settings" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}

      <AnimatePresence>
        {(open || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2 }}
            className={`fixed md:sticky top-0 left-0 z-50 h-full w-64 bg-white border-r flex flex-col`}
          >
            <div className="h-16 border-b flex items-center px-4">
              <div className="flex items-center gap-2">
                <Tool className="h-6 w-6 text-teal-600" />
                <h1 className="text-xl font-bold text-teal-700">CivicFix</h1>
              </div>
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="ml-auto">
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="flex-1 py-4 overflow-auto">
              <div className="px-3 mb-6">
                <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                  <Link href="/report">
                    <FileText className="h-4 w-4 mr-2" />
                    Report an Issue
                  </Link>
                </Button>
              </div>

              <nav>
                <ul className="space-y-1 px-2">
                  {sidebarItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 ${
                          index === 0 ? "bg-gray-100 font-medium" : ""
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="p-4 border-t">
              <Link
                href="/login"
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
