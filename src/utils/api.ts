interface TravelPlanParams {
  source: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency?: string;
  people: number;
}

interface FlightsParams {
  source: string;
  destination: string;
  date: string;
}

// Read API keys from environment variables
export const checkApiKeys = (): boolean => {
  return !!import.meta.env.VITE_GEMINI_API_KEY && !!import.meta.env.VITE_SERP_API_KEY;
};

export const generateTravelPlan = async (params: TravelPlanParams): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("Gemini API key is not set in environment variables");
  }

  try {
    // In a real application, you would call the Gemini API here
    // For this demo, we'll simulate a response
    console.log("Generating travel plan with params:", params);
    
    // Calculate trip duration in days
    const tripDays = Math.ceil((params.endDate.getTime() - params.startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // This simulates the API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use the provided currency or default to USD
    const currency = params.currency || 'USD';
    const currencySymbol = getCurrencySymbol(currency);
    
    // Generate a mock markdown response
    return `# Travel Plan: ${params.source} to ${params.destination}

## Trip Overview
- **Duration**: ${tripDays} days
- **Dates**: ${params.startDate.toLocaleDateString()} - ${params.endDate.toLocaleDateString()}
- **Travelers**: ${params.people}
- **Budget**: ${currencySymbol}${params.budget.toLocaleString()} ${currency}
- **Budget per person**: ${currencySymbol}${Math.round(params.budget / params.people).toLocaleString()} ${currency}

## Recommended Itinerary

### Day 1: Arrival and Settling In
- Arrive at ${params.destination} International Airport
- Check-in at your accommodation
- Evening exploration of the local area
- Dinner at a local restaurant to experience authentic cuisine

### Day 2: City Exploration
- Morning visit to main attractions
- Lunch at a popular local eatery
- Afternoon guided tour
- Evening cultural experience

${Array.from({ length: Math.min(tripDays - 2, 3) }, (_, i) => `
### Day ${i + 3}: Adventure Day
- Morning activity: Hiking/Museum visit
- Lunch at scenic location
- Afternoon relaxation or shopping
- Evening entertainment
`).join('')}

${tripDays > 5 ? `
### Day ${tripDays - 1}: Final Explorations
- Visit to any missed attractions
- Souvenir shopping
- Special dinner reservation

` : ''}
### Day ${tripDays}: Departure
- Final breakfast
- Check-out from accommodation
- Last-minute shopping
- Departure from ${params.destination} International Airport

## Estimated Budget Breakdown
- **Accommodation**: ${currencySymbol}${Math.round(params.budget * 0.4).toLocaleString()} ${currency}
- **Transportation**: ${currencySymbol}${Math.round(params.budget * 0.2).toLocaleString()} ${currency}
- **Food & Dining**: ${currencySymbol}${Math.round(params.budget * 0.25).toLocaleString()} ${currency}
- **Activities & Sightseeing**: ${currencySymbol}${Math.round(params.budget * 0.1).toLocaleString()} ${currency}
- **Shopping & Miscellaneous**: ${currencySymbol}${Math.round(params.budget * 0.05).toLocaleString()} ${currency}

## Travel Tips for ${params.destination}
1. Best local dishes to try: [Local specialties]
2. Common phrases in local language
3. Transportation options within the city
4. Weather expectations and packing suggestions
5. Local customs and etiquette

## Emergency Information
- Local emergency number: 911/112/999 (varies by country)
- Nearby hospitals and medical facilities
- Location of nearest embassy or consulate

*This travel plan is AI-generated based on your requirements. Consider consulting with a travel agent or local expert for detailed planning.*`;
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw error;
  }
};

// Helper function to get currency symbol
function getCurrencySymbol(currencyCode: string): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    CAD: '$',
    AUD: '$'
  };
  
  return currencySymbols[currencyCode] || '$';
}

export const getFlightsInfo = async (params: FlightsParams): Promise<any[]> => {
  if (!import.meta.env.VITE_SERP_API_KEY) {
    throw new Error("SERP API key is not set in environment variables");
  }

  try {
    // In a real application, you would call the SERP API here
    // For this demo, we'll simulate a response
    console.log("Getting flights info with params:", params);
    
    // This simulates the API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock flight data
    const airlines = ["Emirates", "Qatar Airways", "Delta", "Lufthansa", "Singapore Airlines"];
    const flightPrefixes = ["EK", "QR", "DL", "LH", "SQ"];
    
    return Array.from({ length: 5 }, (_, i) => ({
      airline: airlines[i],
      flightNumber: `${flightPrefixes[i]}${Math.floor(Math.random() * 1000)}`,
      departure: {
        time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        airport: `${params.source} International Airport`
      },
      arrival: {
        time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        airport: `${params.destination} International Airport`
      },
      duration: `${Math.floor(Math.random() * 10 + 2)}h ${Math.floor(Math.random() * 60)}m`,
      price: {
        amount: Math.floor(Math.random() * 1000) + 300,
        currency: "USD"
      }
    })).sort((a, b) => a.price.amount - b.price.amount);
  } catch (error) {
    console.error("Error getting flights info:", error);
    throw error;
  }
};

export const sendChatMessage = async (message: string, context: string): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("Gemini API key is not set in environment variables");
  }

  try {
    console.log("Sending chat message:", message);
    console.log("With context:", context);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`; // Updated model name

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: context },
            { text: message }
          ]
        }
      ]
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};
