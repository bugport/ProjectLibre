import { Box, Paper, Typography } from '@mui/material';
import { sampleTasks } from '../data/sampleData';

function daysBetween(a: Date, b: Date) {
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function GanttPage() {
  const tasks = sampleTasks;
  const starts = tasks.map((t) => new Date(t.start));
  const finishes = tasks.map((t) => new Date(t.finish));
  const minStart = new Date(Math.min(...starts.map((d) => d.getTime())));
  const maxFinish = new Date(Math.max(...finishes.map((d) => d.getTime())));
  const totalDays = daysBetween(minStart, maxFinish);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gantt (preview)
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 2 }}>
          <Box>
            {tasks.map((t) => (
              <Box key={t.id} sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography>{t.name}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ position: 'relative', minHeight: tasks.length * 48 }}>
            {tasks.map((t, idx) => {
              const start = new Date(t.start);
              const finish = new Date(t.finish);
              const offsetDays = daysBetween(minStart, start) - 1;
              const spanDays = daysBetween(start, finish);
              const leftPct = (offsetDays / totalDays) * 100;
              const widthPct = (spanDays / totalDays) * 100;
              return (
                <Box key={t.id} sx={{ position: 'absolute', left: `${leftPct}%`, top: idx * 48 + 12, width: `${widthPct}%`, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
              );
            })}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
