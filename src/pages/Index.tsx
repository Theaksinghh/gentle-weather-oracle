
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import { getWeatherData, WeatherData } from '@/services/aiService';
import { toast } from '@/components/ui/sonner';
import { Card } from '@/components/ui/card';
import { CloudSun } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const handleSearch = async (location: string) => {
    setIsLoading(true);
    
    try {
      const data = await getWeatherData(location);
      setWeatherData(data);
      toast.success(`Weather report for ${location} loaded successfully`);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light to-white">
      <div className="container py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sky-dark mb-4 flex items-center justify-center">
            <CloudSun className="mr-2 h-10 w-10" />
            AI Weather Oracle
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get AI-powered weather insights for any location. Enter a city or region to see current conditions and smart recommendations.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-10">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {isLoading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-dark"></div>
            </div>
          )}

          {!isLoading && !weatherData && (
            <Card className="max-w-md mx-auto p-6 text-center bg-white/80 backdrop-blur-sm">
              <CloudSun className="h-16 w-16 mx-auto text-sky mb-4 animate-float" />
              <h2 className="text-xl font-medium mb-2">Welcome to the AI Weather Oracle</h2>
              <p className="text-gray-600">
                Search for a location above to get started with personalized weather insights
              </p>
            </Card>
          )}

          {weatherData && (
            <div className="flex justify-center">
              <WeatherCard 
                location={weatherData.location}
                temperature={weatherData.temperature}
                description={weatherData.description}
                weatherType={weatherData.weatherType}
                aiAnalysis={weatherData.aiAnalysis}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
