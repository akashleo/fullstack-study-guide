# System Design Guide

## Overview
System design is the process of defining architecture, components, modules, interfaces, and data for a system to satisfy specified requirements. This guide covers fundamental concepts and approaches to design scalable, reliable, and efficient distributed systems.

## Key System Design Concepts

### Performance vs Scalability
- **Performance**: How fast a system performs for a single user or operation
  - If you have a performance problem, your system is slow for a single user
- **Scalability**: How performance changes as load or data volume increases
  - If you have a scalability problem, your system is fast for a single user but slow under heavy load
  - A scalable system maintains performance proportional to resources added

### Latency vs Throughput
- **Latency**: Time required to perform an action (e.g., response time)
- **Throughput**: Number of actions per unit time (e.g., requests/second)

Optimize for both depending on your requirements:
- For video chat: Minimize latency for real-time communication
- For data processing: Maximize throughput for overall efficiency

### Availability vs Consistency

#### CAP Theorem
In a distributed system, you can only guarantee two of three properties:
- **Consistency**: Every read receives the most recent write or an error
- **Availability**: Every request receives a response, without guarantee of most recent data
- **Partition Tolerance**: System continues to operate despite network failures

Two common approaches:
- **CP (Consistency + Partition Tolerance)**: May sacrifice availability for data consistency
  - Good for systems requiring atomic reads/writes (e.g., banking)
- **AP (Availability + Partition Tolerance)**: May sacrifice consistency for availability
  - Good for systems that can tolerate eventual consistency (e.g., social media)

```
Examples:
- CP Systems: Google Spanner, HBase
- AP Systems: Cassandra, Amazon Dynamo
```

## Consistency Patterns

### Weak Consistency
- After a write, reads may or may not see it
- Works well in real-time systems (e.g., VoIP, video chat)

### Eventual Consistency
- After a write, reads will eventually see it (typically within milliseconds)
- Used in distributed systems with high availability requirements
- Examples: DNS, email systems

### Strong Consistency
- After a write, all reads will see it
- Achieved through techniques like synchronous replication
- Examples: File systems, RDBMS

## Availability Patterns

### Fail-over

#### Active-Passive
- Active server sends heartbeats to passive server
- If heartbeat is interrupted, passive server takes over
- Downtime depends on detection and failover time

#### Active-Active
- Both servers are active and load-balanced
- If one fails, the other can handle all traffic
- More resource-efficient but complex to implement

### Replication

```
Types of Replication:
1. Master-Slave: Write to master, read from slaves
2. Master-Master: Write to any node, replicate to others
3. Peer-to-Peer: Equal status for all nodes
```

## System Components

### Load Balancer
Distributes incoming traffic across multiple servers to:
- Prevent overload on any single server
- Improve responsiveness and availability

#### Layer 4 Load Balancing
- Transport layer (TCP/UDP)
- Fast but limited decision-making based on IP and port

#### Layer 7 Load Balancing
- Application layer (HTTP/HTTPS)
- More intelligent routing based on content type, headers, etc.
- Can handle SSL termination, caching

```javascript
// Example Nginx load balancer configuration
http {
  upstream backend_servers {
    server 10.0.0.1;
    server 10.0.0.2;
    server 10.0.0.3;
  }

  server {
    listen 80;
    location / {
      proxy_pass http://backend_servers;
    }
  }
}
```

### Caching
Storing copies of data for faster access, reducing load on backend systems.

#### Caching Strategies

##### Cache-Aside (Lazy Loading)
```javascript
function getData(key) {
  // Try to get data from cache
  let data = cache.get(key);
  if (data === null) {
    // Cache miss, get from database
    data = database.get(key);
    // Store in cache for future requests
    cache.set(key, data, EXPIRY_TIME);
  }
  return data;
}
```

##### Write-Through
```javascript
function saveData(key, value) {
  // Write to database
  database.set(key, value);
  // Update cache
  cache.set(key, value, EXPIRY_TIME);
  return success;
}
```

##### Write-Behind (Write-Back)
```javascript
function saveData(key, value) {
  // Update cache immediately
  cache.set(key, value, EXPIRY_TIME);
  // Queue write to database
  writeQueue.push({ key, value });
  return success;
}

// Background process to flush queue
function flushWriteQueue() {
  while (writeQueue.length > 0) {
    const { key, value } = writeQueue.shift();
    database.set(key, value);
  }
}
```

### Content Delivery Network (CDN)
Globally distributed servers to deliver content closer to users.

#### Push CDN
- You upload content directly to the CDN
- Good for static content that doesn't change frequently

#### Pull CDN
- Content is pulled from your servers when first requested
- Good for dynamic content or frequently changing assets

## Database Systems

### Relational Database Management System (RDBMS)

#### When to Use
- Structured data with well-defined schema
- Complex queries and transactions
- ACID compliance required

#### Scaling Approaches

##### Master-Slave Replication
- Write operations go to master
- Read operations distributed across slaves
- Provides read scalability

##### Sharding
```
Splitting data across multiple databases:

User_ID % 4 = 0 → Shard 0
User_ID % 4 = 1 → Shard 1
User_ID % 4 = 2 → Shard 2
User_ID % 4 = 3 → Shard 3
```

### NoSQL Databases

#### Types

##### Key-Value Stores
- Simple key-value lookup
- Highly scalable and performant
- Examples: Redis, DynamoDB

```javascript
// Redis example
SET user:1000 "{name: 'John', email: 'john@example.com'}"
GET user:1000
```

##### Document Stores
- Store semi-structured documents (JSON, BSON)
- Schema flexibility
- Examples: MongoDB, CouchDB

```javascript
// MongoDB example
db.users.insertOne({
  name: "Sarah",
  email: "sarah@example.com",
  preferences: {
    theme: "dark",
    notifications: true
  }
})
```

##### Wide-Column Stores
- Two-dimensional key-value store
- High availability and scalability
- Examples: Cassandra, HBase

##### Graph Databases
- Optimized for interconnected data
- Good for social networks, recommendations
- Examples: Neo4j, Amazon Neptune

#### SQL vs NoSQL Decision Factors
- **Choose SQL when**:
  - Complex queries, transactions
  - Data integrity is crucial
  - Schema is relatively stable

- **Choose NoSQL when**:
  - Need horizontal scalability
  - Handling large volumes of unstructured data
  - Rapid development with changing schema

## Communication Protocols

### REST (Representational State Transfer)
```
GET /api/users/123          # Get user
POST /api/users             # Create user
PUT /api/users/123          # Update user
DELETE /api/users/123       # Delete user
```

### gRPC
```proto
// Proto definition
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc CreateUser(CreateUserRequest) returns (User);
}
```

### GraphQL
```graphql
query {
  user(id: "123") {
    name
    email
    posts {
      title
      comments {
        text
      }
    }
  }
}
```

## Asynchronous Processing

### Message Queues
- Decouple producers from consumers
- Buffer requests during traffic spikes
- Examples: RabbitMQ, Kafka

```javascript
// Producer code (NodeJS with RabbitMQ)
const queue = 'tasks';
channel.assertQueue(queue, { durable: true });
channel.sendToQueue(queue, Buffer.from(JSON.stringify({ task: 'process_image', file: 'img.jpg' })));

// Consumer code
channel.consume(queue, function(msg) {
  const data = JSON.parse(msg.content.toString());
  processTask(data);
  channel.ack(msg);
});
```

### Task Queues
- For time-consuming background operations
- Examples: Celery (Python), Bull (Node.js)

## System Design Approach

### Step 1: Requirements Clarification
- Functional requirements
- Non-functional requirements
  - Availability
  - Latency
  - Scalability
  - Durability
  - Security

### Step 2: System Interface Definition
```
createUser(name, email) → user_id
getUser(user_id) → user_object
```

### Step 3: Estimations
- Traffic estimates
- Storage estimates
- Bandwidth estimates
- Memory estimates

Example calculation:
```
Daily active users: 1 million
Average requests per user: 20 per day
Total daily requests: 20 million
Requests per second: 20M / 86400 ≈ 230 RPS
```

### Step 4: Data Model Design
- Entities and relationships
- Database schema
- Storage system selection

### Step 5: High-level Design
- Core components
- Basic interactions
- Technology choices

### Step 6: Detailed Design
- Component-level decisions
- Trade-offs discussion
- System optimizations

### Step 7: Bottlenecks and Mitigations
- Single points of failure
- Consistency issues
- Resource contentions

## Common System Design Examples

### URL Shortener (Like Bit.ly)
- Hash generation for short URLs
- Database storage and retrieval
- Caching for popular URLs

### Social Media Feed
- Data storage for posts
- Feed generation
- Push vs pull models

### Video Streaming Service
- Video encoding
- Content delivery
- Adaptive bitrate streaming

## Performance Metrics and Tools

### Key Metrics
- Latency (response time)
- Throughput (requests per second)
- Error rate
- Resource utilization

### Performance Testing Tools
- Load testing: JMeter, Locust
- Profiling: New Relic, Datadog
- Monitoring: Prometheus, Grafana

## System Design Best Practices

### Design for Failure
- Assume every component can fail
- Design with redundancy
- Implement graceful degradation

### Keep It Simple
- Start with the simplest solution
- Add complexity only when needed
- Avoid premature optimization

### Design for Scale
- Horizontal over vertical scaling
- Stateless over stateful services
- Asynchronous over synchronous processing

### Continuous Monitoring
- Implement comprehensive logging
- Set up alerting for critical metrics
- Visualize system performance

## References
- [Scalability Lecture](http://www.cs.cornell.edu/courses/cs5412/2012sp/slides/ds10f-scalability.pdf)
- [CAP Theorem](http://robertgreiner.com/2014/08/cap-theorem-revisited/)
- [System Design Primer Repository](https://github.com/donnemartin/system-design-primer)
