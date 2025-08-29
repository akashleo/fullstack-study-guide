export interface DocumentSection {
  id: string;
  title: string;
  level: number;
}

export interface Document {
  title: string;
  content: string;
  sections: DocumentSection[];
}

export interface ContentItem {
  id: string;
  title: string;
  filename: string;
  icon: string;
}

// Available content items
export const contentItems: ContentItem[] = [
  {
    id: 'full-stack-guide',
    title: 'Full-Stack Development Guide',
    filename: 'full-stack-guide.md',
    icon: 'BookOpen'
  },
  {
    id: 'react',
    title: 'React Development',
    filename: 'react.md',
    icon: 'Code'
  },
  {
    id: 'react-500',
    title: 'React 500',
    filename: 'react-500.md',
    icon: 'Code'
  },
  {
    id: 'nodejs',
    title: 'Node.js & Express',
    filename: 'nodejs.md',
    icon: 'Server'
  },
  {
    id: 'nodejs-100',
    title: 'Node.js 100',
    filename: 'nodejs-100.md',
    icon: 'Server'
  },
  {
    id: 'express-100',
    title: 'Express 100',
    filename: 'express-100.md',
    icon: 'Server'
  },
  {
    id: 'database',
    title: 'Database Design',
    filename: 'database.md',
    icon: 'Database'
  },
  {
    id: 'sql-100',
    title: 'SQL 100',
    filename: 'sql-100.md',
    icon: 'Database'
  },
  {
    id: 'api-development',
    title: 'API Development',
    filename: 'api-development.md',
    icon: 'Globe'
  },
  {
    id: 'api-design-50',
    title: 'API Design 50',
    filename: 'api-design-50.md',
    icon: 'Globe'
  },
  {
    id: 'fastapi',
    title: 'FastAPI',
    filename: 'fastapi.md',
    icon: 'Zap'
  },
  {
    id: 'gcp',
    title: 'Google Cloud Platform',
    filename: 'gcp.md',
    icon: 'Cloud'
  },
  {
    id: 'python',
    title: 'Python',
    filename: 'python.md',
    icon: 'Code'
  },
  {
    id: 'python-100',
    title: 'Python 100',
    filename: 'python-100.md',
    icon: 'Code'
  },
  {
    id: 'python-basics',
    title: 'Python Basics',
    filename: 'python-basics.md',
    icon: 'Code'
  },
  {
    id: 'javascript-100',
    title: 'JavaScript 100',
    filename: 'javascript-100.md',
    icon: 'Code'
  },
  {
    id: 'typescript-100',
    title: 'TypeScript 100',
    filename: 'typescript-100.md',
    icon: 'Code'
  },
  {
    id: 'system-design',
    title: 'System Design',
    filename: 'system-design.md',
    icon: 'Network'
  },
  {
    id: 'bytebytego-system-design',
    title: 'ByteByteGo System Design',
    filename: 'bytebytego-system-design.md',
    icon: 'Network'
  },
  {
    id: 'grokking-system-design',
    title: 'Grokking System Design',
    filename: 'grokking-system-design.md',
    icon: 'Network'
  },
  {
    id: 'frontend-system-design',
    title: 'Frontend System Design',
    filename: 'frontend-system-design.md',
    icon: 'Layout'
  },
  {
    id: 'frontend-checklist',
    title: 'Frontend Checklist',
    filename: 'frontend-checklist.md',
    icon: 'CheckSquare'
  },
  {
    id: 'software-architechture',
    title: 'Software Architecture',
    filename: 'software-architechture.md',
    icon: 'Layers'
  },
  {
    id: 'reactive-systems-32',
    title: 'Reactive Systems 32',
    filename: 'reactive-systems-32.md',
    icon: 'Activity'
  },
  // DSA Content
  {
    id: 'dsa-basics',
    title: 'DSA Basics',
    filename: 'dsa-basics.md',
    icon: 'FileText'
  },
  {
    id: 'dsa-question-list',
    title: 'DSA Question List',
    filename: 'dsa-question-list.md',
    icon: 'List'
  },
  {
    id: 'dsa-coding-interview-uni',
    title: 'DSA Coding Interview University',
    filename: 'dsa-coding-interview-uni.md',
    icon: 'BookOpen'
  },
  {
    id: 'grokking-dsa-shortcut',
    title: 'Grokking DSA Shortcut',
    filename: 'grokking-dsa-shortcut.md',
    icon: 'FastForward'
  },
  {
    id: 'array-dsa',
    title: 'Arrays DSA',
    filename: 'array-dsa.md',
    icon: 'Grid'
  },
  {
    id: 'string-dsa',
    title: 'String DSA',
    filename: 'string-dsa.md',
    icon: 'Type'
  },
  {
    id: 'linked-list-dsa',
    title: 'Linked List DSA',
    filename: 'linked-list-dsa.md',
    icon: 'Link'
  },
  {
    id: 'stack-dsa',
    title: 'Stack DSA',
    filename: 'stack-dsa.md',
    icon: 'Layers'
  },
  {
    id: 'queue-dsa',
    title: 'Queue DSA',
    filename: 'queue-dsa.md',
    icon: 'AlignLeft'
  },
  {
    id: 'binary-tree-dsa',
    title: 'Binary Tree DSA',
    filename: 'binary-tree-dsa.md',
    icon: 'GitBranch'
  },
  {
    id: 'heap-dsa',
    title: 'Heap DSA',
    filename: 'heap-dsa.md',
    icon: 'Triangle'
  },
  {
    id: 'hashtable-dsa',
    title: 'Hash Table DSA',
    filename: 'hashtable-dsa.md',
    icon: 'Hash'
  },
  {
    id: 'sorting-dsa',
    title: 'Sorting Algorithms',
    filename: 'sorting-dsa.md',
    icon: 'BarChart2'
  },
  {
    id: 'searchin-dsa',
    title: 'Searching Algorithms',
    filename: 'searchin-dsa.md',
    icon: 'Search'
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    filename: 'dynamic-programming.md',
    icon: 'Sliders'
  },
  {
    id: 'greedy-dsa',
    title: 'Greedy Algorithms',
    filename: 'greedy-dsa.md',
    icon: 'TrendingUp'
  },
  {
    id: 'backtracking-dsa',
    title: 'Backtracking',
    filename: 'backtracking-dsa.md',
    icon: 'CornerUpLeft'
  },
  {
    id: 'divide-n-conquer-dsa',
    title: 'Divide & Conquer',
    filename: 'divide-n-conquer-dsa.md',
    icon: 'Scissors'
  },
  {
    id: 'recursion-dsa',
    title: 'Recursion',
    filename: 'recursion-dsa.md',
    icon: 'Repeat'
  },
  {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    filename: 'bit-manipulation.md',
    icon: 'Terminal'
  },
  {
    id: 'blockchain-dsa',
    title: 'Blockchain DSA',
    filename: 'blockchain-dsa.md',
    icon: 'Link2'
  }
];

// Parse markdown content to extract sections
export const parseMarkdownSections = (content: string): DocumentSection[] => {
  const sections: DocumentSection[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('#')) {
      const level = trimmedLine.match(/^#+/)?.[0].length || 1;
      const title = trimmedLine.replace(/^#+\s*/, '').replace(/\s*\{#.*\}$/, '');
      
      // Extract ID from {#id} syntax or generate from title
      const idMatch = trimmedLine.match(/\{#([^}]+)\}/);
      const id = idMatch ? idMatch[1] : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      sections.push({
        id,
        title,
        level
      });
    }
  }
  
  return sections;
};

// Load markdown content dynamically
export const loadMarkdownContent = async (contentId: string): Promise<Document> => {
  try {
    // Import the content map
    const { contentMap } = await import('../readmes/index.ts');
    const content = contentMap[contentId as keyof typeof contentMap];
    
    if (!content) {
      throw new Error(`Content not found for ID: ${contentId}`);
    }
    
    // Extract title from first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'Untitled Document';
    
    const sections = parseMarkdownSections(content);
    
    return {
      title,
      content,
      sections
    };
  } catch (error) {
    console.error(`Failed to load content for ${contentId}:`, error);
    
    // Return fallback content
    return {
      title: 'Document Not Found',
      content: `# Document Not Found\n\nThe requested document "${contentId}" could not be loaded.`,
      sections: []
    };
  }
};

// Get content item by ID
export const getContentItemById = (id: string): ContentItem | undefined => {
  return contentItems.find(item => item.id === id);
};
