import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { sampleTasks } from '../data/sampleData';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Task Name', flex: 1, minWidth: 200 },
  { field: 'start', headerName: 'Start', width: 130 },
  { field: 'finish', headerName: 'Finish', width: 130 },
  { field: 'durationDays', headerName: 'Duration (d)', width: 120 },
  { field: 'percentComplete', headerName: '% Complete', width: 120 },
  { field: 'predecessorsStr', headerName: 'Predecessors', width: 160 },
];

export default function TasksPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <Box sx={{ height: 520 }}>
        <DataGrid
          rows={sampleTasks.map((t) => ({ ...t, predecessorsStr: t.predecessors?.join(', ') ?? '' }))}
          columns={columns as any}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
