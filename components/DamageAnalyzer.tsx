'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, MapPin } from "lucide-react";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const COUNTRIES = [
  'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Peru', 'Chile',
  'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium',
  'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Poland', 'Russia', 'India', 'China',
  'Japan', 'South Korea', 'Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Indonesia',
  'Philippines', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Saudi Arabia',
  'United Arab Emirates', 'Qatar', 'Kuwait', 'Israel', 'Turkey', 'South Africa',
  'Egypt', 'Nigeria', 'Kenya', 'Ethiopia', 'Australia', 'New Zealand'
];

// Add this function to get coordinates for a location
const getCoordinates = (location: string, country: string) => {
  // This is a simple fallback - in a real app, you'd use a geocoding service
  const countryCoords: Record<string, [number, number]> = {
    'United States': [37.0902, -95.7129],
    'Canada': [56.1304, -106.3468],
    'United Kingdom': [55.3781, -3.4360],
    'India': [20.5937, 78.9629],
    'Australia': [-25.2744, 133.7751],
    'Kenya': [-1.2921, 36.8219],
    'Nigeria': [9.0820, 8.6753],
    'South Africa': [-30.5595, 22.9375],
    'Germany': [51.1657, 10.4515],
    'France': [46.6034, 1.8883],
    'Brazil': [-14.2350, -51.9253],
    'Mexico': [23.6345, -102.5528],
    'Unknown': [0, 0],
  };

  return countryCoords[country] || countryCoords['Unknown'];
};

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

  const icon = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const L = require('leaflet');
    return L.icon({
      iconUrl: '/marker-icon.png',
      iconRetinaUrl: '/marker-icon-2x.png',
      shadowUrl: '/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }, []);

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
      setResult({
        ...analysisData,
        location: analysisData.location || location,
      });
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

      // console.log('Saving report with data:', reportData);

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
      // console.log('Report saved successfully:', savedReport);
      setSuccess(true);
      
      // Redirect to reports page after 2 seconds
      setTimeout(() => {
        window.location.href = '/report';
      }, 2000);
    } catch (error) {
      // console.error('Detailed error:', error);
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

              <div className="rounded-md overflow-hidden border border-gray-200 h-[300px]">
                <MapContainer
                  center={getCoordinates(result.location, result.country) as LatLngExpression}
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={getCoordinates(result.location, result.country) as LatLngExpression} icon={icon}>
                    <Popup>
                      <div>
                        <strong>{result.title}</strong><br />
                        {result.location}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
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