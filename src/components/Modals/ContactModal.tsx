import React, { useState } from 'react';
import { X, Send, Mail, Phone, User, MessageSquare, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  suggestionType: 'feature' | 'tool' | 'bug' | 'general';
  details: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    suggestionType: 'general',
    details: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.details.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission (in a real app, this would send to your backend)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store the suggestion locally for demo purposes
      const suggestion = {
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      
      const existingSuggestions = JSON.parse(localStorage.getItem('osint-suggestions') || '[]');
      localStorage.setItem('osint-suggestions', JSON.stringify([suggestion, ...existingSuggestions]));
      
      setIsSubmitted(true);
      toast.success('Thank you for your suggestion! We appreciate your feedback.');
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          suggestionType: 'general',
          details: ''
        });
        onClose();
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestionTypes = [
    { value: 'feature', label: 'Feature Request', icon: '✨' },
    { value: 'tool', label: 'New Tool Suggestion', icon: '🔧' },
    { value: 'bug', label: 'Bug Report', icon: '🐛' },
    { value: 'general', label: 'General Feedback', icon: '💬' }
  ];

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
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Contact & Suggestions
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Help us improve OSINT Navigator
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
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Thank You!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Your suggestion has been submitted successfully. We appreciate your feedback and will review it carefully.
                  </p>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    This window will close automatically...
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Name *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your full name"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Mail className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Phone className="w-4 h-4 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>

                  {/* Suggestion Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Type of Suggestion *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {suggestionTypes.map((type) => (
                        <motion.label
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center space-x-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                            formData.suggestionType === type.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-slate-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="suggestionType"
                            value={type.value}
                            checked={formData.suggestionType === type.value}
                            onChange={(e) => handleInputChange('suggestionType', e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-lg">{type.icon}</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {type.label}
                          </span>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Details *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                      </div>
                      <textarea
                        value={formData.details}
                        onChange={(e) => handleInputChange('details', e.target.value)}
                        placeholder="Please provide detailed information about your suggestion, feature request, or feedback. The more specific you are, the better we can help!"
                        required
                        rows={5}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      />
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formData.details.length}/500 characters
                    </div>
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Privacy Notice
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Your information will be stored locally in your browser for demo purposes. 
                      In a production environment, this would be securely transmitted to our servers 
                      and used only to respond to your inquiry and improve our services.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="px-6 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{isSubmitting ? 'Submitting...' : 'Send Suggestion'}</span>
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};