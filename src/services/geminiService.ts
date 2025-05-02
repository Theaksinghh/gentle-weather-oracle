
import { WeatherData } from './aiService';

const GEMINI_API_KEY = 'AIzaSyCPYF919ZnvQMV0b2jSW7YGdBVJHvljz90';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Function to map the AI response to weather type
const determineWeatherType = (response: string): WeatherData['weatherType'] => {
  const lowerCaseResponse = response.toLowerCase();
  
  if (lowerCaseResponse.includes('rain') || lowerCaseResponse.includes('drizzle')) {
    return 'rainy';
  } else if (lowerCaseResponse.includes('snow')) {
    return 'snowy';
  } else if (lowerCaseResponse.includes('thunder') || lowerCaseResponse.includes('storm')) {
    return 'stormy';
  } else if (lowerCaseResponse.includes('cloud') && lowerCaseResponse.includes('part')) {
    return 'partly-cloudy';
  } else if (lowerCaseResponse.includes('cloud')) {
    return 'cloudy';
  } else if (lowerCaseResponse.includes('night')) {
    return 'night';
  } else {
    return 'sunny';
  }
};

// Extract temperature from AI response
const extractTemperature = (response: string): string => {
  // Look for temperature patterns like "70°F", "25°C", "70 degrees F"
  const tempPatterns = [
    /(\d+(?:\.\d+)?)°?F\b/i,
    /(\d+(?:\.\d+)?)°?C\b/i,
    /(\d+(?:\.\d+)?) degrees (F|C|Fahrenheit|Celsius)\b/i
  ];
  
  for (const pattern of tempPatterns) {
    const match = response.match(pattern);
    if (match) {
      // If we found a temperature, format it properly
      const temp = match[1];
      const unit = match[2] ? (match[2].charAt(0).toUpperCase()) : 'F'; // Default to F if not specified
      return `${temp}°${unit}`;
    }
  }
  
  return "Temperature not available";
};

export const getWeatherFromGemini = async (location: string): Promise<WeatherData> => {
  try {
    const prompt = `Show me current weather report of ${location}. Include the temperature, general weather conditions, and a brief description. Provide only factual information, no introductory text.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 300
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text || '';
    
    if (!aiResponse) {
      throw new Error("No response received from Gemini API");
    }
    
    // Extract description from the AI response
    // Let's use the first sentence as description
    let description = aiResponse.split('.')[0].trim();
    if (description.length > 60) {
      description = description.substring(0, 57) + '...';
    }
    
    // Determine weather type from response
    const weatherType = determineWeatherType(aiResponse);
    
    // Extract temperature if available
    const temperature = extractTemperature(aiResponse);
    
    return {
      location,
      temperature,
      description,
      weatherType,
      aiAnalysis: aiResponse
    };
  } catch (error) {
    console.error('Error fetching weather data from Gemini:', error);
    throw error;
  }
};
