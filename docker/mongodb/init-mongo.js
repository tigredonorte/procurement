// MongoDB initialization script
// This script runs when MongoDB container starts for the first time

// Switch to the procurement database
db = db.getSiblingDB('procurement');

// Create collections with schema validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        name: {
          bsonType: 'string',
          minLength: 1
        },
        role: {
          enum: ['admin', 'researcher', 'viewer']
        },
        createdAt: {
          bsonType: 'date'
        },
        updatedAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

db.createCollection('research_requests', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'query', 'status', 'createdAt'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1
        },
        query: {
          bsonType: 'string',
          minLength: 1
        },
        status: {
          enum: ['pending', 'processing', 'completed', 'failed']
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

db.createCollection('search_results', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['requestId', 'data', 'createdAt'],
      properties: {
        requestId: {
          bsonType: 'objectId'
        },
        data: {
          bsonType: 'object'
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

db.research_requests.createIndex({ status: 1 });
db.research_requests.createIndex({ createdAt: -1 });
db.research_requests.createIndex({ userId: 1, createdAt: -1 });

db.search_results.createIndex({ requestId: 1 });
db.search_results.createIndex({ createdAt: -1 });

// Create a service user for the application
db.createUser({
  user: 'procurement_app',
  pwd: 'procurement_password',
  roles: [
    {
      role: 'readWrite',
      db: 'procurement'
    }
  ]
});

print('MongoDB initialization completed successfully');
print('Created collections: users, research_requests, search_results');
print('Created indexes for optimal performance');
print('Created application user: procurement_app');