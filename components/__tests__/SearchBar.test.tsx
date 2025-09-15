import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../SearchBar'

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('SearchBar Component', () => {
  it('renders search form elements', () => {
    render(<SearchBar />)

    expect(screen.getByPlaceholderText(/Search for businesses/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/City, State or ZIP/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('updates search query on user input', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const searchInput = screen.getByPlaceholderText(/Search for businesses/i)
    await user.type(searchInput, 'coffee shops')

    expect(searchInput).toHaveValue('coffee shops')
  })

  it('updates location on user input', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const locationInput = screen.getByPlaceholderText(/City, State or ZIP/i)
    await user.type(locationInput, 'San Francisco, CA')

    expect(locationInput).toHaveValue('San Francisco, CA')
  })

  it('disables search button when query is empty', () => {
    render(<SearchBar />)

    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeDisabled()
  })

  it('enables search button when both query and location are provided', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const searchInput = screen.getByPlaceholderText(/Search for businesses/i)
    const locationInput = screen.getByPlaceholderText(/City, State or ZIP/i)
    const searchButton = screen.getByRole('button', { name: /search/i })

    await user.type(searchInput, 'restaurants')
    await user.type(locationInput, 'New York')

    expect(searchButton).not.toBeDisabled()
  })

  it('displays filter button', () => {
    render(<SearchBar />)

    const filterButton = screen.getByRole('button', { name: /filter/i })
    expect(filterButton).toBeInTheDocument()
  })

  it('toggles filter panel when filter button is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const filterButton = screen.getByRole('button', { name: /filter/i })

    // Initially filter panel should not be visible
    expect(screen.queryByText('Category')).not.toBeInTheDocument()

    // Click to open filter panel
    await user.click(filterButton)

    // Filter panel should be visible
    await waitFor(() => {
      expect(screen.getByText('Category')).toBeInTheDocument()
      expect(screen.getByText('Search Radius')).toBeInTheDocument()
    })

    // Click again to close
    await user.click(filterButton)

    // Filter panel should be hidden
    await waitFor(() => {
      expect(screen.queryByText('Category')).not.toBeInTheDocument()
    })
  })

  it('updates filter values', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const filterButton = screen.getByRole('button', { name: /filter/i })
    await user.click(filterButton)

    // Wait for filter panel to be visible
    await waitFor(() => {
      expect(screen.getByText('Category')).toBeInTheDocument()
    })

    // Find the select elements by their container
    const selectElements = screen.getAllByRole('combobox')

    // First select is category (after checking there are at least 2 selects)
    expect(selectElements.length).toBeGreaterThanOrEqual(2)
    const categorySelect = selectElements[0]
    const radiusSelect = selectElements[1]

    // Update category
    await user.selectOptions(categorySelect, 'Restaurant')
    expect(categorySelect).toHaveValue('Restaurant')

    // Update radius
    await user.selectOptions(radiusSelect, '10')
    expect(radiusSelect).toHaveValue('10')
  })
})