"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.InMemoryStore = void 0;
const uuid_1 = require("uuid");
class InMemoryStore {
    projects = new Map();
    tasks = new Map();
    resources = new Map();
    calendars = new Map();
    constructor() {
        const pid = (0, uuid_1.v4)();
        const project = { id: pid, name: 'Sample Project', startDate: '2025-01-06' };
        this.projects.set(pid, project);
        const r1 = { id: (0, uuid_1.v4)(), name: 'Alice', type: 'Work', maxUnits: 100, standardRate: 80 };
        const r2 = { id: (0, uuid_1.v4)(), name: 'Bob', type: 'Work', maxUnits: 100, standardRate: 75 };
        this.resources.set(r1.id, r1);
        this.resources.set(r2.id, r2);
        const t1 = { id: (0, uuid_1.v4)(), projectId: pid, name: 'Kickoff', start: '2025-01-06', finish: '2025-01-06', durationDays: 1, percentComplete: 100 };
        const t2 = { id: (0, uuid_1.v4)(), projectId: pid, name: 'Requirements', start: '2025-01-07', finish: '2025-01-20', durationDays: 10, percentComplete: 60 };
        this.tasks.set(t1.id, t1);
        this.tasks.set(t2.id, t2);
        const cal = { id: (0, uuid_1.v4)(), name: 'Standard', workingDays: [1, 2, 3, 4, 5] };
        this.calendars.set(cal.id, cal);
    }
    // Projects
    listProjects() { return Array.from(this.projects.values()); }
    getProject(id) { return this.projects.get(id); }
    createProject(p) { const id = (0, uuid_1.v4)(); const proj = { id, ...p }; this.projects.set(id, proj); return proj; }
    updateProject(id, p) { const cur = this.projects.get(id); if (!cur)
        return undefined; const next = { ...cur, ...p, id: cur.id }; this.projects.set(id, next); return next; }
    deleteProject(id) { return this.projects.delete(id); }
    // Tasks
    listTasks(projectId) { const all = Array.from(this.tasks.values()); return projectId ? all.filter(t => t.projectId === projectId) : all; }
    getTask(id) { return this.tasks.get(id); }
    createTask(t) { const id = (0, uuid_1.v4)(); const task = { id, ...t }; this.tasks.set(id, task); return task; }
    updateTask(id, t) { const cur = this.tasks.get(id); if (!cur)
        return undefined; const next = { ...cur, ...t, id: cur.id }; this.tasks.set(id, next); return next; }
    deleteTask(id) { return this.tasks.delete(id); }
    // Resources
    listResources() { return Array.from(this.resources.values()); }
    getResource(id) { return this.resources.get(id); }
    createResource(r) { const id = (0, uuid_1.v4)(); const res = { id, ...r }; this.resources.set(id, res); return res; }
    updateResource(id, r) { const cur = this.resources.get(id); if (!cur)
        return undefined; const next = { ...cur, ...r, id: cur.id }; this.resources.set(id, next); return next; }
    deleteResource(id) { return this.resources.delete(id); }
    // Calendars
    listCalendars() { return Array.from(this.calendars.values()); }
    getCalendar(id) { return this.calendars.get(id); }
    createCalendar(c) { const id = (0, uuid_1.v4)(); const cal = { id, ...c }; this.calendars.set(id, cal); return cal; }
    updateCalendar(id, c) { const cur = this.calendars.get(id); if (!cur)
        return undefined; const next = { ...cur, ...c, id: cur.id }; this.calendars.set(id, next); return next; }
    deleteCalendar(id) { return this.calendars.delete(id); }
}
exports.InMemoryStore = InMemoryStore;
exports.store = new InMemoryStore();
