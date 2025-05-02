
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Key, AlertCircle } from "lucide-react";
import { saveApiKey, getApiKey, clearApiKey } from '@/services/aiService';

interface ApiKeyInputProps {
  onApiKeySaved: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySaved }) => {
  const [apiKey, setApiKey] = useState("");
  const [keyExists, setKeyExists] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const savedKey = getApiKey();
    setKeyExists(!!savedKey);
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setKeyExists(true);
      setApiKey("");
      onApiKeySaved();
    }
  };

  const handleClearKey = () => {
    clearApiKey();
    setKeyExists(false);
    setDialogOpen(false);
  };

  return (
    <div className="mb-6">
      {!keyExists ? (
        <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 mb-4">
          <div className="flex mb-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="font-medium text-yellow-800">API Key Required</h3>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            To use the Weather Oracle, you need an OpenWeatherMap API key.
            You can get a free API key by signing up at{" "}
            <a 
              href="https://openweathermap.org/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              openweathermap.org
            </a>
          </p>
          <div className="flex space-x-2 mt-1">
            <Input
              type="password"
              placeholder="Enter your OpenWeatherMap API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-white"
            />
            <Button onClick={handleSaveKey} disabled={!apiKey.trim()}>Save Key</Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center p-3 rounded-md bg-green-50 border border-green-200 mb-4">
          <div className="flex items-center">
            <Key className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm text-green-800">API key saved successfully</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDialogOpen(true)}
            className="text-xs border-green-300 text-green-700 hover:bg-green-100"
          >
            Change Key
          </Button>
        </div>
      )}

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your current OpenWeatherMap API key. You'll need to enter a new key to continue using the weather service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearKey}>
              Remove Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApiKeyInput;
