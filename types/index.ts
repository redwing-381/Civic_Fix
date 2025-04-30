/**
 * Core types and interfaces for the CivicFix application
 */

/**
 * Represents a civic issue report in the system
 */
export interface Report {
  _id: string;                    // Unique identifier for the report
  title: string;                  // Title of the issue
  description: string;            // Detailed description of the issue
  location: string;               // Physical location of the issue
  status: "urgent" | "pending" | "in-progress" | "bidding" | "completed";  // Current status of the issue
  createdAt: string;              // Timestamp when the report was created
  updatedAt: string;              // Timestamp when the report was last updated
  progress?: number;              // Progress percentage of the issue resolution
  assignedContractor?: string;    // ID of the contractor assigned to the issue
  imageUrl?: string;              // URL of the issue image
  country: string;                // Country where the issue is located
  costEstimate?: {               // Estimated cost range for resolving the issue
    min: number;
    max: number;
  };
  currency?: string;              // Currency used for cost estimates
  ratings?: Array<{              // User ratings and feedback for the issue
    userId: string;
    rating: number;
    comment?: string;
    createdAt: string;
  }>;
}

/**
 * Represents a user's rating for an issue
 */
export interface Rating {
  userId: string;                 // ID of the user who submitted the rating
  rating: number;                 // Numeric rating (1-5)
  comment?: string;               // Optional comment with the rating
  createdAt: string;              // Timestamp when the rating was submitted
}

/**
 * Represents the cost estimate range for an issue
 */
export interface CostEstimate {
  min: number;                    // Minimum estimated cost
  max: number;                    // Maximum estimated cost
}

/**
 * Possible status values for an issue
 */
export type IssueStatus = "urgent" | "pending" | "in-progress" | "bidding" | "completed";

/**
 * Details for displaying issue status in the UI
 */
export interface StatusDetails {
  icon: React.ReactNode;          // Status icon component
  label: string;                  // Status label text
  color: string;                  // Status color class
} 