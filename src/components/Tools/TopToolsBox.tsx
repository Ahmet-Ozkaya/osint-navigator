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
              Top 20 Most Used Tools
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your most frequently accessed OSINT tools
            </p>
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="max-h-96 overflow-y-auto">
        {tools.length === 0 ? (
          <div className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              No usage data yet
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Start using tools to see your top picks here
            </p>
          </div>
        ) : (
          <div className="p-2">
            {tools.map((item, index) => (
              <motion.div
                key={item.tool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="group flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition-colors"
                onClick={() => handleToolClick(item.tool)}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < 3 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Category Icon */}
                  <div className="flex-shrink-0 text-lg">
                    {getCategoryIcon(item.tool.category)}
                  </div>

                  {/* Tool Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-slate-900 dark:text-white truncate">
                        {item.tool.name}
                      </h4>
                      {favoriteTools.includes(item.tool.id) && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{item.usageCount} uses</span>
                      </span>
                      {item.lastUsed && (
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.lastUsed).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <div className="p-1 text-slate-400">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};