import { render, screen } from '@testing-library/react'
import TasksPage from '../Tasks'
import { vi } from 'vitest'

vi.mock('@mui/x-data-grid', () => ({
  DataGrid: (props: any) => <div role="grid" data-testid="data-grid" {...props} />,
}))

it('renders Tasks page title and grid', () => {
  render(<TasksPage />)
  expect(screen.getByRole('heading', { name: /tasks/i })).toBeInTheDocument()
  // DataGrid renders grid role
  expect(screen.getByRole('grid')).toBeInTheDocument()
})
