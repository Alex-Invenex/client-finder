import { render, screen } from '@testing-library/react'
import Navbar from '../Navbar'

describe('Navbar Component', () => {
  it('renders the navigation bar', () => {
    render(<Navbar />)

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('displays the brand name', () => {
    render(<Navbar />)

    const brand = screen.getByRole('heading', { level: 1 })
    expect(brand).toBeInTheDocument()
    expect(brand).toHaveTextContent('Client Finder')
  })

  it('shows navigation links', () => {
    render(<Navbar />)

    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })

  it('displays authentication buttons', () => {
    render(<Navbar />)

    const signInLink = screen.getByRole('link', { name: /sign in/i })
    const getStartedLink = screen.getByRole('link', { name: /get started/i })

    expect(signInLink).toBeInTheDocument()
    expect(getStartedLink).toBeInTheDocument()
  })

  it('has correct link hrefs', () => {
    render(<Navbar />)

    const searchLink = screen.getByRole('link', { name: /search/i })
    const pricingLink = screen.getByRole('link', { name: /pricing/i })
    const signInLink = screen.getByRole('link', { name: /sign in/i })
    const getStartedLink = screen.getByRole('link', { name: /get started/i })

    expect(searchLink).toHaveAttribute('href', '/search')
    expect(pricingLink).toHaveAttribute('href', '/pricing')
    expect(signInLink).toHaveAttribute('href', '/auth/login')
    expect(getStartedLink).toHaveAttribute('href', '/auth/register')
  })

  it('shows mobile menu button on small screens', () => {
    render(<Navbar />)

    const mobileMenuButton = screen.getByRole('button')
    expect(mobileMenuButton).toBeInTheDocument()
    expect(mobileMenuButton).toHaveClass('md:hidden')
  })
})