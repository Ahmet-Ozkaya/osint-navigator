import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { SearchBar } from './components/Search/SearchBar';
import { FilterBar } from './components/Search/FilterBar';
import { ToolCategoryComponent } from './components/Tools/ToolCategory';
import { TopToolsBox } from './components/Tools/TopToolsBox';
import { EnhancedAIAssistant } from './components/AI/EnhancedAIAssistant';
import { InfoModal } from './components/Modals/InfoModal';
import { ContactModal } from './components/Modals/ContactModal';
import { LLMConfigModal } from './components/AI/LLMConfigModal';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { osintCategories, getAllTools, searchTools, getFavoriteTools } from './data/osintTools';
import { UserPreferences, OSINTTool, AIRecommendation, LLMConfig } from './types';
import { detectInputType, encodeForUrl } from './utils/inputDetection';
import toast from 'react-hot-toast';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('osint-preferences', {
    theme: 'dark',
    favoriteTools: [],
    toolOrder: {},
    recentSearches: [],
    workspaceLayout: 'grid',
    toolUsageStats: {}
  });

  // Custom tools stored separately with force update trigger
  const [customTools, setCustomTools] = useLocalStorage<OSINTTool[]>('custom-osint-tools', []);
  const [customToolsUpdateTrigger, setCustomToolsUpdateTrigger] = useState(0);

  // LLM configurations
  const [llmConfigs, setLlmConfigs] = useLocalStorage<LLMConfig[]>('llm-configs', []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [inputType, setInputType] = useState<string>('unknown');
  const [previousInput, setPreviousInput] = useState(''); // Track previous input for cache clearing

  // Enhanced custom tools setter that triggers immediate updates
  const updateCustomTools = (newTools: OSINTTool[] | ((prev: OSINTTool[]) => OSINTTool[])) => {
    const updatedTools = typeof newTools === 'function' ? newTools(customTools) : newTools;
    setCustomTools(updatedTools);
    // Force immediate re-render by updating trigger
    setCustomToolsUpdateTrigger(prev => prev + 1);
    
    // If custom category wasn't expanded and we now have tools, expand it
    if (updatedTools.length > 0 && !expandedCategories['custom']) {
      setExpandedCategories(prev => ({
        ...prev,
        custom: true
      }));
    }
  };

  // Sync theme with preferences
  useEffect(() => {
    if (preferences.theme !== theme) {
      setPreferences(prev => ({ ...prev, theme }));
    }
  }, [theme, preferences.theme, setPreferences]);

  // Initialize expanded categories and handle custom tools changes
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    osintCategories.forEach(category => {
      initialExpanded[category.id] = category.id === 'favorites' || category.id === 'threat-intel';
    });
    // Also expand custom category if there are custom tools
    if (customTools.length > 0) {
      initialExpanded['custom'] = true;
    }
    setExpandedCategories(prev => ({ ...prev, ...initialExpanded }));
  }, [customTools.length, customToolsUpdateTrigger]); // Include trigger in dependencies

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            document.querySelector('input[placeholder*="IP, domain"]')?.focus();
            break;
          case 'd':
            e.preventDefault();
            toggleTheme();
            break;
          case '/':
            e.preventDefault();
            setIsAIOpen(true);
            break;
          case ',':
            e.preventDefault();
            setIsSettingsOpen(true);
            break;
        }
      }
      if (e.key === 'Escape') {
        setFilterQuery('');
        setActiveTags([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  // Clear cache when input changes
  const clearQueryCache = () => {
    // Clear any cached analysis results
    sessionStorage.removeItem('osint-analysis-cache');
    sessionStorage.removeItem('ai-analysis-cache');
    
    // Clear any temporary data
    sessionStorage.removeItem('tool-recommendations');
    sessionStorage.removeItem('threat-assessment');
    
    // Reset AI conversation context if needed
    sessionStorage.removeItem('ai-conversation-context');
    
    console.log('Query cache cleared for new search input');
  };

  const handleSearch = (query: string, detectedType: string) => {
    // Clear cache if this is a different input than the previous one
    if (query !== previousInput && previousInput !== '') {
      clearQueryCache();
      toast.success('Cache cleared for new search');
    }
    
    setCurrentInput(query);
    setInputType(detectedType);
    setPreviousInput(query); // Update previous input tracker
    
    // Update tool URLs based on input
    updateToolUrls(query, detectedType);
    
    // Add to recent searches
    const newSearch = {
      input: query,
      type: detectedType as any,
      timestamp: new Date()
    };
    
    setPreferences(prev => ({
      ...prev,
      recentSearches: [newSearch, ...prev.recentSearches.slice(0, 9)]
    }));

    toast.success(`Ready to investigate ${detectedType.toUpperCase()}: ${query}`);
  };

  const updateToolUrls = (input: string, type: string) => {
    const encoded = encodeForUrl(input);
    const isIP = type === 'ip';
    const isEmail = type === 'email';
    
    // Update URLs for both built-in and custom tools
    const allTools = [...getAllTools(), ...customTools];
    
    allTools.forEach(tool => {
      if (tool.isStandalone) return;
      
      // Store original base URL if not already stored
      if (!tool.originalUrl) {
        tool.originalUrl = tool.url;
      }
      
      // Special handling for tools that have different URLs for different input types
      if (tool.id === 'shodan') {
        tool.url = isIP 
          ? `https://www.shodan.io/host/${input}`
          : `https://www.shodan.io/search?query=${encoded}`;
      } else if (tool.id === 'greynoise') {
        tool.url = isIP
          ? `https://viz.greynoise.io/ip/${input}`
          : `https://viz.greynoise.io/query/${encoded}`;
      } else if (tool.id === 'hunter-io') {
        // Hunter.io specific handling for email searches
        if (isEmail) {
          tool.url = `https://hunter.io/email-verifier/${encoded}`;
        } else {
          // For domain searches
          tool.url = `https://hunter.io/search/${encoded}`;
        }
      } else if (tool.id === 'scamalytics') {
        // Scamalytics only works with IPs
        tool.url = `https://scamalytics.com/ip/${input}`;
      } else if (tool.id === 'spur') {
        // Spur only works with IPs
        tool.url = `https://spur.us/context/${input}`;
      } else if (tool.template) {
        // Use template if available
        tool.url = tool.template.replace('{{query}}', encoded);
      } else {
        // Default: use original base URL and append encoded input
        const baseUrl = tool.originalUrl || tool.url;
        // Remove any existing query parameters or paths after the base
        const cleanBaseUrl = baseUrl.split('?')[0].split('#')[0];
        
        // Determine how to append the input based on the URL structure
        if (cleanBaseUrl.endsWith('/')) {
          tool.url = cleanBaseUrl + encoded;
        } else if (cleanBaseUrl.includes('/search') || cleanBaseUrl.includes('/lookup') || cleanBaseUrl.includes('/check')) {
          // For search/lookup/check endpoints, append with appropriate separator
          tool.url = cleanBaseUrl + (cleanBaseUrl.includes('?') ? '&q=' : '?q=') + encoded;
        } else {
          // Default append with slash
          tool.url = cleanBaseUrl + '/' + encoded;
        }
      }
    });
  };

  const handleTagClick = (tag: string) => {
    if (!activeTags.includes(tag)) {
      setActiveTags([...activeTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setActiveTags(activeTags.filter(t => t !== tag));
  };

  const handleToggleFavorite = (toolId: string) => {
    setPreferences(prev => {
      const newFavorites = prev.favoriteTools.includes(toolId)
        ? prev.favoriteTools.filter(id => id !== toolId)
        : [...prev.favoriteTools, toolId];
      
      toast.success(
        newFavorites.includes(toolId) 
          ? 'Added to favorites!' 
          : 'Removed from favorites!'
      );
      
      return {
        ...prev,
        favoriteTools: newFavorites
      };
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleAIRecommendation = (recommendation: AIRecommendation) => {
    // Auto-expand relevant categories and highlight recommended tools
    recommendation.tools.forEach(toolId => {
      const allTools = [...getAllTools(), ...customTools];
      const tool = allTools.find(t => t.id === toolId);
      if (tool) {
        setExpandedCategories(prev => ({
          ...prev,
          [tool.category]: true
        }));
      }
    });
    
    toast.success(`AI recommended ${recommendation.tools.length} tools for your investigation`);
  };

  const handleToolClick = (toolId: string) => {
    const now = new Date();
    setPreferences(prev => ({
      ...prev,
      toolUsageStats: {
        ...(prev.toolUsageStats || {}),
        [toolId]: {
          count: ((prev.toolUsageStats || {})[toolId]?.count || 0) + 1,
          lastUsed: now
        }
      }
    }));
  };

  // Filter tools based on search query and active tags
  const getFilteredTools = (categoryTools: OSINTTool[]) => {
    let filtered = categoryTools;

    // Apply text filter
    if (filterQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(filterQuery.toLowerCase()))
      );
    }

    // Apply tag filters
    if (activeTags.length > 0) {
      filtered = filtered.filter(tool =>
        activeTags.some(activeTag => tool.tags.includes(activeTag))
      );
    }

    return filtered;
  };

  // Get categories with favorites populated and custom tools included
  const getCategoriesWithFavorites = () => {
    const allTools = [...getAllTools(), ...customTools];
    const favoriteTools = preferences.favoriteTools
      .map(id => allTools.find(tool => tool.id === id))
      .filter(Boolean) as OSINTTool[];
    
    const categoriesWithCustom = [...osintCategories];
    
    // Add custom tools category if there are custom tools
    if (customTools.length > 0) {
      const existingCustomCategory = categoriesWithCustom.find(cat => cat.id === 'custom');
      if (!existingCustomCategory) {
        categoriesWithCustom.push({
          id: 'custom',
          name: 'Custom Tools',
          description: 'Your custom OSINT tools',
          icon: '⚙️',
          tools: customTools
        });
      } else {
        existingCustomCategory.tools = customTools;
      }
    }
    
    return categoriesWithCustom.map(category => {
      if (category.id === 'favorites') {
        return {
          ...category,
          tools: favoriteTools
        };
      } else if (category.id === 'custom') {
        return {
          ...category,
          tools: customTools
        };
      }
      return category;
    });
  };

  // Get top 20 tools by usage
  const getTopTools = () => {
    const allTools = [...getAllTools(), ...customTools];
    const safeToolUsageStats = preferences.toolUsageStats || {};
    
    const toolsWithUsage = allTools
      .map(tool => ({
        tool,
        usageCount: safeToolUsageStats[tool.id]?.count || 0,
        lastUsed: safeToolUsageStats[tool.id]?.lastUsed
      }))
      .filter(item => item.usageCount > 0)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 20);
    
    return toolsWithUsage;
  };

  // Memoize categories to prevent unnecessary re-renders, but include custom tools trigger
  const categoriesWithFavorites = React.useMemo(() => {
    return getCategoriesWithFavorites();
  }, [preferences.favoriteTools, customTools, customToolsUpdateTrigger]);

  const topTools = React.useMemo(() => {
    return getTopTools();
  }, [preferences.toolUsageStats, customTools, customToolsUpdateTrigger]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleAI={() => setIsAIOpen(true)}
        onShowInfo={() => setIsInfoOpen(true)}
        onShowSettings={() => setIsSettingsOpen(true)}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              Professional OSINT Investigation
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Advanced tools and AI-powered recommendations for cybersecurity researchers and digital investigators
            </p>
          </div>

          <SearchBar onSearch={handleSearch} />

          <FilterBar
            searchQuery={filterQuery}
            onSearchChange={setFilterQuery}
            activeTags={activeTags}
            onTagRemove={handleTagRemove}
            onClearAll={() => {
              setFilterQuery('');
              setActiveTags([]);
            }}
          />
        </motion.div>

        {/* Current Investigation Info */}
        {currentInput && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Current Investigation
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Analyzing <span className="font-mono font-semibold">{currentInput}</span> as{' '}
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-sm font-medium">
                    {inputType.toUpperCase()}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Tools updated and ready
                </div>
                {previousInput && previousInput !== currentInput && (
                  <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    Cache cleared
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Tools Box */}
        <TopToolsBox
          tools={topTools}
          onToolClick={handleToolClick}
          onToggleFavorite={handleToggleFavorite}
          favoriteTools={preferences.favoriteTools}
        />

        {/* Tool Categories */}
        <div className="space-y-6">
          <AnimatePresence>
            {categoriesWithFavorites.map((category) => {
              const filteredTools = getFilteredTools(category.tools);
              
              // Only render categories that have tools after filtering
              if (filteredTools.length === 0) return null;
              
              return (
                <ToolCategoryComponent
                  key={`${category.id}-${customToolsUpdateTrigger}`} // Force re-render with trigger
                  category={category}
                  tools={filteredTools}
                  isExpanded={expandedCategories[category.id] || false}
                  onToggleExpanded={() => handleCategoryToggle(category.id)}
                  onTagClick={handleTagClick}
                  onToggleFavorite={handleToggleFavorite}
                  favoriteTools={preferences.favoriteTools}
                  searchQuery={filterQuery}
                  onToolClick={handleToolClick}
                  toolUsageStats={preferences.toolUsageStats || {}}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <Footer onContactClick={() => setIsContactOpen(true)} />

      {/* Enhanced AI Assistant */}
      <EnhancedAIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onRecommendation={handleAIRecommendation}
        currentInput={currentInput}
        inputType={inputType}
      />

      {/* Settings Modal */}
      <LLMConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSave={setLlmConfigs}
        currentConfigs={llmConfigs}
        customTools={customTools}
        onCustomToolsChange={updateCustomTools}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          className: 'dark:bg-slate-800 dark:text-white',
        }}
      />
    </div>
  );
}

export default App;