import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Calendar, Tag, FileText, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolNote } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

interface ToolNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  notes: ToolNote[];
  onNotesUpdate: (notes: ToolNote[]) => void;
}

export const ToolNotesModal: React.FC<ToolNotesModalProps> = ({
  isOpen,
  onClose,
  toolName,
  notes,
  onNotesUpdate
}) => {
  const [newNote, setNewNote] = useState({
    content: '',
    purpose: '',
    tags: ''
  });
  const [editingNote, setEditingNote] = useState<ToolNote | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddNote = () => {
    if (!newNote.content.trim()) {
      toast.error('Please enter note content');
      return;
    }

    const note: ToolNote = {
      id: Date.now().toString(),
      content: newNote.content.trim(),
      purpose: newNote.purpose.trim(),
      timestamp: new Date(),
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    onNotesUpdate([note, ...notes]);
    setNewNote({ content: '', purpose: '', tags: '' });
    toast.success('Note added successfully!');
  };

  const handleEditNote = (note: ToolNote) => {
    setEditingNote(note);
    setNewNote({
      content: note.content,
      purpose: note.purpose,
      tags: note.tags.join(', ')
    });
  };

  const handleUpdateNote = () => {
    if (!editingNote || !newNote.content.trim()) return;

    const updatedNote: ToolNote = {
      ...editingNote,
      content: newNote.content.trim(),
      purpose: newNote.purpose.trim(),
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    const updatedNotes = notes.map(note => 
      note.id === editingNote.id ? updatedNote : note
    );

    onNotesUpdate(updatedNotes);
    setEditingNote(null);
    setNewNote({ content: '', purpose: '', tags: '' });
    toast.success('Note updated successfully!');
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    onNotesUpdate(updatedNotes);
    toast.success('Note deleted successfully!');
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setNewNote({ content: '', purpose: '', tags: '' });
  };

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
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Notes for {toolName}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {notes.length} note(s) • Track usage and findings
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
            <div className="flex flex-col h-[70vh]">
              {/* Add/Edit Note Form */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  {editingNote ? 'Edit Note' : 'Add New Note'}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Purpose/Context
                      </label>
                      <input
                        type="text"
                        value={newNote.purpose}
                        onChange={(e) => setNewNote(prev => ({ ...prev, purpose: e.target.value }))}
                        placeholder="e.g., Threat hunting, IP investigation..."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={newNote.tags}
                        onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="malware, investigation, findings (comma separated)"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Note Content *
                    </label>
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Describe your findings, observations, or any relevant information about using this tool..."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={editingNote ? handleUpdateNote : handleAddNote}
                      disabled={!newNote.content.trim()}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingNote ? 'Update Note' : 'Add Note'}</span>
                    </motion.button>
                    {editingNote && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={cancelEdit}
                        className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Search */}
              {notes.length > 0 && (
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search notes..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto p-4">
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">
                      {notes.length === 0 ? 'No notes yet' : 'No matching notes'}
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                      {notes.length === 0 ? 'Add your first note above' : 'Try a different search term'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotes.map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {note.purpose && (
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                                  {note.purpose}
                                </span>
                              )}
                              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(note.timestamp)}
                              </span>
                            </div>
                            <p className="text-slate-900 dark:text-white text-sm leading-relaxed mb-2">
                              {note.content}
                            </p>
                            {note.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {note.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded text-xs"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 ml-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditNote(note)}
                              className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                              title="Edit note"
                            >
                              <Edit3 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Delete note"
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};