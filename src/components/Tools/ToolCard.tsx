import React from 'react';
import { ExternalLink, Star, Clock, Zap, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { OSINTTool } from '../../types';

interface ToolCardProps {
  tool: OSINTTool;
  onTagClick: (tag: string) => void;
  onToggleFavorite: (toolId: string) => void;
  isFavorite: boolean;
  searchQuery?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onTagClick,
  onToggleFavorite,
  isFavorite,
  searchQuery
}) => {
  const getStatusIcon = () => {
    switch (tool.status) {
      case 'online':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case 'slow':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'offline':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusText = () => {
    switch (tool.status) {
      case 'online':
        return 'Online';
      case 'slow':
        return 'Slow';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite(tool.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer overflow-hidden h-[280px] flex flex-col"
      onClick={handleCardClick}
    >
      {/* Favorite star - Top Left */}
      <div className="absolute top-3 left-3 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' 
              : 'text-slate-400 hover:text-yellow-500 bg-slate-50 dark:bg-slate-700/50 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Status indicator - Top Right */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center space-x-1" title={getStatusText()}>
          {getStatusIcon()}
        </div>
      </div>

      {/* Standalone indicator - Top Right (below status) */}
      {tool.isStandalone && (
        <div className="absolute top-12 right-3">
          <div className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Standalone</span>
          </div>
        </div>
      )}

      {/* Main content area - flex-1 to fill available space */}
      <div className="p-6 pt-12 flex-1 flex flex-col">
        {/* Title and description - fixed height area */}
        <div className="flex-shrink-0 mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
            {tool.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed min-h-[4.5rem]">
            {tool.description}
          </p>
        </div>

        {/* Tags - fixed height area */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex flex-wrap gap-1 min-h-[2rem]">
            {tool.tags.slice(0, 3).map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {tag}
              </motion.button>
            ))}
            {tool.tags.length > 3 && (
              <span className="px-2 py-1 text-slate-400 text-xs">
                +{tool.tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Usage stats - flex-grow to push external link to bottom */}
        <div className="flex-grow flex flex-col justify-end">
          {tool.usageCount && (
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
              <Clock className="w-3 h-3 mr-1" />
              Used {tool.usageCount} times
              {tool.lastUsed && (
                <span className="ml-2">
                  • Last: {new Date(tool.lastUsed).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* External link icon - Bottom Right - absolute positioned */}
      <div className="absolute bottom-3 right-3">
        <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full opacity-60 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};