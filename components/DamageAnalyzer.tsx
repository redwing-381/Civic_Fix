'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";

const COUNTRIES = [
  'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Peru', 'Chile',
  'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium',
  'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Poland', 'Russia', 'India', 'China',
  'Japan', 'South Korea', 'Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Indonesia',
  'Philippines', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Saudi Arabia',
  'United Arab Emirates', 'Qatar', 'Kuwait', 'Israel', 'Turkey', 'South Africa',
  'Egypt', 'Nigeria', 'Kenya', 'Ethiopia', 'Australia', 'New Zealand'
];

export default function DamageAnalyzer() {
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    description: string;
    country: string;
    location: string;
    currency: string;
    costEstimate: {
      min: number;
      max: number;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country || !title || !description || !location) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('country', country);
      formData.append('location', location);
      formData.append('title', title);
      formData.append('description', description);

      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to analyze damage');
        } catch (e) {
          throw new Error('Server error: ' + errorText);
        }
      }

      const analysisData = await analysisResponse.json();
      setResult(analysisData);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze damage. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!result) return;

    setSubmitting(true);
    setError(null);
    try {
      const reportData = {
        title: result.title,
        description: result.description,
        country: result.country,
        location: result.location,
        imageUrl: imagePreview,
        status: 'pending',
        costEstimate: result.costEstimate,
        currency: result.currency
      };

      console.log('Saving report with data:', reportData);

      const saveResponse = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to save report');
        } catch (e) {
          throw new Error('Server error: ' + errorText);
        }
      }

      const savedReport = await saveResponse.json();
      console.log('Report saved successfully:', savedReport);
      setSuccess(true);
      
      // Redirect to reports page after 2 seconds
      setTimeout(() => {
        window.location.href = '/report';
      }, 2000);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Damage Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>Report submitted successfully. Redirecting to reports page...</AlertDescription>
            </Alert>
          )}

          {!result && (
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for the damage report"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the damage in detail"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter the specific location (e.g., city, street, landmark)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Upload Damage Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2 relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Uploaded damage"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Damage'
                )}
              </Button>
            </form>
          )}

          {result && !success && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Analysis Results</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Title:</span> {result.title}</p>
                  <p><span className="font-medium">Description:</span> {result.description}</p>
                  <p><span className="font-medium">Country:</span> {result.country}</p>
                  <p><span className="font-medium">Location:</span> {result.location}</p>
                  <p><span className="font-medium">Estimated Cost:</span> {result.currency} {result.costEstimate.min} - {result.costEstimate.max}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setError(null);
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 