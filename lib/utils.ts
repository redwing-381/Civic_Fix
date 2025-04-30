import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Report, Rating } from "@/types"

/**
 * Utility function to merge class names using clsx and tailwind-merge
 * @param inputs - Array of class names or class name objects
 * @returns Merged and optimized class names string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates the average rating from an array of ratings
 * @param ratings - Array of rating objects
 * @returns Average rating as a number or null if no ratings exist
 */
export const calculateAverageRating = (ratings: Rating[]): number | null => {
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return Number((sum / ratings.length).toFixed(1));
};

/**
 * Calculates the number of days ago from a given date string
 * @param dateString - ISO date string
 * @returns Number of days ago
 */
export const getDaysAgo = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Normalizes a progress value to ensure it's between 0 and 100
 * @param progress - Progress value to normalize
 * @returns Normalized progress value between 0 and 100
 */
export const normalizeProgress = (progress: number): number => {
  return Math.min(Math.max(Number(progress) || 0, 0), 100);
};

/**
 * Formats a number as currency using the specified currency code
 * @param amount - Amount to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * Validates a report object to ensure all required fields are present
 * @param report - Report object to validate
 * @returns Boolean indicating if the report is valid
 */
export const validateReport = (report: Partial<Report>): boolean => {
  const requiredFields = ["title", "description", "location", "country"];
  return requiredFields.every((field) => report[field as keyof Report]);
};
