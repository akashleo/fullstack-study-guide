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
    id: 'nodejs',
    title: 'Node.js & Express',
    filename: 'nodejs.md',
    icon: 'Server'
  },
  {
    id: 'database',
    title: 'Database Design',
    filename: 'database.md',
    icon: 'Database'
  },
  {
    id: 'api-development',
    title: 'API Development',
    filename: 'api-development.md',
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
