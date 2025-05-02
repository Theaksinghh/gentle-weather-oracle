
import React from 'react';
import { CloudSun, CloudMoonRain, CloudRain, CloudSnow, Sun, Moon } from "lucide-react";

type WeatherType = 'sunny' | 'cloudy' | 'partly-cloudy' | 'rainy' | 'snowy' | 'stormy' | 'night' | 'night-rainy';

interface WeatherIconProps {
  type: WeatherType;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ type, size = 64, className = "" }) => {
  const getIcon = () => {
    switch (type) {
      case 'sunny':
        return <Sun size={size} className={`text-weather-sunny animate-float ${className}`} />;
      case 'cloudy':
      case 'partly-cloudy':
        return <CloudSun size={size} className={`text-weather-cloudy animate-float ${className}`} />;
      case 'rainy':
        return <CloudRain size={size} className={`text-weather-rainy animate-bounce-slight ${className}`} />;
      case 'snowy':
        return <CloudSnow size={size} className={`text-weather-snowy animate-bounce-slight ${className}`} />;
      case 'night':
        return <Moon size={size} className={`text-sky-dark animate-float ${className}`} />;
      case 'night-rainy':
        return <CloudMoonRain size={size} className={`text-sky-dark animate-bounce-slight ${className}`} />;
      default:
        return <CloudSun size={size} className={`text-sky-dark animate-float ${className}`} />;
    }
  };

  return (
    <div className="flex justify-center">
      {getIcon()}
    </div>
  );
};

export default WeatherIcon;
