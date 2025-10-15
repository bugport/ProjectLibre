export type Project = {
  id: string;
  name: string;
  startDate: string; // ISO
  finishDate?: string; // ISO
  description?: string;
};

export type Task = {
  id: string;
  projectId: string;
  name: string;
  start: string; // ISO
  finish: string; // ISO
  durationDays: number;
  percentComplete: number;
  predecessors?: string[];
  resourceIds?: string[];
};

export type Resource = {
  id: string;
  name: string;
  type: 'Work' | 'Material' | 'Cost';
  maxUnits: number; // 0-100
  standardRate: number;
};

export type Calendar = {
  id: string;
  name: string;
  workingDays: number[]; // 0-6 for Sun..Sat
  exceptions?: { date: string; working: boolean }[];
};
