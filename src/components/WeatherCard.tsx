
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeatherIcon from './WeatherIcon';
import { MapPin } from "lucide-react";

interface WeatherCardProps {
  location: string;
  temperature: string;
  description: string;
  weatherType: 'sunny' | 'cloudy' | 'partly-cloudy' | 'rainy' | 'snowy' | 'stormy' | 'night' | 'night-rainy';
  aiAnalysis: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  temperature,
  description,
  weatherType,
  aiAnalysis
}) => {
  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-sky-dark mr-2" />
            <span>{location}</span>
          </div>
          <WeatherIcon type={weatherType} size={40} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-4">
          <p className="text-4xl font-bold mb-1">{temperature}</p>
          <p className="text-lg text-gray-600 capitalize">{description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-sm text-gray-500 mb-2">AI Weather Analysis:</h3>
          <p className="text-sm text-gray-700">{aiAnalysis}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
