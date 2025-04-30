import { useState, useEffect } from "react"
import { Report } from "@/types"
import { API_ENDPOINTS } from "@/lib/constants"

/**
 * Options for the useReports hook
 */
interface UseReportsOptions {
  initialReports?: Report[]      // Initial reports to display before fetching
  limit?: number                 // Maximum number of reports to fetch
  status?: Report["status"]      // Filter reports by status
}

/**
 * Custom hook for fetching and managing reports
 * @param options - Hook configuration options
 * @returns Object containing reports, loading state, error state, and refetch function
 */
export function useReports({ initialReports = [], limit, status }: UseReportsOptions = {}) {
  // State management
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [loading, setLoading] = useState(!initialReports.length)
  const [error, setError] = useState<string | null>(null)

  // Fetch reports when dependencies change
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build URL with query parameters
        let url = API_ENDPOINTS.REPORTS
        const queryParams = new URLSearchParams()
        
        if (limit) queryParams.append("limit", limit.toString())
        if (status) queryParams.append("status", status)
        
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`
        }

        // Fetch reports
        const response = await fetch(url)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch reports")
        }

        const data = await response.json()
        setReports(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch reports")
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if no initial reports provided
    if (!initialReports.length) {
      fetchReports()
    }
  }, [initialReports.length, limit, status])

  /**
   * Refetch reports from the server
   */
  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.REPORTS)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch reports")
      }

      const data = await response.json()
      setReports(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch reports")
    } finally {
      setLoading(false)
    }
  }

  return {
    reports,
    loading,
    error,
    refetch,
  }
} 