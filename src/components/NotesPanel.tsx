import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Calendar, Tag } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  section: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export function NotesPanel({ isOpen, onClose, isDarkMode }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'React Hooks Best Practices',
      content: 'Remember to use useCallback for expensive computations and useMemo for derived state.',
      section: 'Frontend Technologies',
      tags: ['react', 'hooks', 'performance'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Database Indexing Strategy',
      content: 'Create composite indexes for queries that filter on multiple columns. Monitor query performance regularly.',
      section: 'Database Design',
      tags: ['database', 'performance', 'sql'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', section: '', tags: '' });
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);

  const addNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        section: newNote.section || 'General',
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', section: '', tags: '' });
      setShowNewNoteForm(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative ml-auto w-96 h-full shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-emerald-600" />
            <h2 className={`font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Study Notes
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNewNoteForm(!showNewNoteForm)}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Note Form */}
        {showNewNoteForm && (
          <div className={`p-4 border-b ${
            isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
          }`}>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Note title..."
              className={`w-full p-2 mb-2 border rounded-md text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Write your note..."
              rows={3}
              className={`w-full p-2 mb-2 border rounded-md text-sm resize-none ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <input
              type="text"
              value={newNote.tags}
              onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              placeholder="Tags (comma-separated)..."
              className={`w-full p-2 mb-3 border rounded-md text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewNoteForm(false)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className={`p-4 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-medium text-sm ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {note.title}
                  </h3>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className={`p-1 rounded hover:bg-opacity-80 transition-colors ${
                      isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                
                <p className={`text-sm mb-3 leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {note.content}
                </p>
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 text-xs rounded-full ${
                          isDarkMode 
                            ? 'bg-gray-600 text-gray-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className={`flex items-center justify-between text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <span className="flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>{note.section}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(note.updatedAt)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {notes.length === 0 && (
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Edit3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notes yet</p>
              <p className="text-sm mt-1">Start taking notes to track your learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}