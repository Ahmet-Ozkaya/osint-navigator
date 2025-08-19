import React from 'react';
import { Moon, Sun, Search, Bot, Info, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleAI: () => void;
  onShowInfo: () => void;
  onShowSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onToggleAI,
  onShowInfo,
  onShowSettings
}) => {
  // Choose badge based on theme
  const boltBadgeUrl = theme === 'light' 
    ? 'https://github.com/kickiniteasy/bolt-hackathon-badge/blob/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.png?raw=true'
    : 'https://github.com/kickiniteasy/bolt-hackathon-badge/blob/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.png?raw=true';

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OSINT Navigator
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Professional Investigation Dashboard
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleAI}
              className="p-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              title="AI Assistant"
            >
              <Bot className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </motion.button>

            {onShowSettings && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowSettings}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowInfo}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200"
              title="Dashboard Info"
            >
              <Info className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};