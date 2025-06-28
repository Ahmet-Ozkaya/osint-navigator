import React, { useState } from 'react';
import { X, Search, Filter, Star, Shuffle, Zap, Bot, Settings, Shield, Target, Database, Globe, Mail, Bug, Users, ChevronRight, ChevronDown, Lightbulb, AlertTriangle, CheckCircle, Clock, ExternalLink, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'getting-started': true
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Search className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Welcome to OSINT Navigator!</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Your comprehensive dashboard for Open Source Intelligence investigations. This guide will help you master every feature.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">1</div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-500" />
                  Enter Your Investigation Target
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  The main search bar automatically detects and processes various input types:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">IP Addresses</div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono text-xs">192.168.1.1, 8.8.8.8</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">Domain Names</div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono text-xs">example.com, malicious-site.net</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">URLs</div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono text-xs">https://suspicious-site.com/path</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">File Hashes</div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono text-xs">MD5, SHA1, SHA256</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">Email Addresses</div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono text-xs">user@domain.com</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">General Text</div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono text-xs">Usernames, company names</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">2</div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-500" />
                  Analyze & Update Tools
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  Click "Analyze" to automatically:
                </p>
                <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Detect input type (IP, domain, hash, etc.)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Update all relevant tool URLs with your input</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Clear previous analysis cache for fresh results</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Enable one-click access to investigation tools</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">3</div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-green-500" />
                  Filter & Organize
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  Use advanced filtering to find the right tools:
                </p>
                <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
                  <li className="flex items-start space-x-2">
                    <Search className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Search by tool name, description, or functionality</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Filter className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Click tags to filter by specific capabilities</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shuffle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Expand/collapse categories based on your needs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tool-categories',
      title: 'Tool Categories',
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 dark:text-slate-300">
            OSINT Navigator organizes tools into specialized categories for efficient investigations:
          </p>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-red-200 dark:border-red-700">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-6 h-6 text-red-600" />
                <h4 className="font-semibold text-slate-900 dark:text-white">🛡️ Threat Intelligence</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Advanced threat analysis and IOC investigation tools for cybersecurity professionals.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>• IBM X-Force Exchange</div>
                <div>• ThreatMiner</div>
                <div>• GreyNoise Intelligence</div>
                <div>• AlienVault OTX</div>
                <div>• Onyphe Data Scan</div>
                <div>• SOCRadar Threat Hunting</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-3 mb-3">
                <Globe className="w-6 h-6 text-blue-600" />
                <h4 className="font-semibold text-slate-900 dark:text-white">🌐 IP & Network Analysis</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Comprehensive IP address investigation and network reconnaissance tools.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>• AbuseIPDB</div>
                <div>• IPVoid Scanner</div>
                <div>• Criminal IP</div>
                <div>• IPinfo Geolocation</div>
                <div>• Spur VPN/Proxy Detection</div>
                <div>• Shodan IoT Search</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center space-x-3 mb-3">
                <Target className="w-6 h-6 text-green-600" />
                <h4 className="font-semibold text-slate-900 dark:text-white">🌍 Domain & DNS Analysis</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Domain registration, DNS investigation, and certificate transparency tools.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>• WhoisXML API</div>
                <div>• SecurityTrails DNS</div>
                <div>• Certificate Transparency</div>
                <div>• DNSdumpster</div>
                <div>• URLScan.io</div>
                <div>• Historical DNS Data</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-3 mb-3">
                <Mail className="w-6 h-6 text-purple-600" />
                <h4 className="font-semibold text-slate-900 dark:text-white">📧 Email Investigation</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Email address verification, breach checking, and reputation analysis.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>• Hunter.io Email Finder</div>
                <div>• Have I Been Pwned</div>
                <div>• EmailRep Reputation</div>
                <div>• Breach Databases</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="w-6 h-6 text-yellow-600" />
                <h4 className="font-semibold text-slate-900 dark:text-white">👥 Social Media & People</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                Social media investigation and people search capabilities.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>• Sherlock Username Hunt</div>
                <div>• Namechk Availability</div>
                <div>• Pipl People Search</div>
                <div>• Social Media OSINT</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-red-200 dark:border-red-700">
              <div className="flex items-center space-x-3 mb-3">
                <Bug className="w-6 h-6 text-red-600" />
                <h4 className="font-semibold text-slate-900 dark:text-white">🦠 Malware & File Analysis</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                File analysis, malware investigation, and sandbox environments.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>• VirusTotal Scanner</div>
                <div>• Hybrid Analysis</div>
                <div>• Joe Sandbox</div>
                <div>• ANY.RUN Interactive</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      icon: <Bot className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
              <Bot className="w-5 h-5 mr-2 text-blue-500" />
              Enhanced AI Analysis
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Get intelligent threat analysis and investigation guidance using advanced Large Language Models.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">🔧 Configuration</h4>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start space-x-3">
                  <Settings className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Multiple LLM Providers</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">OpenAI, Anthropic, Google Gemini, DeepSeek, Custom APIs</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Easy Setup</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Configure API keys and test connections instantly</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Smart Caching</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Responses cached to save API costs and improve speed</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">🎯 Analysis Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                  <div className="font-medium text-slate-900 dark:text-white mb-1">Threat Assessment</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Risk level analysis with confidence scores</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                  <div className="font-medium text-slate-900 dark:text-white mb-1">IOC Analysis</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Indicator of Compromise identification</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                  <div className="font-medium text-slate-900 dark:text-white mb-1">Tool Recommendations</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Best tools for your specific investigation</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                  <div className="font-medium text-slate-900 dark:text-white mb-1">Investigation Guidance</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Step-by-step analysis workflows</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">💡 Quick Analysis Prompts</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="font-medium text-blue-800 dark:text-blue-200">"Analyze this indicator for threats"</div>
                  <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">Get comprehensive threat analysis with risk assessment</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="font-medium text-green-800 dark:text-green-200">"What tools should I use for investigation?"</div>
                  <div className="text-xs text-green-600 dark:text-green-300 mt-1">Receive personalized tool recommendations</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="font-medium text-purple-800 dark:text-purple-200">"Provide investigation recommendations"</div>
                  <div className="text-xs text-purple-600 dark:text-purple-300 mt-1">Get structured investigation workflows</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tool-management',
      title: 'Tool Management',
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Customize Your Toolkit</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Add, manage, and organize your own OSINT tools alongside the built-in collection.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-500" />
                Export & Import
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="font-medium text-slate-900 dark:text-white mb-2">📄 JSON Export</div>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Complete tool data with metadata</li>
                    <li>• Category information preserved</li>
                    <li>• Version and timestamp included</li>
                    <li>• Perfect for backups and sharing</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="font-medium text-slate-900 dark:text-white mb-2">📊 CSV Export</div>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Spreadsheet-compatible format</li>
                    <li>• Easy to edit in Excel/Sheets</li>
                    <li>• Bulk tool management</li>
                    <li>• Import from external sources</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-green-500" />
                Custom Tools
              </h4>
              <div className="space-y-3">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="font-medium text-slate-900 dark:text-white mb-2">Adding New Tools</div>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Name, URL, and description required</li>
                    <li>• Automatic input type detection</li>
                    <li>• Custom categories and tags</li>
                    <li>• Standalone tool support</li>
                    <li>• Status tracking (online/offline/slow)</li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                  <div className="font-medium text-amber-800 dark:text-amber-200 mb-2">💡 Pro Tips</div>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Use YOUR_INPUT as placeholder in URLs</li>
                    <li>• Mark tools as "standalone" if they don't use query parameters</li>
                    <li>• Add relevant tags for better filtering</li>
                    <li>• Test your custom tools after adding</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">🔄 Data Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                  <div className="font-medium text-slate-900 dark:text-white">Local Storage</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tools saved in browser</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                  <div className="font-medium text-slate-900 dark:text-white">No Account Needed</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Works offline</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                  <div className="font-medium text-slate-900 dark:text-white">Privacy First</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Data stays local</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      icon: <Zap className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Favorites System
              </h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <li className="flex items-start space-x-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>Click the star icon on any tool to add to favorites</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Favorites appear in a dedicated category at the top</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Quick access to your most-used tools</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Database className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Favorites sync across browser sessions</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-500" />
                Smart Filtering
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="font-medium text-slate-900 dark:text-white mb-2">Text Search</div>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Search tool names</li>
                    <li>• Search descriptions</li>
                    <li>• Search tags</li>
                    <li>• Real-time filtering</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="font-medium text-slate-900 dark:text-white mb-2">Tag Filtering</div>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Click any tag to filter</li>
                    <li>• Multiple tag selection</li>
                    <li>• Visual filter indicators</li>
                    <li>• One-click clear all</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-500" />
                Tool Status Indicators
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <div className="font-medium text-slate-900 dark:text-white">Online</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Fully operational</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                  <div className="font-medium text-slate-900 dark:text-white">Slow</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">May be delayed</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
                  <div className="font-medium text-slate-900 dark:text-white">Offline</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Currently down</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto mb-2"></div>
                  <div className="font-medium text-slate-900 dark:text-white">Unknown</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Status unclear</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-500" />
                Cache Management
              </h4>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <li className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Automatic cache clearing when switching between different inputs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>AI analysis results cached for 1 hour to save API costs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>Manual cache clear when clearing search input</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Database className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Session-based storage for temporary analysis data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Shortcuts',
      icon: <Lightbulb className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">⚡ Power User Shortcuts</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Master these keyboard shortcuts to navigate OSINT Navigator like a pro.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">🔍 Navigation Shortcuts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-300">Focus search bar</span>
                  <kbd className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded text-sm font-mono">Ctrl + K</kbd>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-300">Toggle theme</span>
                  <kbd className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded text-sm font-mono">Ctrl + D</kbd>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-300">Open AI Assistant</span>
                  <kbd className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded text-sm font-mono">Ctrl + /</kbd>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-300">Clear filters</span>
                  <kbd className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded text-sm font-mono">Esc</kbd>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">💡 Pro Tips</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="font-medium text-blue-800 dark:text-blue-200 mb-2">Quick Search Access</div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Press <kbd className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">Ctrl + K</kbd> from anywhere 
                    to instantly focus the search bar and start a new investigation.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="font-medium text-green-800 dark:text-green-200 mb-2">Theme Switching</div>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Quickly toggle between light and dark themes with <kbd className="px-2 py-1 bg-green-200 dark:bg-green-800 rounded text-xs">Ctrl + D</kbd> 
                    for optimal viewing in any environment.
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="font-medium text-purple-800 dark:text-purple-200 mb-2">AI Assistant Access</div>
                  <p className="text-sm text-purple-600 dark:text-purple-300">
                    Launch the AI Assistant instantly with <kbd className="px-2 py-1 bg-purple-200 dark:bg-purple-800 rounded text-xs">Ctrl + /</kbd> 
                    for immediate threat analysis and guidance.
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                  <div className="font-medium text-amber-800 dark:text-amber-200 mb-2">Filter Management</div>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    Clear all active filters and search terms instantly with <kbd className="px-2 py-1 bg-amber-200 dark:bg-amber-800 rounded text-xs">Esc</kbd> 
                    to reset your view.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'investigation-workflows',
      title: 'Investigation Workflows',
      icon: <Target className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">🎯 Structured Investigation Approaches</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Follow these proven workflows for different types of OSINT investigations.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-500" />
                Malware Investigation Workflow
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Initial Hash Analysis</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Start with VirusTotal for quick multi-engine scanning</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Behavioral Analysis</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Use Hybrid Analysis for detailed behavioral reports</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Interactive Analysis</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Deploy ANY.RUN for real-time sandbox interaction</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">IOC Extraction</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Gather IPs, domains, and URLs for further investigation</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-500" />
                Suspicious IP Investigation
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Reputation Check</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Check AbuseIPDB for abuse reports and reputation</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Service Discovery</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Use Shodan to identify exposed services and ports</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Scanning Activity</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Analyze with GreyNoise for internet-wide scanning patterns</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Geolocation & ASN</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Use IPinfo for geographic and network ownership data</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-500" />
                Phishing Email Analysis
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Email Reputation</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Check sender reputation with EmailRep</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Breach History</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Verify with Have I Been Pwned for compromise history</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">URL Analysis</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Safely analyze suspicious links with URLScan.io</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-lime-50 dark:bg-lime-900/20 rounded-lg border border-lime-200 dark:border-lime-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-lime-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Domain Investigation</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Research sender domain with SecurityTrails and WHOIS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">✅ OSINT Investigation Best Practices</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Follow these guidelines to conduct effective and ethical OSINT investigations.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                Security & Privacy
              </h4>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="font-medium text-blue-800 dark:text-blue-200 mb-2">🔒 Use VPN/Proxy</div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Always use a VPN or proxy when investigating suspicious domains or IPs to protect your identity and location.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="font-medium text-green-800 dark:text-green-200 mb-2">🖥️ Isolated Environment</div>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Use virtual machines or isolated browsers when analyzing potentially malicious content to prevent system compromise.
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="font-medium text-purple-800 dark:text-purple-200 mb-2">📝 Document Everything</div>
                  <p className="text-sm text-purple-600 dark:text-purple-300">
                    Keep detailed records of your investigation steps, findings, and timestamps for legal and reporting purposes.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-500" />
                Investigation Methodology
              </h4>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                  <div className="font-medium text-red-800 dark:text-red-200 mb-2">🎯 Start Broad, Then Narrow</div>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Begin with general reputation checks before diving into specific technical analysis. Use multiple sources to verify findings.
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                  <div className="font-medium text-orange-800 dark:text-orange-200 mb-2">🔄 Cross-Reference Sources</div>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    Never rely on a single tool or source. Cross-reference findings across multiple platforms for accuracy and completeness.
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⏰ Consider Time Context</div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Pay attention to timestamps and historical data. Threat landscapes change rapidly, so recent data is often more relevant.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                Legal & Ethical Considerations
              </h4>
              <div className="space-y-3">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                  <div className="font-medium text-amber-800 dark:text-amber-200 mb-2">⚖️ Know Your Jurisdiction</div>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    Understand the legal implications of your investigations in your jurisdiction. Some activities may require authorization.
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                  <div className="font-medium text-red-800 dark:text-red-200 mb-2">🚫 Passive Investigation Only</div>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Stick to passive reconnaissance. Never attempt to access systems without authorization or engage in active exploitation.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="font-medium text-blue-800 dark:text-blue-200 mb-2">🤝 Respect Privacy</div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Respect individual privacy rights and only investigate what is necessary for your legitimate security purposes.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Efficiency Tips
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">🌟 Use Favorites</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Star frequently used tools for quick access</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">🏷️ Tag Filtering</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Use tags to quickly find tools for specific tasks</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">🤖 AI Assistance</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Leverage AI for analysis guidance and tool recommendations</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">⌨️ Keyboard Shortcuts</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Master shortcuts for faster navigation</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">📊 Custom Tools</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Add your own specialized tools to the dashboard</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="font-medium text-slate-900 dark:text-white mb-1">💾 Export/Import</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Share tool configurations across teams</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

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
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      OSINT Navigator
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Complete Guide
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </motion.button>
              </div>

              {/* Navigation */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className={`${activeSection === section.id ? 'text-white' : 'text-slate-500'}`}>
                        {section.icon}
                      </div>
                      <span className="font-medium">{section.title}</span>
                      {activeSection === section.id && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </motion.button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Content Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-500">
                    {currentSection.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {currentSection.title}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentSection.content}
                </motion.div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Need help? Check out the other sections or use the AI Assistant for personalized guidance.
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Built with Bolt.new
                    </span>
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