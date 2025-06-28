import React from 'react';
import { X, Zap, Search, Filter, Star, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    OSINT Navigator Guide
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    How to use this dashboard effectively
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                      <Search className="w-5 h-5 mr-2 text-blue-500" />
                      Enter Your Investigation Target
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-2">
                      Use the main search bar to enter any of the following:
                    </p>
                    <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1 ml-4">
                      <li>• IP addresses (e.g., 192.168.1.1)</li>
                      <li>• Domain names (e.g., example.com)</li>
                      <li>• URLs (e.g., https://suspicious-site.com)</li>
                      <li>• File hashes (MD5, SHA1, SHA256)</li>
                      <li>• Email addresses</li>
                    </ul>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-purple-500" />
                      Analyze & Update Tools
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-2">
                      Click the "Analyze" button to:
                    </p>
                    <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1 ml-4">
                      <li>• Automatically detect the input type</li>
                      <li>• Update all relevant tool URLs with your input</li>
                      <li>• Enable one-click access to investigation tools</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                      <Filter className="w-5 h-5 mr-2 text-green-500" />
                      Filter & Organize
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-2">
                      Use the filter bar and tags to find the right tools:
                    </p>
                    <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1 ml-4">
                      <li>• Search by tool name or description</li>
                      <li>• Click on tags to filter by capability</li>
                      <li>• Expand/collapse categories as needed</li>
                    </ul>
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Pro Tips
                  </h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">★</span>
                      Star your favorite tools for quick access
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">🤖</span>
                      Use the AI Assistant for investigation guidance
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">🔄</span>
                      Tools marked as "Standalone\" work independently
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">⚡</span>
                      Status indicators show tool availability
                    </li>
                  </ul>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Keyboard Shortcuts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Focus search</span>
                      <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-xs">Ctrl + K</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Toggle theme</span>
                      <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-xs">Ctrl + D</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Open AI Assistant</span>
                      <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-xs">Ctrl + /</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Clear filters</span>
                      <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-xs">Esc</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};