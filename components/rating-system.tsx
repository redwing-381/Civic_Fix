"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { submitRating } from "@/lib/api"

/**
 * Props for the RatingSystem component
 */
interface RatingSystemProps {
  reportId: string                // ID of the report being rated
  userId: string                  // ID of the user submitting the rating
  currentRating?: number          // Current rating if editing
  currentComment?: string         // Current comment if editing
  onRatingSubmit?: () => void     // Callback when rating is submitted
}

/**
 * Component for submitting and displaying ratings
 * Allows users to rate issues and provide optional comments
 */
export function RatingSystem({
  reportId,
  userId,
  currentRating,
  currentComment,
  onRatingSubmit
}: RatingSystemProps) {
  // State management
  const [rating, setRating] = useState(currentRating || 0)
  const [comment, setComment] = useState(currentComment || "")
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  /**
   * Handles the submission of a rating
   * Validates the rating and submits to the server
   */
  const handleSubmit = async () => {
    // Validate rating
    if (!rating) {
      setError("Please select a rating")
      return
    }

    setLoading(true)
    setError(null)

    // Submit rating to server
    const { error: submitError } = await submitRating(
      reportId,
      userId,
      rating,
      comment.trim()
    )

    if (submitError) {
      setError(submitError)
    } else {
      setSuccess(true)
      onRatingSubmit?.()
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Star rating input */}
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

      {/* Comment input */}
      <Textarea
        placeholder="Add a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your rating has been submitted!</AlertDescription>
        </Alert>
      )}

      {/* Submit button */}
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