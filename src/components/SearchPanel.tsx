import { useState, useMemo } from 'react';
import { Search, X, FileText } from 'lucide-react';

interface Document {
  title: string;
  content: string;
  sections: { id: string; title: string; level: number }[];
}

interface SearchPanelProps {
  documentData: Document;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  snippet: string;
  line: number;
}

export function SearchPanel({ documentData, isOpen, onClose, isDarkMode }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const results: SearchResult[] = [];
    const lines = documentData.content.split('\n');
    let currentSection = { id: 'intro', title: 'Introduction' };

    lines.forEach((line, index) => {
      // Update current section when we hit a header
      const headerMatch = line.match(/^## (.+?)(?:\s+\{#(.+?)\})?$/);
      if (headerMatch) {
        currentSection = {
          title: headerMatch[1],
          id: headerMatch[2] || headerMatch[1].toLowerCase().replace(/\s+/g, '-')
        };
        return;
      }

      // Search for query in line
      if (line.toLowerCase().includes(searchQuery.toLowerCase())) {
        const queryIndex = line.toLowerCase().indexOf(searchQuery.toLowerCase());
        const start = Math.max(0, queryIndex - 30);
        const end = Math.min(line.length, queryIndex + searchQuery.length + 30);
        let snippet = line.slice(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < line.length) snippet = snippet + '...';

        // Highlight the search term
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        snippet = snippet.replace(regex, '<mark>$1</mark>');

        results.push({
          sectionId: currentSection.id,
          sectionTitle: currentSection.title,
          snippet,
          line: index + 1
        });
      }
    });

    return results.slice(0, 20); // Limit results
  }, [searchQuery, documentData.content]);

  const scrollToResult = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
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
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className={`font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Search Document
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for concepts, code, or topics..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {searchQuery.trim() && (
            <div className={`mb-4 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </div>
          )}

          <div className="space-y-2">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => scrollToResult(result.sectionId)}
                className={`w-full p-3 rounded-lg border text-left transition-colors hover:shadow-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {result.sectionTitle}
                  </span>
                </div>
                <div 
                  className={`text-xs leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                  dangerouslySetInnerHTML={{ __html: result.snippet.replace('<mark>', '<mark class="bg-yellow-200 text-gray-900 px-1 rounded">').replace('</mark>', '</mark>') }}
                />
                <div className={`text-xs mt-1 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Line {result.line}
                </div>
              </button>
            ))}
          </div>

          {searchQuery.trim() && searchResults.length === 0 && (
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{searchQuery}"</p>
              <p className="text-sm mt-1">Try different keywords or check spelling</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}