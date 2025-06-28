import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Lightbulb, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIRecommendation } from '../../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommendation: (recommendation: AIRecommendation) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  onRecommendation
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Add user message to conversation
    setConversation(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    // Simulate AI response (in a real app, this would call your AI service)
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setConversation(prev => [...prev, {
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date()
      }]);
      
      if (aiResponse.recommendation) {
        onRecommendation(aiResponse.recommendation);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): {
    content: string;
    recommendation?: AIRecommendation;
  } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('malware') || message.includes('virus') || message.includes('suspicious file')) {
      return {
        content: "For malware analysis, I recommend starting with VirusTotal for quick scanning, then using Hybrid Analysis for deeper behavioral analysis. If you need interactive analysis, ANY.RUN provides an excellent sandbox environment.",
        recommendation: {
          tools: ['virustotal', 'hybrid-analysis', 'any-run'],
          reasoning: 'These tools provide comprehensive malware analysis capabilities',
          confidence: 0.95,
          steps: [
            '1. Upload file to VirusTotal for initial scan',
            '2. Use Hybrid Analysis for behavioral analysis',
            '3. If needed, run interactive analysis in ANY.RUN'
          ]
        }
      };
    }
    
    if (message.includes('phishing') || message.includes('suspicious email')) {
      return {
        content: "For phishing investigation, start by analyzing the sender's reputation with EmailRep, check if the domain is in breach databases with Have I Been Pwned, and use URLScan.io to safely analyze any suspicious links.",
        recommendation: {
          tools: ['emailrep', 'haveibeenpwned', 'urlscan'],
          reasoning: 'These tools help analyze email threats and suspicious URLs safely',
          confidence: 0.9,
          steps: [
            '1. Check email reputation with EmailRep',
            '2. Verify sender history with Have I Been Pwned',
            '3. Analyze URLs with URLScan.io'
          ]
        }
      };
    }
    
    if (message.includes('ip') || message.includes('network') || message.includes('scanning')) {
      return {
        content: "For IP investigation, I suggest using AbuseIPDB to check reputation, Shodan for discovering exposed services, and GreyNoise to understand if it's part of internet-wide scanning activity.",
        recommendation: {
          tools: ['abuseipdb', 'shodan', 'greynoise'],
          reasoning: 'These tools provide comprehensive IP intelligence and reputation data',
          confidence: 0.92,
          steps: [
            '1. Check IP reputation with AbuseIPDB',
            '2. Discover exposed services with Shodan',
            '3. Analyze scanning behavior with GreyNoise'
          ]
        }
      };
    }
    
    return {
      content: "I can help you choose the right OSINT tools for your investigation. Could you provide more details about what you're investigating? For example:\n\n• Suspicious files or malware\n• Phishing emails or domains\n• IP addresses or network activity\n• Social media accounts\n• Domain registration information\n\nThe more specific you are, the better recommendations I can provide!"
    };
  };

  const quickPrompts = [
    "How do I investigate a suspicious IP address?",
    "What tools are best for malware analysis?",
    "How can I track down a phishing domain?",
    "What's the best way to research a person online?"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-20 right-6 w-96 h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  OSINT Assistant
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your investigation companion
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </motion.button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Hello! I'm your OSINT Assistant
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Ask me about investigation techniques, tool recommendations, or specific indicators.
                </p>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Quick prompts:
                  </p>
                  {quickPrompts.map((prompt, index) => (
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
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
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
                    <span className="text-xs text-slate-500 dark:text-slate-400">AI is thinking...</span>
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
                placeholder="Ask about OSINT tools or techniques..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50"
              />
              <motion.button
                type="submit"
                disabled={!message.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};