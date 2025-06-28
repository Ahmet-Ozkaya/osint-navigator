import React, { useState, useEffect } from 'react';
import { Search, Zap, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { detectInputType, encodeForUrl } from '../../utils/inputDetection';
import toast from 'react-hot-toast';

interface SearchBarProps {
  onSearch: (query: string, type: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Enter IP, domain, URL, hash, or email..." 
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousInput, setPreviousInput] = useState('');

  // Clear cache when input changes significantly
  useEffect(() => {
    if (input.trim() && input !== previousInput && previousInput !== '') {
      // Clear any cached data when user starts typing a new query
      const clearCache = () => {
        sessionStorage.removeItem('osint-analysis-cache');
        sessionStorage.removeItem('ai-analysis-cache');
        sessionStorage.removeItem('tool-recommendations');
        sessionStorage.removeItem('threat-assessment');
        sessionStorage.removeItem('ai-conversation-context');
      };

      // Debounce cache clearing to avoid clearing on every keystroke
      const timeoutId = setTimeout(() => {
        if (input.trim() !== previousInput.trim()) {
          clearCache();
          console.log('Cache cleared due to input change');
        }
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timeoutId);
    }
  }, [input, previousInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please enter a valid input');
      return;
    }

    setIsLoading(true);
    const inputType = detectInputType(input);
    
    // Clear cache immediately when submitting a new search
    if (input.trim() !== previousInput.trim()) {
      sessionStorage.removeItem('osint-analysis-cache');
      sessionStorage.removeItem('ai-analysis-cache');
      sessionStorage.removeItem('tool-recommendations');
      sessionStorage.removeItem('threat-assessment');
      sessionStorage.removeItem('ai-conversation-context');
      console.log('Cache cleared for new search submission');
    }
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onSearch(input.trim(), inputType);
    setPreviousInput(input.trim()); // Update previous input tracker
    setIsLoading(false);
    
    toast.success(`Input processed as ${inputType.toUpperCase()}`);
  };

  const clearInput = () => {
    setInput('');
    // Clear cache when input is manually cleared
    sessionStorage.removeItem('osint-analysis-cache');
    sessionStorage.removeItem('ai-analysis-cache');
    sessionStorage.removeItem('tool-recommendations');
    sessionStorage.removeItem('threat-assessment');
    sessionStorage.removeItem('ai-conversation-context');
    console.log('Cache cleared due to input clearing');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    // If user clears the input completely, clear cache immediately
    if (!newValue.trim() && previousInput.trim()) {
      sessionStorage.removeItem('osint-analysis-cache');
      sessionStorage.removeItem('ai-analysis-cache');
      sessionStorage.removeItem('tool-recommendations');
      sessionStorage.removeItem('threat-assessment');
      sessionStorage.removeItem('ai-conversation-context');
      setPreviousInput('');
      console.log('Cache cleared due to empty input');
    }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-12 pr-24 py-4 text-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-200 placeholder-slate-400"
          />
          
          {input && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-20 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              title="Clear input and cache"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
          
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>Analyze</span>
          </motion.button>
        </div>
      </form>
      
      <div className="mt-3 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Supports IP addresses, domains, URLs, file hashes, and email addresses
          {input && input !== previousInput && (
            <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
              • Cache will be cleared for new search
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
};