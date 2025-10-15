import { useEffect, useMemo, useState } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Routes, Route, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TableChartIcon from '@mui/icons-material/TableChart'
import EditIcon from '@mui/icons-material/Edit'
import SettingsIcon from '@mui/icons-material/Settings'
import TimelineIcon from '@mui/icons-material/Timeline'
import GroupIcon from '@mui/icons-material/Group'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AssessmentIcon from '@mui/icons-material/Assessment'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

const drawerWidth = 240

function App() {
  const [paletteMode, setPaletteMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('mui-mode')
    if (stored === 'light' || stored === 'dark') return stored
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem('mui-mode', paletteMode)
    const metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (metaTheme) {
      metaTheme.content = paletteMode === 'dark' ? '#121212' : '#ffffff'
    }
  }, [paletteMode])

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: paletteMode },
        typography: {
          fontFamily: [
            'Roboto',
            'Helvetica',
            'Arial',
            'sans-serif',
          ].join(','),
        },
      }),
    [paletteMode]
  )

  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, to: '/' },
    { label: 'Gantt', icon: <TimelineIcon />, to: '/gantt' },
    { label: 'Tasks', icon: <TableChartIcon />, to: '/tasks' },
    { label: 'Resources', icon: <GroupIcon />, to: '/resources' },
    { label: 'Calendar', icon: <CalendarMonthIcon />, to: '/calendar' },
    { label: 'Reports', icon: <AssessmentIcon />, to: '/reports' },
    { label: 'Form', icon: <EditIcon />, to: '/form' },
    { label: 'Settings', icon: <SettingsIcon />, to: '/settings' },
  ]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" sx={{ mr: 2 }} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              Project Frontend
            </Typography>
            <IconButton color="inherit" onClick={() => setPaletteMode((m) => (m === 'light' ? 'dark' : 'light'))} aria-label="toggle theme">
              {paletteMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {navItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton component={Link} to={item.to}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Suspense fallback={<Typography>Loading...</Typography>}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/gantt" element={<GanttLazy />} />
              <Route path="/tasks" element={<TasksLazy />} />
              <Route path="/resources" element={<ResourcesLazy />} />
              <Route path="/calendar" element={<CalendarLazy />} />
              <Route path="/reports" element={<ReportsLazy />} />
              <Route path="/form" element={<FormPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App

function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography color="text.secondary">
        Quick overview and KPIs.
      </Typography>
    </Box>
  )
}

// placeholder removed; using dedicated pages instead

function FormPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Form
      </Typography>
      <Typography color="text.secondary">Sample form inputs will go here.</Typography>
    </Box>
  )
}

function SettingsPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography color="text.secondary">Application preferences.</Typography>
    </Box>
  )
}

// Lazy-load larger pages
const GanttLazy = lazy(() => import('./pages/Gantt'))
const TasksLazy = lazy(() => import('./pages/Tasks'))
const ResourcesLazy = lazy(() => import('./pages/Resources'))
const CalendarLazy = lazy(() => import('./pages/Calendar'))
const ReportsLazy = lazy(() => import('./pages/Reports'))
