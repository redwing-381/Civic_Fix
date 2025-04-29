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
function estimateCost(): number {
  // Base cost for typical damage repair (reduced from 5000 to 1000)
  return 1000;
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

    // Calculate base cost in USD
    const baseCostUSD = estimateCost();

    // Convert to local currency if needed
    let finalCost;
    if (currency !== 'USD') {
      finalCost = await convertCurrency(baseCostUSD, 'USD', currency);
    } else {
      finalCost = baseCostUSD;
    }

    // Add 15% buffer for min/max range (reduced from 20%)
    const costMin = Math.round(finalCost * 0.85);
    const costMax = Math.round(finalCost * 1.15);

    const result = {
      title,
      description,
      country,
      currency,
      costEstimate: {
        min: costMin,
        max: costMax
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