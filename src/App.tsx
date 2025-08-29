import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Moon, Sun, FileText, Code, Database, Globe, Zap, Settings, ChevronDown, Server, Cloud } from 'lucide-react';
import { DocumentViewer } from './components/DocumentViewer';
import { TableOfContents } from './components/TableOfContents';
import { SearchPanel } from './components/SearchPanel';
import { NotesPanel } from './components/NotesPanel';
import { ProgressBar } from './components/ProgressBar';
import { loadMarkdownContent, contentItems, type Document } from './utils/documentLoader';

// Icon mapping for content items
const iconMap: Record<string, React.ComponentType<any>> = {
  BookOpen,
  Code,
  Server,
  Database,
  Globe,
  Zap,
  Cloud
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [currentContentId, setCurrentContentId] = useState('full-stack-guide');
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load initial document
  useEffect(() => {
    const loadInitialDocument = async () => {
      setLoading(true);
      try {
        const document = await loadMarkdownContent(currentContentId);
        setCurrentDocument(document);
      } catch (error) {
        console.error('Failed to load initial document:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialDocument();
  }, [currentContentId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContentDropdownOpen(false);
    };

    if (contentDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contentDropdownOpen]);

  const toggleBookmark = (sectionId: string) => {
    setBookmarks(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleContentChange = async (contentId: string) => {
    if (contentId === currentContentId) return;
    
    setLoading(true);
    setContentDropdownOpen(false);
    setActiveSection('');
    
    try {
      const document = await loadMarkdownContent(contentId);
      setCurrentDocument(document);
      setCurrentContentId(contentId);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Failed to load document:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentContentItem = contentItems.find(item => item.id === currentContentId);
  const IconComponent = currentContentItem ? iconMap[currentContentItem.icon] : BookOpen;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-theme-dark-bg text-theme-dark-text' : 'bg-theme-light-bg text-theme-light-text'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-theme-dark-bg border-gray-800' : 'bg-theme-light-bg border-gray-200'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold">Study Docs</h1>
              </div>
              
              {/* Content Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setContentDropdownOpen(!contentDropdownOpen);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {currentContentItem?.title || 'Select Content'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    contentDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {contentDropdownOpen && (
                  <div className={`absolute top-full left-0 mt-2 w-64 rounded-lg shadow-lg border z-50 ${
                    isDarkMode ? 'bg-theme-dark-bg border-gray-800' : 'bg-theme-light-bg border-gray-200'
                  }`}>
                    <div className="py-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded ${
                      isDarkMode ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800' : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
                    }">
                      {contentItems.map((item) => {
                        const ItemIcon = iconMap[item.icon];
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleContentChange(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-opacity-80 transition-colors ${
                              item.id === currentContentId
                                ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100')
                                : (isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50')
                            }`}
                          >
                            {ItemIcon && <ItemIcon className="w-4 h-4" />}
                            <span className="text-sm font-medium">{item.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setNotesOpen(!notesOpen)}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <ProgressBar progress={readingProgress} isDarkMode={isDarkMode} />
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 transform transition-transform duration-300 ease-in-out z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDarkMode ? 'bg-theme-dark-bg border-gray-800' : 'bg-theme-light-bg border-gray-200'} border-r overflow-y-auto`}>
          {currentDocument && (
            <TableOfContents
              sections={currentDocument.sections}
              activeSection={activeSection}
              bookmarks={bookmarks}
              onSectionClick={setActiveSection}
              onToggleBookmark={toggleBookmark}
              isDarkMode={isDarkMode}
            />
          )}
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-80' : 'ml-0'
        }`}>
          <div className="max-w-4xl mx-auto px-8 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                  isDarkMode ? 'border-theme-dark-text' : 'border-theme-light-text'
                }`}></div>
                <span className="ml-3 text-lg">Loading document...</span>
              </div>
            ) : currentDocument ? (
              <DocumentViewer
                documentData={currentDocument}
                activeSection={activeSection}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
                isDarkMode={isDarkMode}
              />
            ) : (
              <div className="text-center py-12">
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>No document loaded</p>
              </div>
            )}
          </div>
        </main>

        {/* Search Panel */}
        {searchOpen && currentDocument && (
          <SearchPanel
            documentData={currentDocument}
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Notes Panel */}
        {notesOpen && (
          <NotesPanel
            isOpen={notesOpen}
            onClose={() => setNotesOpen(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;