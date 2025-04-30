"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface RatingSystemProps {
  reportId: string
  userId: string
  currentRating?: number
  currentComment?: string
  onRatingSubmit?: () => void
}

export function RatingSystem({
  reportId,
  userId,
  currentRating,
  currentComment,
  onRatingSubmit
}: RatingSystemProps) {
  const [rating, setRating] = useState(currentRating || 0)
  const [comment, setComment] = useState(currentComment || "")
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!rating) {
      setError("Please select a rating")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/reports", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId,
          userId,
          rating,
          comment: comment.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit rating")
      }

      setSuccess(true)
      if (onRatingSubmit) {
        onRatingSubmit()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit rating")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={`h-6 w-6 ${
                (hover || rating) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Add a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your rating has been submitted!</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading || success}
        className="w-full"
      >
        {loading ? "Submitting..." : success ? "Submitted" : "Submit Rating"}
      </Button>
    </div>
  )
} 