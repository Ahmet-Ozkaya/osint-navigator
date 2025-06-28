import React, { useState, useRef } from 'react';
import { X, Download, Upload, Plus, Settings, FileText, Database, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OSINTTool, ToolCategory } from '../../types';
import { osintCategories, getAllTools } from '../../data/osintTools';
import { AddToolModal } from './AddToolModal';
import toast from 'react-hot-toast';

interface ToolManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customTools: OSINTTool[];
  onCustomToolsChange: (tools: OSINTTool[]) => void;
}

export const ToolManagementModal: React.FC<ToolManagementModalProps> = ({
  isOpen,
  onClose,
  customTools,
  onCustomToolsChange
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'custom'>('export');
  const [isAddToolOpen, setIsAddToolOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<OSINTTool | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToJSON = () => {
    const allTools = [...getAllTools(), ...customTools];
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      tools: allTools,
      categories: osintCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        icon: cat.icon
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osint-tools-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Tools exported successfully!');
  };

  const exportToCSV = () => {
    const allTools = [...getAllTools(), ...customTools];
    const headers = ['ID', 'Name', 'URL', 'Description', 'Category', 'Tags', 'Is Standalone', 'Status'];
    const csvContent = [
      headers.join(','),
      ...allTools.map(tool => [
        tool.id,
        `"${tool.name}"`,
        `"${tool.url}"`,
        `"${tool.description.replace(/"/g, '""')}"`,
        tool.category,
        `"${tool.tags.join(';')}"`,
        tool.isStandalone || false,
        tool.status || 'unknown'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osint-tools-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Tools exported to CSV successfully!');
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          const importData = JSON.parse(content);
          
          if (importData.tools && Array.isArray(importData.tools)) {
            // Filter out tools that already exist and only import custom tools
            const existingToolIds = getAllTools().map(t => t.id);
            const newCustomTools = importData.tools.filter((tool: OSINTTool) => 
              !existingToolIds.includes(tool.id)
            );
            
            onCustomToolsChange([...customTools, ...newCustomTools]);
            toast.success(`Imported ${newCustomTools.length} new tools!`);
          } else {
            toast.error('Invalid JSON format. Expected tools array.');
          }
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          const tools: OSINTTool[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 8) {
              const tool: OSINTTool = {
                id: values[0],
                name: values[1].replace(/"/g, ''),
                url: values[2].replace(/"/g, ''),
                description: values[3].replace(/"/g, '').replace(/""/g, '"'),
                category: values[4],
                tags: values[5].replace(/"/g, '').split(';').filter(Boolean),
                isStandalone: values[6] === 'true',
                status: values[7] as any || 'unknown'
              };
              tools.push(tool);
            }
          }
          
          const existingToolIds = getAllTools().map(t => t.id);
          const newCustomTools = tools.filter(tool => !existingToolIds.includes(tool.id));
          
          onCustomToolsChange([...customTools, ...newCustomTools]);
          toast.success(`Imported ${newCustomTools.length} tools from CSV!`);
        }
      } catch (error) {
        toast.error('Failed to import file. Please check the format.');
        console.error('Import error:', error);
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleAddTool = (tool: OSINTTool) => {
    onCustomToolsChange([...customTools, tool]);
    toast.success('Custom tool added successfully!');
  };

  const handleEditTool = (tool: OSINTTool) => {
    const updatedTools = customTools.map(t => t.id === tool.id ? tool : t);
    onCustomToolsChange(updatedTools);
    setEditingTool(null);
    toast.success('Tool updated successfully!');
  };

  const handleDeleteTool = (toolId: string) => {
    const updatedTools = customTools.filter(t => t.id !== toolId);
    onCustomToolsChange(updatedTools);
    toast.success('Tool deleted successfully!');
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
                      Tool Management
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Export, import, and manage your OSINT tools
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
                  onClick={() => setActiveTab('export')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'export'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Export Tools
                </button>
                <button
                  onClick={() => setActiveTab('import')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'import'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Import Tools
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'custom'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Custom Tools ({customTools.length})
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {activeTab === 'export' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Export Your Tools
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6">
                        Download all tools including custom ones in your preferred format
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={exportToJSON}
                        className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <Database className="w-8 h-8 text-blue-600" />
                          <div className="text-left">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              Export as JSON
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Complete data with metadata
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-blue-600 dark:text-blue-400">
                          <span>Recommended format</span>
                          <Download className="w-4 h-4" />
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={exportToCSV}
                        className="p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-colors"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <FileText className="w-8 h-8 text-green-600" />
                          <div className="text-left">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              Export as CSV
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Spreadsheet compatible
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                          <span>Excel/Sheets ready</span>
                          <Download className="w-4 h-4" />
                        </div>
                      </motion.button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        Export includes:
                      </h4>
                      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        <li>• All {getAllTools().length} built-in tools</li>
                        <li>• {customTools.length} custom tools</li>
                        <li>• Tool categories and metadata</li>
                        <li>• Export timestamp and version info</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'import' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Import Tools
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6">
                        Upload JSON or CSV files to add new tools to your collection
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Drop files here or click to browse
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">
                        Supports JSON and CSV formats
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Choose File
                      </motion.button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,.csv"
                        onChange={handleFileImport}
                        className="hidden"
                      />
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
                      <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                        Import Notes:
                      </h4>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        <li>• Only new tools will be imported (duplicates skipped)</li>
                        <li>• Custom tools are stored locally in your browser</li>
                        <li>• JSON format preserves all metadata</li>
                        <li>• CSV format supports basic tool information</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'custom' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          Custom Tools
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                          Manage your custom OSINT tools
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAddToolOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Tool</span>
                      </motion.button>
                    </div>

                    {customTools.length === 0 ? (
                      <div className="text-center py-8">
                        <Plus className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          No Custom Tools Yet
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                          Add your own OSINT tools to extend the dashboard
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsAddToolOpen(true)}
                          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          Add Your First Tool
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {customTools.map((tool) => (
                          <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold text-slate-900 dark:text-white">
                                    {tool.name}
                                  </h4>
                                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">
                                    {tool.category}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                  {tool.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {tool.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded text-xs"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setEditingTool(tool)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                  title="Edit tool"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteTool(tool.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Delete tool"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Tool Modal */}
      <AddToolModal
        isOpen={isAddToolOpen || editingTool !== null}
        onClose={() => {
          setIsAddToolOpen(false);
          setEditingTool(null);
        }}
        onSave={editingTool ? handleEditTool : handleAddTool}
        editingTool={editingTool}
      />
    </>
  );
};