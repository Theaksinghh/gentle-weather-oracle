
// Weather service using Gemini API
import { toast } from "@/components/ui/sonner";
import { getWeatherFromGemini } from "./geminiService";

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

// OpenWeatherMap API call to get weather data
export const getWeatherData = async (location: string): Promise<WeatherData> => {
  try {
    // Use Gemini API for weather data
    const weatherData = await getWeatherFromGemini(location);
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
