# Database Design Guide

## Overview
Database design is crucial for building scalable, efficient applications. This guide covers both relational (SQL) and non-relational (NoSQL) database concepts.

## Relational Databases

### Database Schema Design
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table with foreign key relationship
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table (many-to-many relationship)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for posts and tags
CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

### Indexes for Performance
```sql
-- Single column indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);

-- Composite indexes
CREATE INDEX idx_posts_user_status ON posts(user_id, status);
CREATE INDEX idx_posts_published ON posts(published_at, status);

-- Partial indexes
CREATE INDEX idx_posts_published_only ON posts(published_at) 
WHERE status = 'published';
```

### Complex Queries
```sql
-- Join queries with aggregation
SELECT 
  u.first_name,
  u.last_name,
  COUNT(p.id) as post_count,
  MAX(p.published_at) as latest_post
FROM users u
LEFT JOIN posts p ON u.id = p.user_id AND p.status = 'published'
GROUP BY u.id, u.first_name, u.last_name
HAVING COUNT(p.id) > 0
ORDER BY post_count DESC;

-- Subqueries
SELECT * FROM posts 
WHERE user_id IN (
  SELECT id FROM users 
  WHERE created_at > NOW() - INTERVAL '30 days'
);

-- Window functions
SELECT 
  title,
  user_id,
  published_at,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY published_at DESC) as post_rank
FROM posts 
WHERE status = 'published';
```

## NoSQL Databases

### MongoDB Document Design
```javascript
// User document
{
  _id: ObjectId("..."),
  email: "user@example.com",
  profile: {
    firstName: "John",
    lastName: "Doe",
    avatar: "https://example.com/avatar.jpg"
  },
  preferences: {
    theme: "dark",
    notifications: {
      email: true,
      push: false
    }
  },
  createdAt: ISODate("2023-01-01T00:00:00Z"),
  updatedAt: ISODate("2023-01-01T00:00:00Z")
}

// Post document with embedded comments
{
  _id: ObjectId("..."),
  title: "My Blog Post",
  content: "Post content here...",
  author: {
    id: ObjectId("..."),
    name: "John Doe",
    email: "john@example.com"
  },
  tags: ["javascript", "mongodb", "nodejs"],
  comments: [
    {
      id: ObjectId("..."),
      author: "Jane Smith",
      content: "Great post!",
      createdAt: ISODate("2023-01-02T10:00:00Z")
    }
  ],
  metadata: {
    views: 150,
    likes: 25,
    shares: 5
  },
  status: "published",
  publishedAt: ISODate("2023-01-01T12:00:00Z"),
  createdAt: ISODate("2023-01-01T10:00:00Z")
}
```

### MongoDB Queries
```javascript
// Find with complex conditions
db.posts.find({
  status: "published",
  publishedAt: { $gte: new Date("2023-01-01") },
  "metadata.views": { $gt: 100 },
  tags: { $in: ["javascript", "nodejs"] }
});

// Aggregation pipeline
db.posts.aggregate([
  { $match: { status: "published" } },
  { $unwind: "$tags" },
  { $group: {
    _id: "$tags",
    count: { $sum: 1 },
    avgViews: { $avg: "$metadata.views" }
  }},
  { $sort: { count: -1 } },
  { $limit: 10 }
]);

// Text search
db.posts.createIndex({ title: "text", content: "text" });
db.posts.find({ $text: { $search: "javascript mongodb" } });
```

## Database Optimization

### Query Optimization
```sql
-- Use EXPLAIN to analyze query performance
EXPLAIN ANALYZE 
SELECT * FROM posts 
WHERE user_id = 123 AND status = 'published'
ORDER BY published_at DESC;

-- Optimize with proper indexing
CREATE INDEX idx_posts_user_published ON posts(user_id, status, published_at);
```

### Connection Pooling
```javascript
// PostgreSQL with pg-pool
const { Pool } = require('pg');

const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
  max: 20, // maximum number of clients
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use pool for queries
const getUser = async (id) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } finally {
    client.release();
  }
};
```

### Caching Strategies
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

const getCachedUser = async (userId) => {
  const cacheKey = `user:${userId}`;
  
  // Try cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const user = await getUserFromDB(userId);
  
  // Cache for 1 hour
  await client.setex(cacheKey, 3600, JSON.stringify(user));
  
  return user;
};
```

## Database Migrations

### SQL Migrations
```sql
-- Migration: Add email verification
-- Up migration
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
CREATE INDEX idx_users_verification_token ON users(verification_token);

-- Down migration
DROP INDEX idx_users_verification_token;
ALTER TABLE users DROP COLUMN verification_token;
ALTER TABLE users DROP COLUMN email_verified;
```

### MongoDB Migrations
```javascript
// Migration script
const migrateUsers = async () => {
  const users = db.users.find({ profile: { $exists: false } });
  
  users.forEach(user => {
    db.users.updateOne(
      { _id: user._id },
      {
        $set: {
          profile: {
            firstName: user.first_name || "",
            lastName: user.last_name || ""
          }
        },
        $unset: {
          first_name: "",
          last_name: ""
        }
      }
    );
  });
};
```

## Data Modeling Best Practices

### Normalization vs Denormalization
```sql
-- Normalized approach (3NF)
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id INTEGER REFERENCES authors(id),
  isbn VARCHAR(13) UNIQUE
);

-- Denormalized for read performance
CREATE TABLE book_details (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  isbn VARCHAR(13) UNIQUE,
  -- Duplicate author data for faster reads
);
```

### Document vs Relational Trade-offs

**Use SQL when:**
- ACID compliance is critical
- Complex relationships and joins
- Strong consistency requirements
- Well-defined schema

**Use NoSQL when:**
- Flexible schema requirements
- Horizontal scaling needs
- Rapid development cycles
- Document-oriented data

## Backup and Recovery

### Automated Backups
```bash
#!/bin/bash
# PostgreSQL backup script
DB_NAME="myapp"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

### Point-in-Time Recovery
```sql
-- Enable WAL archiving in postgresql.conf
archive_mode = on
archive_command = 'cp %p /archive/%f'

-- Restore to specific point in time
pg_basebackup -D /restore -Ft -z -P
# Then use pg_wal files to recover to specific timestamp
```
