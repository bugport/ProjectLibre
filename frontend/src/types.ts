export type Task = {
  id: number;
  name: string;
  start: string; // ISO date string
  finish: string; // ISO date string
  durationDays: number;
  percentComplete: number; // 0-100
  predecessors?: number[];
};

export type Resource = {
  id: number;
  name: string;
  type: 'Work' | 'Material' | 'Cost';
  maxUnits: number; // percentage 0-100
  standardRate: number; // hourly rate
};
