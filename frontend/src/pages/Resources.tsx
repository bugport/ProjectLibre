import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { sampleResources } from '../data/sampleData';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Resource Name', flex: 1, minWidth: 200 },
  { field: 'type', headerName: 'Type', width: 120 },
  { field: 'maxUnits', headerName: 'Max Units (%)', width: 140 },
  { field: 'standardRate', headerName: 'Std. Rate', width: 120, valueFormatter: (p: any) => `$${p.value}/h` },
];

export default function ResourcesPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Resources
      </Typography>
      <Box sx={{ height: 520 }}>
        <DataGrid rows={sampleResources} columns={columns as any} pageSizeOptions={[10, 25, 50]} disableRowSelectionOnClick />
      </Box>
    </Box>
  );
}
