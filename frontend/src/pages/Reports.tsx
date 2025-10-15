import { Box, Typography, Paper } from '@mui/material';

export default function ReportsPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography color="text.secondary">Report templates and exports coming soon.</Typography>
      </Paper>
    </Box>
  );
}
