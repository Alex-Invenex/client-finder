import { render, screen, fireEvent } from '@testing-library/react'
import Hero from '../Hero'

describe('Hero Component', () => {
  it('renders the hero section with correct heading', () => {
    render(<Hero />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Find Your Next Perfect Client')
  })

  it('displays the search form', () => {
    render(<Hero />)

    const searchInput = screen.getByPlaceholderText(/restaurants in New York/i)
    const locationInput = screen.getByPlaceholderText(/City, State or ZIP/i)
    const searchButton = screen.getByRole('button', { name: /search/i })

    expect(searchInput).toBeInTheDocument()
    expect(locationInput).toBeInTheDocument()
    expect(searchButton).toBeInTheDocument()
  })

  it('shows the feature badges', () => {
    render(<Hero />)

    expect(screen.getByText('10M+ Businesses')).toBeInTheDocument()
    expect(screen.getByText('Real-time Data')).toBeInTheDocument()
    expect(screen.getByText('Verified Contacts')).toBeInTheDocument()
  })

  it('updates search input value on user input', () => {
    render(<Hero />)

    const searchInput = screen.getByPlaceholderText(/restaurants in New York/i) as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: 'coffee shops' } })

    expect(searchInput.value).toBe('coffee shops')
  })

  it('updates location input value on user input', () => {
    render(<Hero />)

    const locationInput = screen.getByPlaceholderText(/City, State or ZIP/i) as HTMLInputElement
    fireEvent.change(locationInput, { target: { value: 'San Francisco' } })

    expect(locationInput.value).toBe('San Francisco')
  })

  it('displays filter button', () => {
    render(<Hero />)

    const filterButton = screen.getByRole('button', { name: /filter/i })
    expect(filterButton).toBeInTheDocument()
  })

  it('disables search button when inputs are empty', () => {
    render(<Hero />)

    const searchButton = screen.getByRole('button', { name: /search/i })
    expect(searchButton).toBeDisabled()
  })

  it('enables search button when both search and location inputs have values', () => {
    render(<Hero />)

    const searchInput = screen.getByPlaceholderText(/restaurants in New York/i)
    const locationInput = screen.getByPlaceholderText(/City, State or ZIP/i)
    const searchButton = screen.getByRole('button', { name: /search/i })

    // Button should be disabled with only search input
    fireEvent.change(searchInput, { target: { value: 'restaurants' } })
    expect(searchButton).toBeDisabled()

    // Button should be enabled when both inputs have values
    fireEvent.change(locationInput, { target: { value: 'New York' } })
    expect(searchButton).not.toBeDisabled()
  })
})