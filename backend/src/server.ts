import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { store } from './store';
import { setupSwagger } from './swagger';

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI and OpenAPI JSON
setupSwagger(app);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Projects
const ProjectSchema = z.object({ name: z.string(), startDate: z.string(), finishDate: z.string().optional(), description: z.string().optional() });
app.get('/api/projects', (_req, res) => res.json(store.listProjects()));
app.post('/api/projects', (req, res) => { const parsed = ProjectSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json(parsed.error.flatten()); return res.status(201).json(store.createProject(parsed.data)); });
app.get('/api/projects/:id', (req, res) => { const p = store.getProject(req.params.id); if (!p) return res.sendStatus(404); res.json(p); });
app.patch('/api/projects/:id', (req, res) => { const p = store.updateProject(req.params.id, req.body); if (!p) return res.sendStatus(404); res.json(p); });
app.delete('/api/projects/:id', (req, res) => { const ok = store.deleteProject(req.params.id); res.sendStatus(ok ? 204 : 404); });

// Tasks
const TaskSchema = z.object({ projectId: z.string(), name: z.string(), start: z.string(), finish: z.string(), durationDays: z.number(), percentComplete: z.number().min(0).max(100), predecessors: z.array(z.string()).optional(), resourceIds: z.array(z.string()).optional() });
app.get('/api/tasks', (req, res) => { const projectId = req.query.projectId as string | undefined; res.json(store.listTasks(projectId)); });
app.post('/api/tasks', (req, res) => { const parsed = TaskSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json(parsed.error.flatten()); return res.status(201).json(store.createTask(parsed.data)); });
app.get('/api/tasks/:id', (req, res) => { const t = store.getTask(req.params.id); if (!t) return res.sendStatus(404); res.json(t); });
app.patch('/api/tasks/:id', (req, res) => { const t = store.updateTask(req.params.id, req.body); if (!t) return res.sendStatus(404); res.json(t); });
app.delete('/api/tasks/:id', (req, res) => { const ok = store.deleteTask(req.params.id); res.sendStatus(ok ? 204 : 404); });

// Resources
const ResourceSchema = z.object({ name: z.string(), type: z.enum(['Work','Material','Cost']), maxUnits: z.number(), standardRate: z.number() });
app.get('/api/resources', (_req, res) => res.json(store.listResources()));
app.post('/api/resources', (req, res) => { const parsed = ResourceSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json(parsed.error.flatten()); return res.status(201).json(store.createResource(parsed.data)); });
app.get('/api/resources/:id', (req, res) => { const r = store.getResource(req.params.id); if (!r) return res.sendStatus(404); res.json(r); });
app.patch('/api/resources/:id', (req, res) => { const r = store.updateResource(req.params.id, req.body); if (!r) return res.sendStatus(404); res.json(r); });
app.delete('/api/resources/:id', (req, res) => { const ok = store.deleteResource(req.params.id); res.sendStatus(ok ? 204 : 404); });

// Calendars
const CalendarSchema = z.object({ name: z.string(), workingDays: z.array(z.number().min(0).max(6)), exceptions: z.array(z.object({ date: z.string(), working: z.boolean() })).optional() });
app.get('/api/calendars', (_req, res) => res.json(store.listCalendars()));
app.post('/api/calendars', (req, res) => { const parsed = CalendarSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json(parsed.error.flatten()); return res.status(201).json(store.createCalendar(parsed.data)); });
app.get('/api/calendars/:id', (req, res) => { const c = store.getCalendar(req.params.id); if (!c) return res.sendStatus(404); res.json(c); });
app.patch('/api/calendars/:id', (req, res) => { const c = store.updateCalendar(req.params.id, req.body); if (!c) return res.sendStatus(404); res.json(c); });
app.delete('/api/calendars/:id', (req, res) => { const ok = store.deleteCalendar(req.params.id); res.sendStatus(ok ? 204 : 404); });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${port}`);
});
