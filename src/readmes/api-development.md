# API Development Guide

## Overview
API development focuses on creating robust, scalable, and maintainable interfaces for applications to communicate with each other.

## RESTful API Design

### REST Principles
- **Stateless**: Each request contains all information needed
- **Resource-based**: URLs represent resources, not actions
- **HTTP Methods**: Use appropriate HTTP verbs
- **Status Codes**: Return meaningful HTTP status codes

### URL Design Patterns
```
GET    /api/users           # Get all users
GET    /api/users/123       # Get specific user
POST   /api/users           # Create new user
PUT    /api/users/123       # Update entire user
PATCH  /api/users/123       # Partial update
DELETE /api/users/123       # Delete user

# Nested resources
GET    /api/users/123/posts # Get user's posts
POST   /api/users/123/posts # Create post for user
```

### Response Format
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2023-01-01T12:00:00Z",
    "version": "1.0"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

## GraphQL

### Schema Definition
```graphql
type User {
  id: ID!
  email: String!
  name: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
  tags: [String!]!
  publishedAt: DateTime
}

type Query {
  user(id: ID!): User
  users(limit: Int, offset: Int): [User!]!
  post(id: ID!): Post
  posts(authorId: ID, tag: String): [Post!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
  
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
}

input CreateUserInput {
  email: String!
  name: String!
  password: String!
}

input UpdateUserInput {
  email: String
  name: String
}
```

### Resolvers
```javascript
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      return await context.dataSources.userAPI.getUserById(id);
    },
    users: async (parent, { limit = 10, offset = 0 }, context) => {
      return await context.dataSources.userAPI.getUsers(limit, offset);
    }
  },
  
  Mutation: {
    createUser: async (parent, { input }, context) => {
      const { email, name, password } = input;
      return await context.dataSources.userAPI.createUser({
        email,
        name,
        password
      });
    }
  },
  
  User: {
    posts: async (parent, args, context) => {
      return await context.dataSources.postAPI.getPostsByAuthor(parent.id);
    }
  }
};
```

## API Authentication

### JWT Implementation
```javascript
const jwt = require('jsonwebtoken');

// Generate token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'myapp',
    audience: 'myapp-users'
  });
};

// Verify token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};
```

### OAuth 2.0 Integration
```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken({ userId: req.user.id });
    res.redirect(`/dashboard?token=${token}`);
  }
);
```

## API Validation

### Input Validation with Joi
```javascript
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
  age: Joi.number().integer().min(18).max(120),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
});

const validateUser = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.validatedData = value;
  next();
};

app.post('/api/users', validateUser, createUser);
```

## API Testing

### Unit Testing with Jest
```javascript
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  let authToken;
  
  beforeAll(async () => {
    // Setup test database
    await setupTestDB();
    
    // Get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = response.body.token;
  });
  
  afterAll(async () => {
    await cleanupTestDB();
  });
  
  describe('GET /api/users', () => {
    it('should return users list', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
        
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    it('should return 401 without auth token', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });
  
  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
        
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.password).toBeUndefined();
    });
    
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'John' })
        .expect(400);
        
      expect(response.body.error).toBe('Validation failed');
    });
  });
});
```

### Integration Testing
```javascript
const { GraphQLClient } = require('graphql-request');

describe('GraphQL API', () => {
  let client;
  
  beforeAll(() => {
    client = new GraphQLClient('http://localhost:4000/graphql', {
      headers: {
        authorization: `Bearer ${authToken}`
      }
    });
  });
  
  it('should fetch user with posts', async () => {
    const query = `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
          posts {
            id
            title
            publishedAt
          }
        }
      }
    `;
    
    const variables = { id: '123' };
    const data = await client.request(query, variables);
    
    expect(data.user).toBeDefined();
    expect(data.user.posts).toBeInstanceOf(Array);
  });
});
```

## API Documentation

### OpenAPI/Swagger
```yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
  description: API for managing users and posts

paths:
  /api/users:
    get:
      summary: Get all users
      security:
        - bearerAuth: []
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Users retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
    
    post:
      summary: Create new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created successfully

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
        createdAt:
          type: string
          format: date-time
    
    CreateUserRequest:
      type: object
      required:
        - name
        - email
        - password
      properties:
        name:
          type: string
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 8

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## Performance Optimization

### Caching Strategies
```javascript
const Redis = require('redis');
const client = Redis.createClient();

// Cache middleware
const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Store original res.json
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the response
        client.setex(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

// Use caching
app.get('/api/users', cache(600), getUsers);
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);
```

## Best Practices

- **Versioning**: Use URL versioning (`/api/v1/users`)
- **Pagination**: Implement cursor-based pagination for large datasets
- **Error Handling**: Consistent error response format
- **Security**: Input validation, rate limiting, HTTPS
- **Documentation**: Keep API docs up to date
- **Monitoring**: Log requests and monitor performance
- **Testing**: Comprehensive test coverage
