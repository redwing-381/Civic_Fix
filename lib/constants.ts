/**
 * Application-wide constants and configuration values
 */

/**
 * Color classes for different issue statuses
 * Used for styling status badges and indicators
 */
export const STATUS_COLORS = {
  urgent: "text-red-500 bg-red-50",
  pending: "text-amber-500 bg-amber-50",
  "in-progress": "text-blue-500 bg-blue-50",
  bidding: "text-purple-500 bg-purple-50",
  completed: "text-green-500 bg-green-50",
} as const;

/**
 * Icon names for different issue statuses
 * Used to display appropriate icons for each status
 */
export const STATUS_ICONS = {
  urgent: "AlertTriangle",
  pending: "Clock",
  "in-progress": "Loader2",
  bidding: "Loader2",
  completed: "CheckCircle2",
} as const;

/**
 * Default image to display when no image is provided
 */
export const DEFAULT_IMAGE = "/avatar.png";

/**
 * API endpoint paths for different resources
 */
export const API_ENDPOINTS = {
  REPORTS: "/api/reports",    // Endpoint for report operations
  RATINGS: "/api/ratings",    // Endpoint for rating operations
  USERS: "/api/users",        // Endpoint for user operations
} as const;

/**
 * Currency symbols for different currencies
 * Used for displaying cost estimates
 */
export const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
} as const;

/**
 * Default currency to use when none is specified
 */
export const DEFAULT_CURRENCY = "USD"; 