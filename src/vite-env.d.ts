/// <reference types="vite/client" />

// Markdown file declarations
declare module '*.md?raw' {
  const content: string;
  export default content;
}
