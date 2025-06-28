import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Settings, Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIRecommendation, LLMConfig, AIAnalysisRequest, AIAnalysisResponse } from '../../types';
import { LLMService } from '../../services/llmService';
import { LLMConfigModal } from './LLMConfigModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { detectInputType } from '../../utils/inputDetection';
import toast from 'react-hot-toast';

interface EnhancedAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommendation: (recommendation: AIRecommendation) => void;
  currentInput?: string;
  inputType?: string;
}

interface ConversationMessage {
  type: 'user' | 'ai' | 'analysis';
  content: string;
  timestamp: Date;
  analysis?: AIAnalysisResponse;
  isLoading?: boolean;
}

export const EnhancedAIAssistant: React.FC<EnhancedAIAssistantProps> = ({
  isOpen,
  onClose,
  onRecommendation,
  currentInput,
  inputType
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [llmConfigs, setLlmConfigs] = useLocalStorage<LLMConfig[]>('llm-configs', []);
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConfigs = llmConfigs.filter(config => config.isActive);
  const currentConfig = activeConfigs[selectedConfigIndex];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    if (!currentConfig) {
      toast.error('Please configure an LLM provider first');
      setIsConfigOpen(true);
      return;
    }

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Add user message to conversation
    const newUserMessage: ConversationMessage = {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, newUserMessage]);

    try {
      const service = new LLMService(currentConfig);
      
      // Determine if this is an analysis request or general inquiry
      const isAnalysisRequest = currentInput || userMessage.match(/analyze|investigate|check|scan/i);
      
      if (isAnalysisRequest) {
        const analysisRequest: AIAnalysisRequest = {
          input: currentInput || userMessage,
          inputType: inputType || detectInputType(currentInput || userMessage),
          context: currentInput ? `User is investigating: ${currentInput}. Question: ${userMessage}` : undefined,
          analysisType: determineAnalysisType(userMessage)
        };

        const analysisResponse = await service.analyze(analysisRequest);
        
        const analysisMessage: ConversationMessage = {
          type: 'analysis',
          content: analysisResponse.analysis,
          timestamp: new Date(),
          analysis: analysisResponse
        };

        setConversation(prev => [...prev, analysisMessage]);

        // Trigger recommendations if any
        if (analysisResponse.recommendations.length > 0) {
          analysisResponse.recommendations.forEach(rec => onRecommendation(rec));
        }
      } else {
        // General inquiry
        const generalRequest: AIAnalysisRequest = {
          input: userMessage,
          inputType: 'general',
          analysisType: 'general-inquiry'
        };

        const response = await service.analyze(generalRequest);
        
        const aiMessage: ConversationMessage = {
          type: 'ai',
          content: response.analysis,
          timestamp: new Date()
        };

        setConversation(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      const errorMessage: ConversationMessage = {
        type: 'ai',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your LLM configuration.`,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
      toast.error('AI analysis failed. Please check your configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const determineAnalysisType = (message: string): AIAnalysisRequest['analysisType'] => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('threat') || lowerMessage.includes('malicious') || lowerMessage.includes('dangerous')) {
      return 'threat-assessment';
    }
    if (lowerMessage.includes('ioc') || lowerMessage.includes('indicator')) {
      return 'ioc-analysis';
    }
    if (lowerMessage.includes('tool') || lowerMessage.includes('recommend')) {
      return 'tool-recommendation';
    }
    return 'general-inquiry';
  };

  const quickAnalysisPrompts = [
    "Analyze this indicator for threats",
    "What tools should I use for investigation?",
    "Assess the risk level of this input",
    "Provide investigation recommendations"
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-slate-600 bg-slate-50 dark:bg-slate-700';
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-20 right-6 w-96 h-[700px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Enhanced AI Assistant
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentConfig ? `Using ${currentConfig.providerId}` : 'No LLM configured'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsConfigOpen(true)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Configure LLM"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </motion.button>
              </div>
            </div>

            {/* LLM Selection */}
            {activeConfigs.length > 1 && (
              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <select
                  value={selectedConfigIndex}
                  onChange={(e) => setSelectedConfigIndex(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {activeConfigs.map((config, index) => (
                    <option key={index} value={index}>
                      {config.providerId} - {config.modelId}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Enhanced AI Analysis
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Get detailed threat analysis and investigation guidance using advanced LLMs.
                  </p>
                  
                  {currentInput && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Current Investigation:
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 font-mono">
                        {currentInput}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Quick Analysis:
                    </p>
                    {quickAnalysisPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMessage(prompt)}
                        className="block w-full text-left p-2 text-xs bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {conversation.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : msg.type === 'analysis'
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 text-slate-900 dark:text-white border border-purple-200 dark:border-purple-700'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  } p-3 rounded-2xl`}>
                    
                    {msg.type === 'analysis' && msg.analysis && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                            AI ANALYSIS
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(msg.analysis.riskLevel)}`}>
                            {msg.analysis.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        
                        {msg.analysis.indicators.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                              Key Indicators:
                            </p>
                            <div className="space-y-1">
                              {msg.analysis.indicators.slice(0, 3).map((indicator, i) => (
                                <div key={i} className="text-xs bg-white dark:bg-slate-800 p-2 rounded border">
                                  {indicator}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    
                    {msg.analysis?.nextSteps && msg.analysis.nextSteps.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                          Recommended Next Steps:
                        </p>
                        <div className="space-y-1">
                          {msg.analysis.nextSteps.slice(0, 3).map((step, i) => (
                            <div key={i} className="text-xs flex items-start space-x-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">AI is analyzing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={currentConfig ? "Ask about threats, tools, or analysis..." : "Configure LLM first"}
                  disabled={isLoading || !currentConfig}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={!message.trim() || isLoading || !currentConfig}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              
              {!currentConfig && (
                <div className="mt-2 flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>Configure an LLM provider to enable AI analysis</span>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LLM Configuration Modal */}
      <LLMConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onConfigSave={setLlmConfigs}
        currentConfigs={llmConfigs}
      />
    </>
  );
};