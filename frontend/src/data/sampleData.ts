import type { Task, Resource } from '../types';

export const sampleTasks: Task[] = [
  { id: 1, name: 'Project kickoff', start: '2025-01-06', finish: '2025-01-06', durationDays: 1, percentComplete: 100 },
  { id: 2, name: 'Requirements', start: '2025-01-07', finish: '2025-01-20', durationDays: 10, percentComplete: 60 },
  { id: 3, name: 'Design', start: '2025-01-21', finish: '2025-02-03', durationDays: 10, percentComplete: 30, predecessors: [2] },
  { id: 4, name: 'Implementation', start: '2025-02-04', finish: '2025-03-03', durationDays: 20, percentComplete: 10, predecessors: [3] },
  { id: 5, name: 'Testing', start: '2025-03-04', finish: '2025-03-17', durationDays: 10, percentComplete: 0, predecessors: [4] },
];

export const sampleResources: Resource[] = [
  { id: 1, name: 'Alice', type: 'Work', maxUnits: 100, standardRate: 80 },
  { id: 2, name: 'Bob', type: 'Work', maxUnits: 100, standardRate: 75 },
  { id: 3, name: 'Carol', type: 'Work', maxUnits: 50, standardRate: 60 },
  { id: 4, name: 'Steel (kg)', type: 'Material', maxUnits: 100, standardRate: 2 },
];
