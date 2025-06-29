import React from 'react';
import { TrendingUp, Clock, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { OSINTTool } from '../../types';

interface TopToolsBoxProps {
  tools: Array<{ tool: OSINTTool; usageCount: number; lastUsed?: Date }>;
  onToolClick: (toolId: string) => void;
  onToggleFavorite: (toolId: string) => void;
  favoriteTools: string[];
}

export const TopToolsBox: React.FC<TopToolsBoxProps> = ({
  tools,
  onToolClick,
  onToggleFavorite,
  favoriteTools
}) => {
  const handleToolClick = (tool: OSINTTool) => {
    onToolClick(tool.id);
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'threat-intel': return '🛡️';
      case 'ip-analysis': return '🌐';
      case 'domain-analysis': return '🌍';
      case 'email-analysis': return '📧';
      case 'social-media': return '👥';
      case 'malware-analysis': return '🦠';
      case 'custom': return '⚙️';
      default: return '🔧';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Top 12 Most Used Tools
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your most frequently accessed OSINT tools
            </p>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="p-6">
        {tools.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              No usage data yet
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Start using tools to see your top picks here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((item, index) => (
              <motion.div
                key={item.tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="group bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => handleToolClick(item.tool)}
              >
                {/* Header with rank and favorite */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index < 3 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                  }`}>
                    {index + 1}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.tool.id);
                    }}
                    className={`p-1 rounded transition-colors ${
                      favoriteTools.includes(item.tool.id)
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-slate-400 hover:text-yellow-500'
                    }`}
                    title={favoriteTools.includes(item.tool.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${favoriteTools.includes(item.tool.id) ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>

                {/* Category icon and tool name */}
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-2xl">
                    {getCategoryIcon(item.tool.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.tool.name}
                    </h4>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                  {item.tool.description}
                </p>

                {/* Usage stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{item.usageCount} uses</span>
                  </div>
                  {item.lastUsed && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.lastUsed).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* External link indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};