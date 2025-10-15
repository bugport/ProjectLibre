import { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

// Minimal OpenAPI 3.0 definition describing our current REST API
// Keep this in sync with the handlers in server.ts
const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Project Management API',
    version: '1.0.0',
    description: 'Simple in-memory API for projects, tasks, resources, and calendars.'
  },
  servers: [{ url: '/' }],
  components: {
    schemas: {
      Project: {
        type: 'object',
        required: ['id', 'name', 'startDate'],
        properties: {
          id: { type: 'string', example: 'c6a7d1ef-14f2-4f3e-8c76-1c2b9d1b7e77' },
          name: { type: 'string', example: 'Sample Project' },
          startDate: { type: 'string', example: '2025-01-06' },
          finishDate: { type: 'string', nullable: true, example: '2025-04-01' },
          description: { type: 'string', nullable: true }
        }
      },
      ProjectCreate: {
        type: 'object',
        required: ['name', 'startDate'],
        properties: {
          name: { type: 'string' },
          startDate: { type: 'string' },
          finishDate: { type: 'string' },
          description: { type: 'string' }
        }
      },
      Task: {
        type: 'object',
        required: ['id','projectId','name','start','finish','durationDays','percentComplete'],
        properties: {
          id: { type: 'string' },
          projectId: { type: 'string' },
          name: { type: 'string' },
          start: { type: 'string' },
          finish: { type: 'string' },
          durationDays: { type: 'number' },
          percentComplete: { type: 'number' },
          predecessors: { type: 'array', items: { type: 'string' } },
          resourceIds: { type: 'array', items: { type: 'string' } }
        }
      },
      TaskCreate: {
        type: 'object',
        required: ['projectId','name','start','finish','durationDays','percentComplete'],
        properties: {
          projectId: { type: 'string' },
          name: { type: 'string' },
          start: { type: 'string' },
          finish: { type: 'string' },
          durationDays: { type: 'number' },
          percentComplete: { type: 'number', minimum: 0, maximum: 100 },
          predecessors: { type: 'array', items: { type: 'string' } },
          resourceIds: { type: 'array', items: { type: 'string' } }
        }
      },
      Resource: {
        type: 'object',
        required: ['id','name','type','maxUnits','standardRate'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string', enum: ['Work','Material','Cost'] },
          maxUnits: { type: 'number' },
          standardRate: { type: 'number' }
        }
      },
      ResourceCreate: {
        type: 'object',
        required: ['name','type','maxUnits','standardRate'],
        properties: {
          name: { type: 'string' },
          type: { type: 'string', enum: ['Work','Material','Cost'] },
          maxUnits: { type: 'number' },
          standardRate: { type: 'number' }
        }
      },
      Calendar: {
        type: 'object',
        required: ['id','name','workingDays'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          workingDays: { type: 'array', items: { type: 'number', minimum: 0, maximum: 6 } },
          exceptions: { type: 'array', items: { type: 'object', properties: { date: { type: 'string' }, working: { type: 'boolean' } } } }
        }
      },
      CalendarCreate: {
        type: 'object',
        required: ['name','workingDays'],
        properties: {
          name: { type: 'string' },
          workingDays: { type: 'array', items: { type: 'number', minimum: 0, maximum: 6 } },
          exceptions: { type: 'array', items: { type: 'object', properties: { date: { type: 'string' }, working: { type: 'boolean' } } } }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' } } } } } } }
      }
    },

    '/api/projects': {
      get: {
        summary: 'List projects',
        responses: { '200': { description: 'Array of projects', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Project' } } } } } }
      },
      post: {
        summary: 'Create project',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectCreate' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } }, '400': { description: 'Validation error' } }
      }
    },
    '/api/projects/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: { summary: 'Get project', responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } }, '404': { description: 'Not found' } } },
      patch: { summary: 'Update project', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectCreate' } } } }, responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } } },
      delete: { summary: 'Delete project', responses: { '204': { description: 'No Content' }, '404': { description: 'Not found' } } }
    },

    '/api/tasks': {
      get: {
        summary: 'List tasks',
        parameters: [{ name: 'projectId', in: 'query', required: false, schema: { type: 'string' } }],
        responses: { '200': { description: 'Array of tasks', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } } } } } }
      },
      post: {
        summary: 'Create task',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskCreate' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } }, '400': { description: 'Validation error' } }
      }
    },
    '/api/tasks/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: { summary: 'Get task', responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } }, '404': { description: 'Not found' } } },
      patch: { summary: 'Update task', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskCreate' } } } }, responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } } },
      delete: { summary: 'Delete task', responses: { '204': { description: 'No Content' }, '404': { description: 'Not found' } } }
    },

    '/api/resources': {
      get: { summary: 'List resources', responses: { '200': { description: 'Array of resources', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Resource' } } } } } } },
      post: { summary: 'Create resource', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ResourceCreate' } } } }, responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Resource' } } } }, '400': { description: 'Validation error' } } }
    },
    '/api/resources/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: { summary: 'Get resource', responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Resource' } } } }, '404': { description: 'Not found' } } },
      patch: { summary: 'Update resource', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ResourceCreate' } } } }, responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } } },
      delete: { summary: 'Delete resource', responses: { '204': { description: 'No Content' }, '404': { description: 'Not found' } } }
    },

    '/api/calendars': {
      get: { summary: 'List calendars', responses: { '200': { description: 'Array of calendars', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Calendar' } } } } } } },
      post: { summary: 'Create calendar', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CalendarCreate' } } } }, responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Calendar' } } } }, '400': { description: 'Validation error' } } }
    },
    '/api/calendars/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: { summary: 'Get calendar', responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Calendar' } } } }, '404': { description: 'Not found' } } },
      patch: { summary: 'Update calendar', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CalendarCreate' } } } }, responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } } },
      delete: { summary: 'Delete calendar', responses: { '204': { description: 'No Content' }, '404': { description: 'Not found' } } }
    }
  }
} as const;

export function setupSwagger(app: Express) {
  app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.json(openApiSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
}
