import { render, screen } from '@testing-library/react'
import Dashboard from '@/app/page'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  PieChart: () => <div data-testid="pie-chart">Pie Chart</div>,
  Pie: () => null,
  Cell: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  Tooltip: () => null,
  Legend: () => null,
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => null,
}))

const MockedDashboard = () => (
  <ThemeProvider>
    <Dashboard />
  </ThemeProvider>
)

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<MockedDashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders stat cards', () => {
    render(<MockedDashboard />)
    expect(screen.getByText('Total Income')).toBeInTheDocument()
    expect(screen.getByText('Total Expenses')).toBeInTheDocument()
    expect(screen.getByText('Net Income')).toBeInTheDocument()
    expect(screen.getByText('Budget Used')).toBeInTheDocument()
  })

  it('renders expense chart', () => {
    render(<MockedDashboard />)
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('renders savings goals section', () => {
    render(<MockedDashboard />)
    expect(screen.getByText('Savings Goals')).toBeInTheDocument()
    expect(screen.getByText('Emergency Fund')).toBeInTheDocument()
    expect(screen.getByText('Vacation')).toBeInTheDocument()
    expect(screen.getByText('New Car')).toBeInTheDocument()
  })

  it('renders recent transactions section', () => {
    render(<MockedDashboard />)
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
    expect(screen.getByText('Grocery Shopping')).toBeInTheDocument()
    expect(screen.getByText('Salary Deposit')).toBeInTheDocument()
  })
})
