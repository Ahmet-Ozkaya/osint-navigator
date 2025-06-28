import { useState, useEffect } from 'react';

function ensureArrayProperty<T>(obj: any, key: string, defaultValue: T[]): T[] {
  if (obj && typeof obj === 'object' && key in obj) {
    const value = obj[key];
    return Array.isArray(value) ? value : defaultValue;
  }
  return defaultValue;
}

function sanitizeStoredValue<T>(parsedItem: any, initialValue: T): T {
  // If the initial value is an object, ensure array properties are properly initialized
  if (typeof initialValue === 'object' && initialValue !== null && !Array.isArray(initialValue)) {
    const sanitized = { ...initialValue };
    
    // Handle common array properties that might be corrupted in localStorage
    if ('investigationHistory' in sanitized) {
      (sanitized as any).investigationHistory = ensureArrayProperty(parsedItem, 'investigationHistory', []);
    }
    if ('favoriteTools' in sanitized) {
      (sanitized as any).favoriteTools = ensureArrayProperty(parsedItem, 'favoriteTools', []);
    }
    if ('recentSearches' in sanitized) {
      (sanitized as any).recentSearches = ensureArrayProperty(parsedItem, 'recentSearches', []);
    }
    
    // Merge other properties from parsedItem if they exist and are valid
    if (parsedItem && typeof parsedItem === 'object') {
      Object.keys(parsedItem).forEach(key => {
        if (key in sanitized && !['investigationHistory', 'favoriteTools', 'recentSearches'].includes(key)) {
          (sanitized as any)[key] = parsedItem[key];
        }
      });
    }
    
    return sanitized;
  }
  
  return parsedItem;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        // Check if parsedItem is null or undefined after parsing
        if (parsedItem === null || parsedItem === undefined) {
          return initialValue;
        }
        
        // Sanitize the stored value to ensure array properties are properly initialized
        return sanitizeStoredValue(parsedItem, initialValue);
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}