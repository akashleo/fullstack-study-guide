// Import markdown files as raw text using Vite's ?raw suffix
import apiDevelopmentContent from './api-development.md?raw';
import databaseContent from './database.md?raw';
import fastapiContent from './fastapi.md?raw';
import fullStackGuideContent from './full-stack-guide.md?raw';
import gcpContent from './gcp.md?raw';
import nodejsContent from './nodejs.md?raw';
import pythonContent from './python.md?raw';
import reactContent from './react.md?raw';

// Export all content as named exports
export {
  apiDevelopmentContent,
  databaseContent,
  fastapiContent,
  fullStackGuideContent,
  gcpContent,
  nodejsContent,
  pythonContent,
  reactContent
};

// Export content map for dynamic loading
export const contentMap = {
  'api-development': apiDevelopmentContent,
  'database': databaseContent,
  'fastapi': fastapiContent,
  'full-stack-guide': fullStackGuideContent,
  'gcp': gcpContent,
  'nodejs': nodejsContent,
  'python': pythonContent,
  'react': reactContent,
};
