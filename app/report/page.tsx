"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Camera, MapPin, X, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function ReportIssue() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [images, setImages] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [isLocating, setIsLocating] = useState(false)
  const [severity, setSeverity] = useState(50)

  const handleAddImage = () => {
    // In a real app, this would handle file uploads
    const newImage = `/placeholder.svg?height=200&width=200&text=Image+${images.length + 1}`
    setImages([...images, newImage])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleGetLocation = () => {
    setIsLocating(true)
    // Simulate geolocation
    setTimeout(() => {
      setLocation("123 Main Street, Downtown")
      setIsLocating(false)
    }, 1500)
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Submit form
      router.push("/dashboard?success=true")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={false} setOpen={() => {}} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={() => {}} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-gray-500 mb-2"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Report an Issue</h1>
              <p className="text-gray-500">Help improve your community by reporting infrastructure problems</p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center relative">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step >= i ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {i}
                    </div>
                    <span className="text-xs mt-1 text-gray-500">
                      {i === 1 && "Details"}
                      {i === 2 && "Location"}
                      {i === 3 && "Category"}
                      {i === 4 && "Review"}
                    </span>
                  </div>
                ))}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-0">
                  <motion.div
                    className="h-full bg-teal-600"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(step - 1) * 33.33}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 && "Issue Details"}
                  {step === 2 && "Location Information"}
                  {step === 3 && "Categorize & Prioritize"}
                  {step === 4 && "Review & Submit"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Provide details and photos of the issue"}
                  {step === 2 && "Help us locate the exact position of the issue"}
                  {step === 3 && "Select the appropriate category and severity"}
                  {step === 4 && "Review your report before submission"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="title">Issue Title</Label>
                      <Input id="title" placeholder="e.g., Pothole on Main Street" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the issue in detail..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Photos</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((img, index) => (
                          <div key={index} className="relative rounded-md overflow-hidden h-24 bg-gray-100">
                            <img
                              src={img || "/placeholder.svg"}
                              alt={`Issue ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {images.length < 5 && (
                          <button
                            onClick={handleAddImage}
                            className="h-24 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                          >
                            <Camera className="h-6 w-6 mb-1" />
                            <span className="text-xs">Add Photo</span>
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Add up to 5 photos of the issue</p>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          placeholder="Address or landmark"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating}>
                          {isLocating ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <MapPin className="h-4 w-4 mr-1" />
                            </motion.div>
                          ) : (
                            <MapPin className="h-4 w-4 mr-1" />
                          )}
                          {isLocating ? "Locating..." : "Get Location"}
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-md overflow-hidden border border-gray-200 h-[300px] bg-gray-100 flex items-center justify-center">
                      <div className="text-center p-4">
                        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          {location ? `Map showing: ${location}` : "Map will appear here"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="landmark">Nearby Landmark (Optional)</Label>
                      <Input id="landmark" placeholder="e.g., Next to City Park" />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="category">Issue Category</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="road">Road Damage</SelectItem>
                          <SelectItem value="water">Water & Drainage</SelectItem>
                          <SelectItem value="electricity">Electrical Issues</SelectItem>
                          <SelectItem value="sanitation">Sanitation & Waste</SelectItem>
                          <SelectItem value="public">Public Property Damage</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select>
                        <SelectTrigger id="subcategory">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pothole">Pothole</SelectItem>
                          <SelectItem value="crack">Road Crack</SelectItem>
                          <SelectItem value="sinkhole">Sinkhole</SelectItem>
                          <SelectItem value="debris">Road Debris</SelectItem>
                          <SelectItem value="marking">Faded Road Marking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="severity">Severity Level</Label>
                        <span className="text-sm text-gray-500">
                          {severity < 30 && "Low"}
                          {severity >= 30 && severity < 70 && "Medium"}
                          {severity >= 70 && "High"}
                        </span>
                      </div>
                      <Slider
                        id="severity"
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        onValueChange={(value) => setSeverity(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Minor issue</span>
                        <span>Urgent hazard</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">Please Review Carefully</h4>
                        <p className="text-sm text-amber-700">
                          Ensure all information is accurate. False reports may result in penalties.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 divide-y">
                      <div className="pt-2">
                        <h3 className="text-sm font-medium text-gray-500">Issue Details</h3>
                        <p className="font-medium">Pothole on Main Street</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Large pothole approximately 2 feet wide causing traffic hazards and potential vehicle damage.
                        </p>

                        {images.length > 0 && (
                          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                            {images.map((img, index) => (
                              <img
                                key={index}
                                src={img || "/placeholder.svg"}
                                alt={`Issue ${index + 1}`}
                                className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="py-2">
                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                        <p className="font-medium">{location || "123 Main Street, Downtown"}</p>
                        <p className="text-sm text-gray-600 mt-1">Near City Park entrance</p>
                      </div>

                      <div className="py-2">
                        <h3 className="text-sm font-medium text-gray-500">Category & Severity</h3>
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Road Damage - Pothole</p>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              severity < 30
                                ? "bg-green-100 text-green-800"
                                : severity < 70
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {severity < 30 && "Low Severity"}
                            {severity >= 30 && severity < 70 && "Medium Severity"}
                            {severity >= 70 && "High Severity"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Label htmlFor="additional" className="text-sm font-medium text-gray-500">
                        Additional Comments (Optional)
                      </Label>
                      <Textarea id="additional" placeholder="Any final details you'd like to add..." className="mt-1" />
                    </div>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Button onClick={handleNext}>
                  {step < 4 ? (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
