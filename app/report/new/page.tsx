"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ImageIcon, Upload, X } from "lucide-react"

export default function NewReport() {
  const router = useRouter()
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    image: null as File | null,
    imagePreview: "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      })
    }
  }

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    formDataToSend.append("title", formData.title)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("location", formData.location)
    if (formData.image) {
      formDataToSend.append("image", formData.image)
    }

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to submit report")
      }

      router.push("/report")
    } catch (error) {
      console.error("Error submitting report:", error)
      // TODO: Add error handling UI
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">New Report</h1>
              <p className="text-gray-500">Report a new issue in your community</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>Fill in the details of the issue you want to report</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the issue"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="location"
                    placeholder="Where is the issue located?"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload an image</p>
                      <p className="text-xs text-gray-400">or drag and drop</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/report">Cancel</Link>
                </Button>
                <Button type="submit">Submit Report</Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
} 