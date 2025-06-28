import React, { useState } from 'react';
import { ExternalLink, Star, Clock, Zap, FileText, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { OSINTTool } from '../../types';
import { ToolNotesModal } from './ToolNotesModal';

interface ToolListViewProps {
  tools: OSINTTool[];
  onTagClick: (tag: string) => void;
  onToggleFavorite: (toolId: string) => void;
  favoriteTools: string[];
  onToolUpdate: (tool: OSINTTool) => void;
}

export const ToolListView: React.FC<ToolListViewProps> = ({
  tools,
  onTagClick,
  onToggleFavorite,
  favoriteTools,
  onToolUpdate
}) => {
  const [notesModalTool, setNotesModalTool] = useState<OSINTTool | null>(null);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'online':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'slow':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'offline':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const handleToolClick = (tool: OSINTTool) => {
    // Update usage count and last used
    const updatedTool = {
      ...tool,
      usageCount: (tool.usageCount || 0) + 1,
      lastUsed: new Date()
    };
    onToolUpdate(updatedTool);
    
    // Open tool in new tab
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  const handleNotesUpdate = (tool: OSINTTool, notes: any[]) => {
    const updatedTool = { ...tool, notes };
    onToolUpdate(updatedTool);
  };

  return (
    <>
      <div className="space-y-2">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                {/* Status and Favorite */}
                <div className="flex flex-col items-center space-y-2">
                  <div title={tool.status || 'unknown'}>
                    {getStatusIcon(tool.status)}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggleFavorite(tool.id)}
                    className={`p-1 rounded-full transition-colors ${
                      favoriteTools.includes(tool.id)
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-slate-400 hover:text-yellow-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${favoriteTools.includes(tool.id) ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleToolClick(tool)}
                          className="text-lg font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {tool.name}
                        </motion.button>
                        {tool.isStandalone && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded text-xs font-medium">
                            <Zap className="w-3 h-3 inline mr-1" />
                            Standalone
                          </span>
                        )}
                        {tool.notes && tool.notes.length > 0 && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                            📝 {tool.notes.length}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {tool.tags.slice(0, 5).map((tag) => (
                          <motion.button
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => onTagClick(tag)}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {tag}
                          </motion.button>
                        ))}
                        {tool.tags.length > 5 && (
                          <span className="px-2 py-1 text-slate-400 text-xs">
                            +{tool.tags.length - 5}
                          </span>
                        )}
                      </div>
                      {tool.usageCount && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
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

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setNotesModalTool(tool)}
                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Manage notes"
                      >
                        <FileText className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToolClick(tool)}
                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Open tool"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notes Modal */}
      {notesModalTool && (
        <ToolNotesModal
          isOpen={true}
          onClose={() => setNotesModalTool(null)}
          toolName={notesModalTool.name}
          notes={notesModalTool.notes || []}
          onNotesUpdate={(notes) => handleNotesUpdate(notesModalTool, notes)}
        />
      )}
    </>
  );
};