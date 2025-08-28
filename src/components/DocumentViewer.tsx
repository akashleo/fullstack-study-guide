import React, { useEffect } from 'react';
import { Bookmark, BookmarkCheck, Code, Database, Globe, Shield, Zap, TestTube, Server, Layout } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Document {
  title: string;
  content: string;
  sections: { id: string; title: string; level: number }[];
}

interface DocumentViewerProps {
  documentData: Document;
  activeSection: string;
  bookmarks: string[];
  onToggleBookmark: (sectionId: string) => void;
  isDarkMode: boolean;
}

const sectionIcons: { [key: string]: React.ComponentType<any> } = {
  frontend: Layout,
  backend: Server,
  database: Database,
  api: Code,
  devops: Globe,
  security: Shield,
  performance: Zap,
  testing: TestTube
};

export function DocumentViewer({ 
  documentData, 
  activeSection, 
  bookmarks, 
  onToggleBookmark, 
  isDarkMode 
}: DocumentViewerProps) {
  useEffect(() => {
    const handleScroll = () => {
      const sections = documentData.sections;
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            // setActiveSection(section.id); // This would need to be passed as a prop
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [documentData.sections]);

  return (
    <article className="prose prose-lg max-w-none">
      {/* Document Header */}
      <div className={`mb-8 p-6 rounded-xl border ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-sm`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-dark-text' : 'text-red-900'
            }`}>
              {documentData.title}
            </h1>
            <p className={`${
              isDarkMode ? 'text-dark-muted' : 'text-red-600'
            }`}>
              Comprehensive guide for modern full-stack development
            </p>
          </div>
          <div className="flex space-x-2">
            {documentData.sections.slice(0, 4).map((section) => {
              const Icon = sectionIcons[section.id] || Code;
              return (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className={`${
        isDarkMode ? 'prose-invert' : ''
      } prose-headings:scroll-mt-20`}>
        <MarkdownRenderer 
          content={documentData.content} 
          isDarkMode={isDarkMode}
          bookmarks={bookmarks}
          onToggleBookmark={onToggleBookmark}
        />
      </div>

      {/* Section Navigation */}
      <div className={`mt-12 p-6 rounded-xl border ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-dark-text' : 'text-gray-900'
        }`}>
          Quick Navigation
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {documentData.sections.map((section) => {
            const Icon = sectionIcons[section.id] || Code;
            const isBookmarked = bookmarks.includes(section.id);
            
            return (
              <button
                key={section.id}
                onClick={() => {
                  const element = document.getElementById(section.id);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${
                  activeSection === section.id
                    ? isDarkMode
                      ? 'bg-blue-900 border-blue-600 shadow-lg'
                      : 'bg-blue-50 border-blue-200 shadow-lg'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(section.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-gray-400 hover:text-amber-500" />
                  )}
                </button>
                <Icon className={`w-6 h-6 mb-2 ${
                  activeSection === section.id ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-dark-muted' : 'text-gray-700'
                }`}>
                  {section.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}