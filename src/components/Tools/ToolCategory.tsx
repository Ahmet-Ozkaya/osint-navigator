import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolCategory as ToolCategoryType, OSINTTool } from '../../types';
import { ToolCard } from './ToolCard';
import { ToolListView } from './ToolListView';

interface ToolCategoryProps {
  category: ToolCategoryType;
  tools: OSINTTool[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onTagClick: (tag: string) => void;
  onToggleFavorite: (toolId: string) => void;
  favoriteTools: string[];
  searchQuery: string;
  viewMode: 'card' | 'list';
  onToolUpdate: (tool: OSINTTool) => void;
}

export const ToolCategoryComponent: React.FC<ToolCategoryProps> = ({
  category,
  tools,
  isExpanded,
  onToggleExpanded,
  onTagClick,
  onToggleFavorite,
  favoriteTools,
  searchQuery,
  viewMode,
  onToolUpdate
}) => {
  if (tools.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <motion.button
        onClick={onToggleExpanded}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 mb-4"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{category.icon}</span>
          <div className="text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {category.name}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {category.description} • {tools.length} tools
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ToolCard
                      tool={tool}
                      onTagClick={onTagClick}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={favoriteTools.includes(tool.id)}
                      searchQuery={searchQuery}
                      onToolUpdate={onToolUpdate}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <ToolListView
                tools={tools}
                onTagClick={onTagClick}
                onToggleFavorite={onToggleFavorite}
                favoriteTools={favoriteTools}
                onToolUpdate={onToolUpdate}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};