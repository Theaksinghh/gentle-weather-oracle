
// Weather service using OpenWeatherMap API
import { toast } from "@/components/ui/sonner";

export interface WeatherData {
  location: string;
  temperature: string;
  description: string;
  weatherType: 'sunny' | 'cloudy' | 'partly-cloudy' | 'rainy' | 'snowy' | 'stormy' | 'night' | 'night-rainy';
  aiAnalysis: string;
}

// Local storage key for the API key
const API_KEY_STORAGE = 'weather_api_key';

// Save API key to localStorage
export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE, apiKey);
};

// Get API key from localStorage
export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE);
};

// Clear API key from localStorage
export const clearApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE);
};

// Map OpenWeatherMap weather codes to our app's weather types
const mapWeatherType = (weatherCode: string, isNight: boolean): WeatherData['weatherType'] => {
  const code = weatherCode.toLowerCase();
  
  if (isNight) {
    return code.includes('rain') ? 'night-rainy' : 'night';
  }
  
  if (code.includes('rain') || code.includes('drizzle')) {
    return 'rainy';
  } else if (code.includes('snow')) {
    return 'snowy';
  } else if (code.includes('thunderstorm')) {
    return 'stormy';
  } else if (code.includes('clouds')) {
    return code.includes('few') ? 'partly-cloudy' : 'cloudy';
  } else {
    return 'sunny';
  }
};

// Generate AI analysis based on weather data
const generateAIAnalysis = (location: string, tempF: number, description: string): string => {
  const tempCategory = tempF < 40 ? 'cold' : tempF < 70 ? 'mild' : 'warm';
  const isRainy = description.toLowerCase().includes('rain');
  const isCloudy = description.toLowerCase().includes('cloud');
  const isSnowy = description.toLowerCase().includes('snow');
  
  const analyses = {
    cold: {
      base: `Current temperature in ${location} is quite cold at ${tempF.toFixed(1)}°F.`,
      rainy: ` The rain is making it feel even colder, so you should definitely wear a waterproof jacket and warm layers.`,
      cloudy: ` The cloud cover is keeping temperatures low, so bundle up if you're heading out.`,
      snowy: ` With snow in the forecast, roads might be slippery. Consider wearing boots with good traction and a warm coat.`
    },
    mild: {
      base: `The weather in ${location} is comfortable with a current temperature of ${tempF.toFixed(1)}°F.`,
      rainy: ` Light rain is expected, so carrying an umbrella would be a good idea.`,
      cloudy: ` While it's cloudy, the temperature remains pleasant for outdoor activities.`,
      snowy: ` It's unusual to have snow at this temperature, but be prepared for wet conditions.`
    },
    warm: {
      base: `It's quite warm in ${location} with temperatures reaching ${tempF.toFixed(1)}°F.`,
      rainy: ` The warm rain might create humid conditions, so dress in light, breathable clothing.`,
      cloudy: ` The clouds are providing some relief from the heat, making it a good day for outdoor activities.`,
      snowy: ` Snow is highly unlikely at this temperature, so this could be a forecasting error.`
    }
  };

  let analysis = analyses[tempCategory].base;
  
  if (isRainy) {
    analysis += analyses[tempCategory].rainy;
  } else if (isCloudy) {
    analysis += analyses[tempCategory].cloudy;
  } else if (isSnowy) {
    analysis += analyses[tempCategory].snowy;
  } else {
    analysis += ` Current conditions are clear, making it a ${tempCategory === 'warm' ? 'good' : tempCategory === 'mild' ? 'pleasant' : 'brisk'} day to be outside.`;
  }

  return analysis;
};

// OpenWeatherMap API call to get weather data
export const getWeatherData = async (location: string): Promise<WeatherData> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("API key not found. Please set your OpenWeatherMap API key.");
  }
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=imperial`
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
      } else if (response.status === 404) {
        throw new Error(`Location "${location}" not found. Please check the spelling and try again.`);
      } else {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    
    // Check if it's night time based on sunrise/sunset data
    const currentTime = Math.floor(Date.now() / 1000);
    const isNight = currentTime < data.sys.sunrise || currentTime > data.sys.sunset;
    
    // Extract and format the data
    const weatherDescription = data.weather[0].description;
    const tempF = data.main.temp;
    const weatherType = mapWeatherType(data.weather[0].main, isNight);
    const cityWithCountry = `${data.name}, ${data.sys.country}`;
    const aiAnalysis = generateAIAnalysis(data.name, tempF, weatherDescription);
    
    return {
      location: cityWithCountry,
      temperature: `${tempF.toFixed(1)}°F`,
      description: weatherDescription,
      weatherType,
      aiAnalysis
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
