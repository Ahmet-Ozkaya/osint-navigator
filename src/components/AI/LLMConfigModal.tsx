import React, { useState, useEffect } from 'react';
import { X, Plus, Settings, TestTube, Check, AlertCircle, Eye, EyeOff, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LLMConfig, LLMProvider, OSINTTool } from '../../types';
import { defaultLLMProviders } from '../../data/llmProviders';
import { LLMService } from '../../services/llmService';
import { ToolManagementModal } from '../Tools/ToolManagementModal';
import toast from 'react-hot-toast';

interface LLMConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSave: (configs: LLMConfig[]) => void;
  currentConfigs: LLMConfig[];
  customTools: OSINTTool[];
  onCustomToolsChange: (tools: OSINTTool[] | ((prev: OSINTTool[]) => OSINTTool[])) => void;
}

export const LLMConfigModal: React.FC<LLMConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSave,
  currentConfigs,
  customTools,
  onCustomToolsChange
}) => {
  const [configs, setConfigs] = useState<LLMConfig[]>(currentConfigs);
  const [customProviders, setCustomProviders] = useState<LLMProvider[]>([]);
  const [activeTab, setActiveTab] = useState<'providers' | 'custom' | 'tools'>('providers');
  const [testingConfig, setTestingConfig] = useState<string | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [isToolManagementOpen, setIsToolManagementOpen] = useState(false);

  useEffect(() => {
    setConfigs(currentConfigs);
  }, [currentConfigs]);

  const allProviders = [...defaultLLMProviders, ...customProviders];

  const handleConfigChange = (index: number, field: keyof LLMConfig, value: any) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setConfigs(newConfigs);
  };

  const addNewConfig = (providerId: string) => {
    const provider = allProviders.find(p => p.id === providerId);
    if (!provider) return;

    const newConfig: LLMConfig = {
      providerId,
      modelId: provider.models[0]?.id || '',
      apiKey: '',
      maxTokens: 4000,
      temperature: 0.7,
      isActive: false
    };

    setConfigs([...configs, newConfig]);
  };

  const removeConfig = (index: number) => {
    const newConfigs = configs.filter((_, i) => i !== index);
    setConfigs(newConfigs);
  };

  const testConnection = async (config: LLMConfig, index: number) => {
    if (!config.apiKey.trim()) {
      toast.error('Please enter an API key first');
      return;
    }

    setTestingConfig(`${config.providerId}-${index}`);
    
    try {
      const service = new LLMService(config);
      const isConnected = await service.testConnection();
      
      if (isConnected) {
        toast.success(`${allProviders.find(p => p.id === config.providerId)?.name} connection successful!`);
      } else {
        toast.error('Connection test failed');
      }
    } catch (error) {
      toast.error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTestingConfig(null);
    }
  };

  const addCustomProvider = () => {
    const newProvider: LLMProvider = {
      id: `custom-${Date.now()}`,
      name: 'Custom Provider',
      baseUrl: 'https://api.example.com/v1',
      requiresAuth: true,
      authType: 'bearer',
      isCustom: true,
      models: [
        {
          id: 'custom-model',
          name: 'Custom Model',
          description: 'Custom model description',
          contextLength: 4096,
          capabilities: ['reasoning', 'analysis']
        }
      ]
    };

    setCustomProviders([...customProviders, newProvider]);
  };

  const updateCustomProvider = (index: number, field: keyof LLMProvider, value: any) => {
    const newProviders = [...customProviders];
    newProviders[index] = { ...newProviders[index], [field]: value };
    setCustomProviders(newProviders);
  };

  const removeCustomProvider = (index: number) => {
    const providerId = customProviders[index].id;
    setCustomProviders(customProviders.filter((_, i) => i !== index));
    setConfigs(configs.filter(config => config.providerId !== providerId));
  };

  const handleSave = () => {
    const validConfigs = configs.filter(config => 
      config.apiKey.trim() && config.modelId && config.providerId
    );

    if (validConfigs.length === 0) {
      toast.error('Please configure at least one valid LLM provider');
      return;
    }

    onConfigSave(validConfigs);
    toast.success('LLM configurations saved successfully!');
    onClose();
  };

  const toggleApiKeyVisibility = (configId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [configId]: !prev[configId]
    }));
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'openai': return '🤖';
      case 'anthropic': return '🧠';
      case 'google': return '🔍';
      case 'deepseek': return '🌊';
      default: return '⚙️';
    }
  };

  return (
    <>
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
              className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Settings
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Configure AI providers and manage tools
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

              {/* Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab('providers')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'providers'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  LLM Providers
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'custom'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Custom Providers
                </button>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'tools'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Tool Management
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {activeTab === 'providers' && (
                  <div className="space-y-6">
                    {/* Add New Configuration */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Add New Provider
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {allProviders.map((provider) => (
                          <motion.button
                            key={provider.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addNewConfig(provider.id)}
                            className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-center"
                          >
                            <div className="text-2xl mb-1">{getProviderIcon(provider.id)}</div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {provider.name}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Existing Configurations */}
                    <div className="space-y-4">
                      {configs.map((config, index) => {
                        const provider = allProviders.find(p => p.id === config.providerId);
                        if (!provider) return null;

                        const configId = `${config.providerId}-${index}`;
                        const isTestingThis = testingConfig === configId;

                        return (
                          <motion.div
                            key={configId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getProviderIcon(provider.id)}</span>
                                <div>
                                  <h4 className="font-semibold text-slate-900 dark:text-white">
                                    {provider.name}
                                  </h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {provider.models.find(m => m.id === config.modelId)?.name || 'Select model'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={config.isActive}
                                    onChange={(e) => handleConfigChange(index, 'isActive', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-slate-600 dark:text-slate-300">Active</span>
                                </label>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeConfig(index)}
                                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Model Selection */}
                              <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                  Model
                                </label>
                                <select
                                  value={config.modelId}
                                  onChange={(e) => handleConfigChange(index, 'modelId', e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Select a model</option>
                                  {provider.models.map((model) => (
                                    <option key={model.id} value={model.id}>
                                      {model.name} - {model.description}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* API Key */}
                              <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                  API Key
                                </label>
                                <div className="relative">
                                  <input
                                    type={showApiKeys[configId] ? 'text' : 'password'}
                                    value={config.apiKey}
                                    onChange={(e) => handleConfigChange(index, 'apiKey', e.target.value)}
                                    placeholder="Enter your API key"
                                    className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => toggleApiKeyVisibility(configId)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                  >
                                    {showApiKeys[configId] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>

                              {/* Max Tokens */}
                              <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                  Max Tokens
                                </label>
                                <input
                                  type="number"
                                  value={config.maxTokens}
                                  onChange={(e) => handleConfigChange(index, 'maxTokens', parseInt(e.target.value))}
                                  min="100"
                                  max="32000"
                                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              {/* Temperature */}
                              <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                  Temperature ({config.temperature})
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={config.temperature}
                                  onChange={(e) => handleConfigChange(index, 'temperature', parseFloat(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                            </div>

                            {/* Custom Endpoint for Custom Providers */}
                            {provider.isCustom && (
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                  Custom Endpoint (optional)
                                </label>
                                <input
                                  type="url"
                                  value={config.customEndpoint || ''}
                                  onChange={(e) => handleConfigChange(index, 'customEndpoint', e.target.value)}
                                  placeholder="https://your-custom-endpoint.com/v1/chat/completions"
                                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            )}

                            {/* Test Connection */}
                            <div className="mt-4 flex justify-end">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => testConnection(config, index)}
                                disabled={isTestingThis || !config.apiKey.trim()}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                              >
                                {isTestingThis ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <TestTube className="w-4 h-4" />
                                )}
                                <span>{isTestingThis ? 'Testing...' : 'Test Connection'}</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'custom' && (
                  <div className="space-y-6">
                    {/* Add Custom Provider */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Custom Providers
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addCustomProvider}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Custom Provider</span>
                      </motion.button>
                    </div>

                    {/* Custom Providers List */}
                    <div className="space-y-4">
                      {customProviders.map((provider, index) => (
                        <motion.div
                          key={provider.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              Custom Provider #{index + 1}
                            </h4>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeCustomProvider(index)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Provider Name
                              </label>
                              <input
                                type="text"
                                value={provider.name}
                                onChange={(e) => updateCustomProvider(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Base URL
                              </label>
                              <input
                                type="url"
                                value={provider.baseUrl}
                                onChange={(e) => updateCustomProvider(index, 'baseUrl', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Auth Type
                              </label>
                              <select
                                value={provider.authType}
                                onChange={(e) => updateCustomProvider(index, 'authType', e.target.value as any)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="bearer">Bearer Token</option>
                                <option value="api-key">API Key</option>
                                <option value="custom">Custom</option>
                              </select>
                            </div>

                            {provider.authType === 'api-key' && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                  Header Name
                                </label>
                                <input
                                  type="text"
                                  value={provider.headerName || ''}
                                  onChange={(e) => updateCustomProvider(index, 'headerName', e.target.value)}
                                  placeholder="X-API-Key"
                                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {customProviders.length === 0 && (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No custom providers configured yet.</p>
                        <p className="text-sm">Add a custom provider to get started.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'tools' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Tool Management
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6">
                        Export, import, and manage your OSINT tools
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsToolManagementOpen(true)}
                        className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-center"
                      >
                        <Download className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          Export Tools
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Download your tools in JSON or CSV format
                        </p>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsToolManagementOpen(true)}
                        className="p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-colors text-center"
                      >
                        <Upload className="w-8 h-8 text-green-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          Import Tools
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Upload tools from JSON or CSV files
                        </p>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsToolManagementOpen(true)}
                        className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors text-center"
                      >
                        <Plus className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          Custom Tools
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Add and manage your custom tools ({customTools.length})
                        </p>
                      </motion.button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        Tool Management Features:
                      </h4>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        <li>• Export all tools (built-in + custom) to JSON or CSV</li>
                        <li>• Import tools from external sources</li>
                        <li>• Add custom OSINT tools with full configuration</li>
                        <li>• Edit and delete custom tools</li>
                        <li>• Tools are stored locally in your browser</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {activeTab === 'providers' && `${configs.filter(c => c.isActive).length} active configuration(s)`}
                  {activeTab === 'custom' && `${customProviders.length} custom provider(s)`}
                  {activeTab === 'tools' && `${customTools.length} custom tool(s)`}
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                  {activeTab === 'providers' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Save Configuration
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool Management Modal */}
      <ToolManagementModal
        isOpen={isToolManagementOpen}
        onClose={() => setIsToolManagementOpen(false)}
        customTools={customTools}
        onCustomToolsChange={onCustomToolsChange}
      />
    </>
  );
};