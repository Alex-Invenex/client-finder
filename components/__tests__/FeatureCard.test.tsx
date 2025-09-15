import { render, screen } from '@testing-library/react'
import FeatureCard from '../FeatureCard'
import { Search } from 'lucide-react'

describe('FeatureCard Component', () => {
  const mockProps = {
    icon: Search,
    title: 'Test Feature',
    description: 'This is a test feature description',
    iconBgColor: 'bg-primary-100',
    iconColor: 'text-primary-600'
  }

  it('renders the feature card with all props', () => {
    render(<FeatureCard {...mockProps} />)

    expect(screen.getByText(mockProps.title)).toBeInTheDocument()
    expect(screen.getByText(mockProps.description)).toBeInTheDocument()
  })

  it('displays the icon', () => {
    render(<FeatureCard {...mockProps} />)

    const iconContainer = screen.getByText(mockProps.title).parentElement?.querySelector('svg')
    expect(iconContainer).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    render(<FeatureCard {...mockProps} />)

    const card = screen.getByText(mockProps.title).closest('.card')
    expect(card).toHaveClass('hover:shadow-xl', 'transition-shadow', 'duration-300')
  })

  it('applies correct icon background color', () => {
    render(<FeatureCard {...mockProps} />)

    const iconContainer = screen.getByText(mockProps.title).parentElement?.querySelector('.bg-primary-100')
    expect(iconContainer).toBeInTheDocument()
  })

  it('applies correct icon text color', () => {
    render(<FeatureCard {...mockProps} />)

    const iconContainer = screen.getByText(mockProps.title).parentElement?.querySelector('.text-primary-600')
    expect(iconContainer).toBeInTheDocument()
  })

  it('renders with different icon', () => {
    const { rerender } = render(<FeatureCard {...mockProps} />)

    // Change to a different icon
    const newProps = {
      ...mockProps,
      icon: Search,
      title: 'Different Feature'
    }

    rerender(<FeatureCard {...newProps} />)

    expect(screen.getByText('Different Feature')).toBeInTheDocument()
  })

  it('renders long description correctly', () => {
    const longDescription = 'This is a very long description that contains multiple sentences. It should be rendered correctly within the feature card component without any issues.'

    render(<FeatureCard {...mockProps} description={longDescription} />)

    expect(screen.getByText(longDescription)).toBeInTheDocument()
  })
})