"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const store_1 = require("./store");
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Swagger UI and OpenAPI JSON
(0, swagger_1.setupSwagger)(app);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
// Projects
const ProjectSchema = zod_1.z.object({ name: zod_1.z.string(), startDate: zod_1.z.string(), finishDate: zod_1.z.string().optional(), description: zod_1.z.string().optional() });
app.get('/api/projects', (_req, res) => res.json(store_1.store.listProjects()));
app.post('/api/projects', (req, res) => { const parsed = ProjectSchema.safeParse(req.body); if (!parsed.success)
    return res.status(400).json(parsed.error.flatten()); return res.status(201).json(store_1.store.createProject(parsed.data)); });
app.get('/api/projects/:id', (req, res) => { const p = store_1.store.getProject(req.params.id); if (!p)
    return res.sendStatus(404); res.json(p); });
app.patch('/api/projects/:id', (req, res) => { const p = store_1.store.updateProject(req.params.id, req.body); if (!p)
    return res.sendStatus(404); res.json(p); });
app.delete('/api/projects/:id', (req, res) => { const ok = store_1.store.deleteProject(req.params.id); res.sendStatus(ok ? 204 : 404); });
// Tasks
const TaskSchema = zod_1.z.object({ projectId: zod_1.z.string(), name: zod_1.z.string(), start: zod_1.z.string(), finish: zod_1.z.string(), durationDays: zod_1.z.number(), percentComplete: zod_1.z.number().min(0).max(100), predecessors: zod_1.z.array(zod_1.z.string()).optional(), resourceIds: zod_1.z.array(zod_1.z.string()).optional() });
app.get('/api/tasks', (req, res) => { const projectId = req.query.projectId; res.json(store_1.store.listTasks(projectId)); });
app.post('/api/tasks', (req, res) => { const parsed = TaskSchema.safeParse(req.body); if (!parsed.success)
    return res.status(400).json(parsed.error.flatten()); return res.status(201).json(store_1.store.createTask(parsed.data)); });
app.get('/api/tasks/:id', (req, res) => { const t = store_1.store.getTask(req.params.id); if (!t)
    return res.sendStatus(404); res.json(t); });
app.patch('/api/tasks/:id', (req, res) => { const t = store_1.store.updateTask(req.params.id, req.body); if (!t)
    return res.sendStatus(404); res.json(t); });
app.delete('/api/tasks/:id', (req, res) => { const ok = store_1.store.deleteTask(req.params.id); res.sendStatus(ok ? 204 : 404); });
// Resources
const ResourceSchema = zod_1.z.object({ name: zod_1.z.string(), type: zod_1.z.enum(['Work', 'Material', 'Cost']), maxUnits: zod_1.z.number(), standardRate: zod_1.z.number() });
app.get('/api/resources', (_req, res) => res.json(store_1.store.listResources()));
app.post('/api/resources', (req, res) => { const parsed = ResourceSchema.safeParse(req.body); if (!parsed.success)
    return res.status(400).json(parsed.error.flatten()); return res.status(201).json(store_1.store.createResource(parsed.data)); });
app.get('/api/resources/:id', (req, res) => { const r = store_1.store.getResource(req.params.id); if (!r)
    return res.sendStatus(404); res.json(r); });
app.patch('/api/resources/:id', (req, res) => { const r = store_1.store.updateResource(req.params.id, req.body); if (!r)
    return res.sendStatus(404); res.json(r); });
app.delete('/api/resources/:id', (req, res) => { const ok = store_1.store.deleteResource(req.params.id); res.sendStatus(ok ? 204 : 404); });
// Calendars
const CalendarSchema = zod_1.z.object({ name: zod_1.z.string(), workingDays: zod_1.z.array(zod_1.z.number().min(0).max(6)), exceptions: zod_1.z.array(zod_1.z.object({ date: zod_1.z.string(), working: zod_1.z.boolean() })).optional() });
app.get('/api/calendars', (_req, res) => res.json(store_1.store.listCalendars()));
app.post('/api/calendars', (req, res) => { const parsed = CalendarSchema.safeParse(req.body); if (!parsed.success)
    return res.status(400).json(parsed.error.flatten()); return res.status(201).json(store_1.store.createCalendar(parsed.data)); });
app.get('/api/calendars/:id', (req, res) => { const c = store_1.store.getCalendar(req.params.id); if (!c)
    return res.sendStatus(404); res.json(c); });
app.patch('/api/calendars/:id', (req, res) => { const c = store_1.store.updateCalendar(req.params.id, req.body); if (!c)
    return res.sendStatus(404); res.json(c); });
app.delete('/api/calendars/:id', (req, res) => { const ok = store_1.store.deleteCalendar(req.params.id); res.sendStatus(ok ? 204 : 404); });
const port = process.env.PORT || 3001;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${port}`);
});
