"use client"

import * as React from "react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  maxSize?: number
  accept?: string[]
  className?: string
  label?: string
  description?: string
  currentFile?: string
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = ["image/*"],
  className,
  label = "Upload File",
  description = "Click to upload or drag and drop",
  currentFile,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentFile || null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)
      const file = acceptedFiles[0]
      
      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
        return
      }

      // Create preview URL for images
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        setPreview(url)
      }

      onFileSelect(file)
    },
    [maxSize, onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: 1,
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    if (onFileRemove) {
      onFileRemove()
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors",
          isDragActive ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300",
          error && "border-red-500 bg-red-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">{description}</span>
              <span className="text-xs text-gray-400 mt-1">
                {accept.join(", ")} (max. {maxSize / (1024 * 1024)}MB)
              </span>
            </>
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
} 