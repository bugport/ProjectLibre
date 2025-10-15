import { Calendar, Project, Resource, Task } from './types';
import { v4 as uuid } from 'uuid';

export class InMemoryStore {
  private projects = new Map<string, Project>();
  private tasks = new Map<string, Task>();
  private resources = new Map<string, Resource>();
  private calendars = new Map<string, Calendar>();

  constructor() {
    const pid = uuid();
    const project: Project = { id: pid, name: 'Sample Project', startDate: '2025-01-06' };
    this.projects.set(pid, project);
    const r1: Resource = { id: uuid(), name: 'Alice', type: 'Work', maxUnits: 100, standardRate: 80 };
    const r2: Resource = { id: uuid(), name: 'Bob', type: 'Work', maxUnits: 100, standardRate: 75 };
    this.resources.set(r1.id, r1);
    this.resources.set(r2.id, r2);
    const t1: Task = { id: uuid(), projectId: pid, name: 'Kickoff', start: '2025-01-06', finish: '2025-01-06', durationDays: 1, percentComplete: 100 };
    const t2: Task = { id: uuid(), projectId: pid, name: 'Requirements', start: '2025-01-07', finish: '2025-01-20', durationDays: 10, percentComplete: 60 };
    this.tasks.set(t1.id, t1);
    this.tasks.set(t2.id, t2);
    const cal: Calendar = { id: uuid(), name: 'Standard', workingDays: [1,2,3,4,5] };
    this.calendars.set(cal.id, cal);
  }

  // Projects
  listProjects(): Project[] { return Array.from(this.projects.values()); }
  getProject(id: string): Project | undefined { return this.projects.get(id); }
  createProject(p: Omit<Project, 'id'>): Project { const id = uuid(); const proj: Project = { id, ...p }; this.projects.set(id, proj); return proj; }
  updateProject(id: string, p: Partial<Project>): Project | undefined { const cur = this.projects.get(id); if (!cur) return undefined; const next = { ...cur, ...p, id: cur.id }; this.projects.set(id, next); return next; }
  deleteProject(id: string): boolean { return this.projects.delete(id); }

  // Tasks
  listTasks(projectId?: string): Task[] { const all = Array.from(this.tasks.values()); return projectId ? all.filter(t => t.projectId === projectId) : all; }
  getTask(id: string): Task | undefined { return this.tasks.get(id); }
  createTask(t: Omit<Task, 'id'>): Task { const id = uuid(); const task: Task = { id, ...t }; this.tasks.set(id, task); return task; }
  updateTask(id: string, t: Partial<Task>): Task | undefined { const cur = this.tasks.get(id); if (!cur) return undefined; const next = { ...cur, ...t, id: cur.id }; this.tasks.set(id, next); return next; }
  deleteTask(id: string): boolean { return this.tasks.delete(id); }

  // Resources
  listResources(): Resource[] { return Array.from(this.resources.values()); }
  getResource(id: string): Resource | undefined { return this.resources.get(id); }
  createResource(r: Omit<Resource, 'id'>): Resource { const id = uuid(); const res: Resource = { id, ...r }; this.resources.set(id, res); return res; }
  updateResource(id: string, r: Partial<Resource>): Resource | undefined { const cur = this.resources.get(id); if (!cur) return undefined; const next = { ...cur, ...r, id: cur.id }; this.resources.set(id, next); return next; }
  deleteResource(id: string): boolean { return this.resources.delete(id); }

  // Calendars
  listCalendars(): Calendar[] { return Array.from(this.calendars.values()); }
  getCalendar(id: string): Calendar | undefined { return this.calendars.get(id); }
  createCalendar(c: Omit<Calendar, 'id'>): Calendar { const id = uuid(); const cal: Calendar = { id, ...c }; this.calendars.set(id, cal); return cal; }
  updateCalendar(id: string, c: Partial<Calendar>): Calendar | undefined { const cur = this.calendars.get(id); if (!cur) return undefined; const next = { ...cur, ...c, id: cur.id }; this.calendars.set(id, next); return next; }
  deleteCalendar(id: string): boolean { return this.calendars.delete(id); }
}

export const store = new InMemoryStore();
