import { render, screen } from '@testing-library/react'
import GanttPage from '../Gantt'

it('renders Gantt preview title', () => {
  render(<GanttPage />)
  expect(screen.getByRole('heading', { name: /gantt \(preview\)/i })).toBeInTheDocument()
})
