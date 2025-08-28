import React from 'react';
import { Bookmark, BookmarkCheck, Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isDarkMode: boolean;
  bookmarks: string[];
  onToggleBookmark: (sectionId: string) => void;
}

export function MarkdownRenderer({ 
  content, 
  isDarkMode, 
  bookmarks, 
  onToggleBookmark 
}: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Simple markdown parser for demonstration
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let currentCodeBlock = '';
    let inCodeBlock = false;
    let codeBlockLanguage = '';
    let codeBlockId = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          const blockId = `code-${codeBlockId++}`;
          elements.push(
            <div key={blockId} className="relative group">
              <button
                onClick={() => copyToClipboard(currentCodeBlock, blockId)}
                className={`absolute top-3 right-3 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {copiedCode === blockId ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <pre className={`rounded-lg p-4 overflow-x-auto ${
                isDarkMode ? 'bg-gray-800 text-dark-text' : 'bg-gray-100 text-gray-900'
              }`}>
                <code className={`language-${codeBlockLanguage}`}>
                  {currentCodeBlock}
                </code>
              </pre>
            </div>
          );
          currentCodeBlock = '';
          inCodeBlock = false;
          codeBlockLanguage = '';
        } else {
          // Start code block
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3);
        }
        continue;
      }

      if (inCodeBlock) {
        currentCodeBlock += line + '\n';
        continue;
      }

      if (line.startsWith('# ')) {
        const title = line.slice(2);
        elements.push(
          <h1 key={i} className={`text-4xl font-bold mt-8 mb-6 ${
            isDarkMode ? 'text-dark-text' : 'text-gray-900'
          }`}>
            {title}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        const match = line.match(/^## (.+?)(?:\s+\{#(.+?)\})?$/);
        const title = match?.[1] || line.slice(3);
        const id = match?.[2] || title.toLowerCase().replace(/\s+/g, '-');
        const isBookmarked = bookmarks.includes(id);

        elements.push(
          <div key={i} id={id} className="group relative">
            <h2 className={`text-2xl font-semibold mt-12 mb-4 scroll-mt-20 ${
              isDarkMode ? 'text-dark-text' : 'text-gray-900'
            }`}>
              {title}
              <button
                onClick={() => onToggleBookmark(id)}
                className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-amber-500 inline" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-400 hover:text-amber-500 inline" />
                )}
              </button>
            </h2>
          </div>
        );
      } else if (line.startsWith('### ')) {
        const title = line.slice(4);
        elements.push(
          <h3 key={i} className={`text-xl font-semibold mt-8 mb-3 ${
            isDarkMode ? 'text-dark-muted' : 'text-gray-800'
          }`}>
            {title}
          </h3>
        );
      } else if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.+?)\*\*:\s*(.+)$/);
        if (match) {
          const [, term, definition] = match;
          elements.push(
            <div key={i} className={`mb-3 p-4 rounded-lg border-l-4 border-blue-500 ${
              isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
            }`}>
              <div className="font-semibold text-blue-600 mb-1">{term}</div>
              <div className={isDarkMode ? 'text-dark-subtle' : 'text-gray-700'}>
                {definition}
              </div>
            </div>
          );
        }
      } else if (line.startsWith('- ')) {
        const text = line.slice(2);
        elements.push(
          <li key={i} className={`mb-2 ${
            isDarkMode ? 'text-dark-subtle' : 'text-gray-700'
          }`}>
            {text}
          </li>
        );
      } else if (line.trim() === '---') {
        elements.push(
          <hr key={i} className={`my-8 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-300'
          }`} />
        );
      } else if (line.startsWith('*') && line.endsWith('*')) {
        const text = line.slice(1, -1);
        elements.push(
          <p key={i} className={`text-center italic mt-8 ${
            isDarkMode ? 'text-dark-muted' : 'text-gray-600'
          }`}>
            {text}
          </p>
        );
      } else if (line.trim()) {
        elements.push(
          <p key={i} className={`mb-4 leading-relaxed ${
            isDarkMode ? 'text-dark-subtle' : 'text-gray-700'
          }`}>
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div className="space-y-4">
      {parseMarkdown(content)}
    </div>
  );
}