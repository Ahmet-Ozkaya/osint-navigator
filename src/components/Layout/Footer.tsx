import React from 'react';
import { Heart, Github, Mail, ExternalLink, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterProps {
  // No props needed anymore
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OSINT Navigator
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Professional Investigation Dashboard
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A comprehensive OSINT toolkit designed for cybersecurity professionals, 
              researchers, and digital investigators. Built with modern web technologies 
              and AI-powered analysis capabilities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Quick Links</h4>
            <div className="space-y-2">
              <motion.a
                whileHover={{ x: 4 }}
                href="mailto:contact@nova-saas.com"
                className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Contact & Suggestions</span>
              </motion.a>
              <motion.a
                whileHover={{ x: 4 }}
                href="https://github.com/topics/osint"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>OSINT Resources</span>
                <ExternalLink className="w-3 h-3" />
              </motion.a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Features</h4>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>100+ OSINT Tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Custom Tool Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span>Dark/Light Theme</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <span>Export/Import Tools</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for the OSINT community</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:contact@nova-saas.com"
                className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                <Send className="w-3 h-3" />
                <span>Send Feedback</span>
              </motion.a>
              
              <div className="text-sm text-slate-500 dark:text-slate-400">
                © 2025 OSINT Navigator
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};