# React Development Guide

## Overview
React is a powerful JavaScript library for building user interfaces, developed by Facebook. It uses a component-based architecture and virtual DOM for efficient rendering.

## Core Concepts

### Components
Reusable UI elements that encapsulate logic and presentation:

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Class component
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### State Management
Managing component state with hooks:

```jsx
import { useState, useReducer } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Effects and Side Effects
Managing side effects with useEffect:

```jsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

### Context API
Global state management for avoiding prop drilling:

```jsx
const ThemeContext = React.createContext();

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <Main />
    </ThemeContext.Provider>
  );
}
```

## Advanced Patterns

### Custom Hooks
Reusable stateful logic:

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });
  
  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, newValue);
  };
  
  return [value, setStoredValue];
}
```

### Error Boundaries
Catching JavaScript errors in component trees:

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}
```

## Performance Optimization

### React.memo
Preventing unnecessary re-renders:

```jsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});
```

### useMemo and useCallback
Memoizing expensive calculations and functions:

```jsx
function ExpensiveList({ items, filter }) {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.includes(filter));
  }, [items, filter]);
  
  const handleClick = useCallback((id) => {
    // handle click
  }, []);
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item} onClick={() => handleClick(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
}
```

## Best Practices

- Keep components small and focused
- Use functional components with hooks
- Implement proper error handling
- Optimize performance with memoization
- Follow consistent naming conventions
- Use TypeScript for better type safety
