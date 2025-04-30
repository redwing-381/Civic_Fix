"use client"

import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import ThemeToggle from './theme-toggle'

interface DashboardHeaderProps {
  setSidebarOpen: (open: boolean) => void
}

export function DashboardHeader({ setSidebarOpen }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b bg-white flex items-center px-4 sticky top-0 z-30">
      <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1 flex items-center ml-4 md:ml-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search issues..." className="pl-9 bg-gray-50 border-gray-200 focus:bg-white" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              {
                title: "Your report has been approved",
                description: "Pothole on Main Street is now in bidding phase",
                time: "2 hours ago",
              },
              {
                title: "Contractor assigned",
                description: "ABC Construction will fix the broken water main",
                time: "Yesterday",
              },
              {
                title: "Work completed",
                description: "Graffiti removal has been marked as complete",
                time: "3 days ago",
              },
            ].map((notification, index) => (
              <DropdownMenuItem key={index} className="cursor-pointer py-3">
                <div>
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center text-sm font-medium text-teal-600">
              <Link href="/dashboard?tab=notifications" className="w-full text-center">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard?tab=profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard?tab=settings" className="w-full">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard?tab=my-reports" className="w-full">
                My Reports
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/login" className="w-full">
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
