import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

// Mapping of countries to their respective currencies
const countryCurrencyMap: { [key: string]: string } = {
  'United States': 'USD',
  'Canada': 'CAD',
  'Mexico': 'MXN',
  'Brazil': 'BRL',
  'Argentina': 'ARS',
  'Colombia': 'COP',
  'Peru': 'PEN',
  'Chile': 'CLP',
  'United Kingdom': 'GBP',
  'Germany': 'EUR',
  'France': 'EUR',
  'Italy': 'EUR',
  'Spain': 'EUR',
  'Netherlands': 'EUR',
  'Belgium': 'EUR',
  'Switzerland': 'CHF',
  'Sweden': 'SEK',
  'Norway': 'NOK',
  'Denmark': 'DKK',
  'Poland': 'PLN',
  'Russia': 'RUB',
  'India': 'INR',
  'China': 'CNY',
  'Japan': 'JPY',
  'South Korea': 'KRW',
  'Singapore': 'SGD',
  'Malaysia': 'MYR',
  'Thailand': 'THB',
  'Vietnam': 'VND',
  'Indonesia': 'IDR',
  'Philippines': 'PHP',
  'Pakistan': 'PKR',
  'Bangladesh': 'BDT',
  'Sri Lanka': 'LKR',
  'Nepal': 'NPR',
  'Saudi Arabia': 'SAR',
  'United Arab Emirates': 'AED',
  'Qatar': 'QAR',
  'Kuwait': 'KWD',
  'Israel': 'ILS',
  'Turkey': 'TRY',
  'South Africa': 'ZAR',
  'Egypt': 'EGP',
  'Nigeria': 'NGN',
  'Kenya': 'KES',
  'Ethiopia': 'ETB',
  'Australia': 'AUD',
  'New Zealand': 'NZD'
};

// Add type for currency API response
type CurrencyApiResponse = {
  result: string;
  conversion_rates: {
    [key: string]: number;
  };
};

// Simple cost model with more reasonable base cost
function estimateCost(title: string, description: string): { min: number; max: number } {
  const text = `${title} ${description}`.toLowerCase();

  // Define ranges for each damage type
  const ranges: Record<string, [number, number]> = {
    pothole: [400, 900],
    streetlight: [200, 500],
    sanitation: [100, 400],
    electrical: [300, 700],
    road: [600, 1200],
    water: [500, 1000],
    drainage: [600, 1100],
    'public property': [700, 1300],
    default: [500, 1500],
  };

  let selectedRange = ranges.default;
  for (const key of Object.keys(ranges)) {
    if (key !== 'default' && text.includes(key)) {
      selectedRange = ranges[key];
      break;
    }
  }

  // Generate a random base cost within the selected range
  const baseCost = Math.floor(Math.random() * (selectedRange[1] - selectedRange[0] + 1)) + selectedRange[0];

  return {
    min: Math.round(baseCost * 0.85),
    max: Math.round(baseCost * 1.15),
  };
}

// Function to convert currency
async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    const url = `https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_API_KEY}/latest/${fromCurrency}`;
    const response = await fetch(url);
    const data = await response.json() as CurrencyApiResponse;

    if (data.result === 'success' && data.conversion_rates[toCurrency]) {
      return amount * data.conversion_rates[toCurrency];
    }
    return amount; // Return original amount if conversion fails
  } catch (error) {
    console.error('Error converting currency:', error);
    return amount;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const country = formData.get('country') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!country || !title || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Get currency for the country
    const currency = countryCurrencyMap[country] || 'USD';

    // Calculate cost range in USD based on title and description
    const costRangeUSD = estimateCost(title, description);

    // Convert to local currency if needed
    let finalCostRange;
    if (currency !== 'USD') {
      finalCostRange = {
        min: await convertCurrency(costRangeUSD.min, 'USD', currency),
        max: await convertCurrency(costRangeUSD.max, 'USD', currency)
      };
    } else {
      finalCostRange = costRangeUSD;
    }

    const result = {
      title,
      description,
      country,
      currency,
      costEstimate: {
        min: Math.round(finalCostRange.min),
        max: Math.round(finalCostRange.max)
      }
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 