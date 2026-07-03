const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Notes API',
      version: '1.0.0',
      description: 'API for the Smart Notes workspace application',
    },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Note: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['active', 'archived'] },
            isPinned: { type: 'boolean' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            token: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            401: { description: 'Not authorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/notes': {
        get: {
          tags: ['Notes'],
          summary: 'Get all notes for the current user',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search in title, content, tags' },
            { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category' },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'archived'] }, description: 'Filter by status' },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['newest', 'oldest', 'title', 'updated'] }, description: 'Sort order' },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
          ],
          responses: {
            200: {
              description: 'List of notes',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      notes: { type: 'array', items: { $ref: '#/components/schemas/Note' } },
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      pages: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Notes'],
          summary: 'Create a new note',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string', example: 'My Note' },
                    content: { type: 'string', example: 'Note content here' },
                    category: { type: 'string', example: 'work' },
                    tags: { type: 'array', items: { type: 'string' }, example: ['tag1', 'tag2'] },
                    status: { type: 'string', enum: ['active', 'archived'], example: 'active' },
                    isPinned: { type: 'boolean', example: false },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Note created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/notes/{id}': {
        get: {
          tags: ['Notes'],
          summary: 'Get a single note by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Note details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } } },
            404: { description: 'Note not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        patch: {
          tags: ['Notes'],
          summary: 'Update a note',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    category: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } },
                    status: { type: 'string', enum: ['active', 'archived'] },
                    isPinned: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Note updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } } },
            404: { description: 'Note not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        delete: {
          tags: ['Notes'],
          summary: 'Delete a note',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Note deleted', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
            404: { description: 'Note not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
