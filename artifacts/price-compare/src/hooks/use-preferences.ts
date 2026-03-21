import { useState, useEffect } from 'react';

const PREFS_KEY = 'pricehunt-preferences';

interface Preferences {
  platforms: string[];
  currency: string;
}

const defaultPreferences: Preferences = {
  platforms: ['amazon', 'flipkart'],
  currency: 'INR',
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) {
        return { ...defaultPreferences, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to load preferences", e);
    }
    return defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const togglePlatform = (platform: string) => {
    setPreferences(prev => {
      const current = prev.platforms;
      // Prevent unselecting the last platform
      if (current.includes(platform) && current.length === 1) return prev;
      
      const newPlatforms = current.includes(platform)
        ? current.filter(p => p !== platform)
        : [...current, platform];
        
      return { ...prev, platforms: newPlatforms };
    });
  };

  const setCurrency = (currency: string) => {
    setPreferences(prev => ({ ...prev, currency }));
  };

  return { 
    preferences, 
    togglePlatform, 
    setCurrency 
  };
}
