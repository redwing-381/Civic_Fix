import { API_ENDPOINTS } from "@/lib/constants"

/**
 * Generic API response type
 */
interface ApiResponse<T> {
  data?: T
  error?: string
}

/**
 * Generic API fetch function with error handling
 * @param endpoint - API endpoint URL
 * @param options - Fetch options
 * @returns Promise with API response data or error
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Request failed")
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

/**
 * Fetches reports with optional filtering
 * @param params - Optional query parameters
 * @param params.limit - Maximum number of reports to fetch
 * @param params.status - Filter reports by status
 * @returns Promise with reports data or error
 */
export async function getReports(params?: {
  limit?: number
  status?: string
}): Promise<ApiResponse<any[]>> {
  let url = API_ENDPOINTS.REPORTS
  if (params) {
    const queryParams = new URLSearchParams()
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.status) queryParams.append("status", params.status)
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`
    }
  }
  return fetchApi<any[]>(url)
}

/**
 * Submits a rating for a report
 * @param reportId - ID of the report being rated
 * @param userId - ID of the user submitting the rating
 * @param rating - Numeric rating value (1-5)
 * @param comment - Optional comment with the rating
 * @returns Promise with success or error
 */
export async function submitRating(
  reportId: string,
  userId: string,
  rating: number,
  comment?: string
): Promise<ApiResponse<void>> {
  return fetchApi<void>(API_ENDPOINTS.RATINGS, {
    method: "POST",
    body: JSON.stringify({
      reportId,
      userId,
      rating,
      comment,
    }),
  })
}

/**
 * Updates a report with new data
 * @param reportId - ID of the report to update
 * @param data - Partial report data to update
 * @returns Promise with success or error
 */
export async function updateReport(
  reportId: string,
  data: Partial<any>
): Promise<ApiResponse<void>> {
  return fetchApi<void>(`${API_ENDPOINTS.REPORTS}/${reportId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
} 