import React, { useState } from 'react';
import { Clock, Search, Filter, X, Calendar, FileText, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvestigationHistory } from '../../types';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface HistoryBoxProps {
  history: InvestigationHistory[];
  onHistorySelect: (item: InvestigationHistory) => void;
  onHistoryDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryBox: React.FC<HistoryBoxProps> = ({
  history,
  onHistorySelect,
  onHistoryDelete,
  onClearAll
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Defensive check to ensure history is always an array
  const safeHistory = Array.isArray(history) ? history : [];

  const filteredHistory = safeHistory.filter(item => {
    const matchesSearch = item.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const uniqueTypes = Array.from(new Set(safeHistory.map(item => item.type)));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ip': return '🌐';
      case 'domain': return '🌍';
      case 'url': return '🔗';
      case 'hash': return '🔒';
      case 'email': return '📧';
      default: return '❓';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ip': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'domain': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'url': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'hash': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'email': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500 rounded-xl">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Investigation History
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {safeHistory.length} investigations • {filteredHistory.length} shown
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <Search className="w-4 h-4 text-slate-500" />
          </motion.button>
          {safeHistory.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearAll}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
              title="Clear all history"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search investigations..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>
                    {getTypeIcon(type)} {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History List */}
      <div className="max-h-80 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="p-6 text-center">
            <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              {safeHistory.length === 0 ? 'No investigations yet' : 'No matching investigations'}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredHistory.slice(0, 10).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                className="group p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition-colors"
                onClick={() => onHistorySelect(item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)} {item.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDistanceToNow(item.timestamp)}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-slate-900 dark:text-white truncate">
                      {item.input}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                        📝 {item.notes}
                      </p>
                    )}
                    {item.toolsUsed.length > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs text-slate-400">Tools:</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {item.toolsUsed.length} used
                        </span>
                      </div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onHistoryDelete(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded transition-all"
                    title="Delete"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
            {filteredHistory.length > 10 && (
              <div className="text-center p-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Showing 10 of {filteredHistory.length} investigations
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};