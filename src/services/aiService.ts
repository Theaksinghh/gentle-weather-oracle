
// This is a mock AI service for generating weather analysis
// In a real application, this would connect to an AI API like OpenAI

export interface WeatherData {
  location: string;
  temperature: string;
  description: string;
  weatherType: 'sunny' | 'cloudy' | 'partly-cloudy' | 'rainy' | 'snowy' | 'stormy' | 'night' | 'night-rainy';
  aiAnalysis: string;
}

// Mock function to determine weather type based on description
const getWeatherType = (description: string): WeatherData['weatherType'] => {
  description = description.toLowerCase();
  
  if (description.includes('rain') || description.includes('shower')) {
    return 'rainy';
  } else if (description.includes('snow') || description.includes('flurries')) {
    return 'snowy';
  } else if (description.includes('cloud')) {
    return 'cloudy';
  } else if (description.includes('night') && description.includes('rain')) {
    return 'night-rainy';
  } else if (description.includes('night')) {
    return 'night';
  } else {
    return 'sunny';
  }
};

// Generate mock AI responses based on the weather and location
const generateAIAnalysis = (location: string, temperature: number, description: string): string => {
  const tempCategory = temperature < 40 ? 'cold' : temperature < 70 ? 'mild' : 'warm';
  const isRainy = description.toLowerCase().includes('rain');
  const isCloudy = description.toLowerCase().includes('cloud');
  const isSnowy = description.toLowerCase().includes('snow');
  
  const analyses = {
    cold: {
      base: `Current temperature in ${location} is quite cold at ${temperature}°F.`,
      rainy: ` The rain is making it feel even colder, so you should definitely wear a waterproof jacket and warm layers.`,
      cloudy: ` The cloud cover is keeping temperatures low, so bundle up if you're heading out.`,
      snowy: ` With snow in the forecast, roads might be slippery. Consider wearing boots with good traction and a warm coat.`
    },
    mild: {
      base: `The weather in ${location} is comfortable with a current temperature of ${temperature}°F.`,
      rainy: ` Light rain is expected, so carrying an umbrella would be a good idea.`,
      cloudy: ` While it's cloudy, the temperature remains pleasant for outdoor activities.`,
      snowy: ` It's unusual to have snow at this temperature, but be prepared for wet conditions.`
    },
    warm: {
      base: `It's quite warm in ${location} with temperatures reaching ${temperature}°F.`,
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

// Mock API call to get weather data
export const getWeatherData = async (location: string): Promise<WeatherData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate random weather data for demo purposes
  const conditions = [
    "Sunny", "Partly Cloudy", "Cloudy", "Light Rain", 
    "Heavy Rain", "Thunderstorms", "Snow", "Clear Night", "Rainy Night"
  ];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomTemp = Math.floor(Math.random() * (95 - 30) + 30);
  
  const weatherType = getWeatherType(randomCondition);
  const aiAnalysis = generateAIAnalysis(location, randomTemp, randomCondition);
  
  return {
    location,
    temperature: `${randomTemp}°F`,
    description: randomCondition,
    weatherType,
    aiAnalysis
  };
};
