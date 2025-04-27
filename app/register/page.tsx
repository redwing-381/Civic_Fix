"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/ui/file-upload"
import { PenToolIcon as Tool, ArrowLeft, CheckCircle2, User, Building2, Landmark } from "lucide-react"

export default function Register() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState("citizen")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [licenseDoc, setLicenseDoc] = useState<File | null>(null)
  const [portfolio, setPortfolio] = useState<File | null>(null)
  const [idCard, setIdCard] = useState<File | null>(null)
  const [authorization, setAuthorization] = useState<File | null>(null)

  const handleProfileImageSelect = (file: File) => {
    setProfileImage(file)
  }

  const handleLicenseDocSelect = (file: File) => {
    setLicenseDoc(file)
  }

  const handlePortfolioSelect = (file: File) => {
    setPortfolio(file)
  }

  const handleIdCardSelect = (file: File) => {
    setIdCard(file)
  }

  const handleAuthorizationSelect = (file: File) => {
    setAuthorization(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }, 1500)
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col">
      <header className="container mx-auto py-6 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-teal-700 hover:text-teal-600 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 container mx-auto flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Tool className="h-8 w-8 text-teal-600" />
            </div>
          </div>

          {isSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-6">Your account has been created successfully.</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </motion.div>
          ) : (
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Join CivicFix to report and track civic issues</CardDescription>
              </CardHeader>

              <CardContent>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Tabs defaultValue="citizen" onValueChange={(value) => setUserType(value)} className="w-full">
                      <TabsList className="h-20 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-3 mb-6">
                        <TabsTrigger value="citizen" className="flex flex-col items-center py-3 gap-2">
                          <User className="h-5 w-5" />
                          <span>Citizen</span>
                        </TabsTrigger>
                        <TabsTrigger value="contractor" className="flex flex-col items-center py-3 gap-2">
                          <Building2 className="h-5 w-5" />
                          <span>Contractor</span>
                        </TabsTrigger>
                        <TabsTrigger value="official" className="flex flex-col items-center py-3 gap-2">
                          <Landmark className="h-5 w-5" />
                          <span>Official</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="citizen">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="citizen-email">Email</Label>
                            <Input id="citizen-email" type="email" placeholder="your.email@example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="citizen-phone">Phone Number</Label>
                            <Input id="citizen-phone" type="tel" placeholder="+1 (555) 000-0000" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="citizen-password">Password</Label>
                            <Input id="citizen-password" type="password" />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="contractor">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input id="company-name" placeholder="Your Company Name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="business-email">Business Email</Label>
                            <Input id="business-email" type="email" placeholder="business@example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="business-phone">Business Phone</Label>
                            <Input id="business-phone" type="tel" placeholder="+1 (555) 000-0000" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contractor-password">Password</Label>
                            <Input id="contractor-password" type="password" />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="official">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="official-email">Government Email</Label>
                            <Input id="official-email" type="email" placeholder="name@gov.example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" placeholder="e.g., Public Works" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="employee-id">Employee ID</Label>
                            <Input id="employee-id" placeholder="Your government ID" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="official-password">Password</Label>
                            <Input id="official-password" type="password" />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-lg text-gray-800 mb-2">Personal Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" placeholder="Your full name" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Your city" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input id="state" placeholder="Your state" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="Your address" />
                    </div>

                    {userType === "contractor" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="license">Business License Number</Label>
                          <Input id="license" placeholder="Your business license" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-id">Tax ID / EIN</Label>
                          <Input id="tax-id" placeholder="Your tax ID" />
                        </div>
                      </>
                    )}

                    {userType === "official" && (
                      <div className="space-y-2">
                        <Label htmlFor="position">Position/Title</Label>
                        <Input id="position" placeholder="Your position" />
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {userType === "citizen" && (
                      <div className="space-y-2">
                        <FileUpload
                          onFileSelect={handleProfileImageSelect}
                          maxSize={2 * 1024 * 1024} // 2MB
                          accept={["image/*"]}
                          label="Profile Photo (Optional)"
                          description="Click to upload or drag and drop"
                        />
                      </div>
                    )}

                    {userType === "contractor" && (
                      <>
                        <div className="space-y-2">
                          <FileUpload
                            onFileSelect={handleLicenseDocSelect}
                            maxSize={5 * 1024 * 1024} // 5MB
                            accept={["application/pdf", "image/*"]}
                            label="Business License Document"
                            description="Click to upload or drag and drop"
                          />
                        </div>

                        <div className="space-y-2">
                          <FileUpload
                            onFileSelect={handlePortfolioSelect}
                            maxSize={10 * 1024 * 1024} // 10MB
                            accept={["application/pdf", "image/*"]}
                            label="Past Work Portfolio (Optional)"
                            description="Click to upload or drag and drop"
                          />
                        </div>
                      </>
                    )}

                    {userType === "official" && (
                      <>
                        <div className="space-y-2">
                          <FileUpload
                            onFileSelect={handleIdCardSelect}
                            maxSize={5 * 1024 * 1024} // 5MB
                            accept={["application/pdf", "image/*"]}
                            label="Government ID Card"
                            description="Click to upload or drag and drop"
                          />
                        </div>

                        <div className="space-y-2">
                          <FileUpload
                            onFileSelect={handleAuthorizationSelect}
                            maxSize={5 * 1024 * 1024} // 5MB
                            accept={["application/pdf"]}
                            label="Authorization Letter"
                            description="Click to upload or drag and drop"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="terms"
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                          I agree to the{" "}
                          <a href="#" className="text-teal-600 hover:text-teal-500">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-teal-600 hover:text-teal-500">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                  Back
                </Button>

                {step < 3 ? (
                  <Button onClick={handleNext}>Next</Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2"
                        >
                          <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-teal-600 hover:text-teal-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
