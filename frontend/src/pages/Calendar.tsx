import { Box, Typography, Paper } from '@mui/material';

export default function CalendarPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Calendar
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography color="text.secondary">Calendar view coming soon.</Typography>
      </Paper>
    </Box>
  );
}
