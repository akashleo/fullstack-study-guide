import React from 'react';
import { ChevronRight, ChevronDown, Bookmark, BookmarkCheck } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  bookmarks: string[];
  onSectionClick: (sectionId: string) => void;
  onToggleBookmark: (sectionId: string) => void;
  isDarkMode: boolean;
}

export function TableOfContents({
  sections,
  activeSection,
  bookmarks,
  onSectionClick,
  onToggleBookmark,
  isDarkMode
}: TableOfContentsProps) {
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['main']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onSectionClick(sectionId);
    }
  };

  return (
    <nav className="p-6">
      <h2 className={`text-lg font-semibold mb-4 ${
        isDarkMode ? 'text-theme-dark-text' : 'text-theme-light-text'
      }`}>
        Table of Contents
      </h2>
      
      {/* Bookmarks Section */}
      {bookmarks.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('bookmarks')}
            className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BookmarkCheck className="w-4 h-4 text-amber-500" />
              <span className={`font-medium ${
                isDarkMode ? 'text-theme-dark-text' : 'text-theme-light-text'
              }`}>
                Bookmarks ({bookmarks.length})
              </span>
            </div>
            {expandedSections.includes('bookmarks') ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {expandedSections.includes('bookmarks') && (
            <ul className="ml-4 mt-2 space-y-1">
              {bookmarks.map((bookmarkId) => {
                const section = sections.find(s => s.id === bookmarkId);
                if (!section) return null;
                
                return (
                  <li key={bookmarkId}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center justify-between w-full p-2 rounded-md text-left transition-colors ${
                        activeSection === section.id
                          ? isDarkMode
                            ? 'bg-blue-900 text-blue-200'
                            : 'bg-blue-100 text-blue-800'
                          : isDarkMode
                            ? 'text-theme-dark-text hover:bg-gray-800'
                            : 'text-theme-light-text hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-sm">{section.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Main Sections */}
      <div className="space-y-1">
        <button
          onClick={() => toggleSection('main')}
          className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          <span className={`font-medium ${
            isDarkMode ? 'text-theme-dark-text' : 'text-theme-light-text'
          }`}>
            Study Guide
          </span>
          {expandedSections.includes('main') ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.includes('main') && (
          <ul className="ml-4 space-y-1">
            {sections.map((section) => {
              const isBookmarked = bookmarks.includes(section.id);
              
              return (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center justify-between w-full p-2 rounded-md text-left transition-colors group ${
                      activeSection === section.id
                        ? isDarkMode
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-blue-100 text-blue-800'
                        : isDarkMode
                          ? 'text-theme-dark-text hover:bg-gray-800'
                          : 'text-theme-light-text hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm">{section.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(section.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-gray-400 hover:text-amber-500" />
                      )}
                    </button>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}